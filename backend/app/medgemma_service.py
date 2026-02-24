"""
Bisheshoggo AI - MedGemma Service (Local GPU Inference)
Runs google/medgemma-4b-it locally via HuggingFace transformers with 4-bit quantization.
Falls back to Gemma API (google-genai) or Groq if local model is unavailable.

This fulfills the MedGemma Impact Challenge requirement of using real MedGemma
from Google's Health AI Developer Foundations (HAI-DEF).
"""
import json
import os
import re
import threading
import traceback

# Prevent transformers from importing TensorFlow (saves ~500MB RAM)
os.environ["USE_TF"] = "0"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"

import torch
from .config import settings

# ── Model identifiers ────────────────────────────────────────────
MEDGEMMA_MODEL_ID = "unsloth/medgemma-4b-it-bnb-4bit"  # Pre-quantized 4-bit (non-gated mirror)
MEDGEMMA_ORIGINAL_ID = "google/medgemma-4b-it"         # Original gated model
MEDGEMMA_TEXT_MODEL = "medgemma-4b-it"            # display name
GEMMA_FALLBACK_MODEL = "gemma-3-27b-it"           # Gemma API fallback

# ── Global model state (singleton) ───────────────────────────────
_model = None
_processor = None
_model_lock = threading.Lock()
_model_load_attempted = False
_model_load_error = None


def _get_hf_token():
    """Get HuggingFace token from settings or environment."""
    token = getattr(settings, "HF_TOKEN", "") or os.environ.get("HF_TOKEN", "")
    return token if token else None


def _load_model():
    """Load MedGemma-4B-IT with 4-bit quantization (bitsandbytes NF4)."""
    global _model, _processor, _model_load_attempted, _model_load_error

    with _model_lock:
        if _model_load_attempted:
            return _model is not None
        _model_load_attempted = True

        try:
            from transformers import AutoProcessor, AutoModelForImageTextToText

            if not torch.cuda.is_available():
                _model_load_error = "CUDA not available - MedGemma requires a GPU"
                print(f"[MedGemma] {_model_load_error}")
                return False

            # Check if system has enough free RAM (need ~4 GB to safely load 3 GB model)
            try:
                import psutil
                free_ram_gb = psutil.virtual_memory().available / 1024**3
                print(f"[MedGemma] Available RAM: {free_ram_gb:.1f} GB")
                if free_ram_gb < 3.5:
                    _model_load_error = f"Insufficient RAM ({free_ram_gb:.1f} GB free, need 3.5+ GB). Using API fallback."
                    print(f"[MedGemma] {_model_load_error}")
                    return False
            except ImportError:
                pass  # psutil not installed, try anyway

            hf_token = _get_hf_token()

            gpu_name = torch.cuda.get_device_name(0)
            vram_total = torch.cuda.get_device_properties(0).total_memory / 1024**3
            print(f"[MedGemma] Loading {MEDGEMMA_MODEL_ID} (pre-quantized 4-bit)...")
            print(f"[MedGemma] GPU: {gpu_name}, VRAM: {vram_total:.1f} GB")

            # Try the original gated model first, then fall back to unsloth mirror
            model_id = MEDGEMMA_MODEL_ID
            try_original = False

            if try_original and hf_token:
                try:
                    from transformers import BitsAndBytesConfig
                    quantization_config = BitsAndBytesConfig(
                        load_in_4bit=True,
                        bnb_4bit_compute_dtype=torch.bfloat16,
                        bnb_4bit_quant_type="nf4",
                        bnb_4bit_use_double_quant=True,
                    )
                    _processor = AutoProcessor.from_pretrained(
                        MEDGEMMA_ORIGINAL_ID, token=hf_token,
                    )
                    _model = AutoModelForImageTextToText.from_pretrained(
                        MEDGEMMA_ORIGINAL_ID,
                        quantization_config=quantization_config,
                        dtype=torch.bfloat16,
                        device_map="auto",
                        token=hf_token,
                    )
                    model_id = MEDGEMMA_ORIGINAL_ID
                    vram_used = torch.cuda.memory_allocated(0) / 1024**3
                    print(f"[MedGemma] Original model loaded! VRAM used: {vram_used:.1f} GB")
                    return True
                except Exception as orig_err:
                    print(f"[MedGemma] Original model unavailable ({orig_err}), using pre-quantized mirror...")

            # Load pre-quantized unsloth mirror (no gating required)
            _processor = AutoProcessor.from_pretrained(
                MEDGEMMA_MODEL_ID,
                token=hf_token,
            )

            # Free any cached memory before loading model weights
            import gc
            gc.collect()
            torch.cuda.empty_cache()

            _model = AutoModelForImageTextToText.from_pretrained(
                MEDGEMMA_MODEL_ID,
                dtype=torch.bfloat16,
                device_map="cuda:0",
                low_cpu_mem_usage=True,
                token=hf_token,
            )

            vram_used = torch.cuda.memory_allocated(0) / 1024**3
            print(f"[MedGemma] Model loaded! VRAM used: {vram_used:.1f} GB")
            return True

        except Exception as e:
            _model_load_error = str(e)
            print(f"[MedGemma] Failed to load model: {e}")
            traceback.print_exc()
            _model = None
            _processor = None
            return False


# ── Kick off background preload if GPU available ──────────────
def _start_preload():
    t = threading.Thread(target=_load_model, daemon=True)
    t.start()


# NOTE: Auto-preload disabled to save RAM on memory-constrained systems (8 GB).
# Model loads lazily on first request instead. Un-comment to preload:
# if torch.cuda.is_available():
#     _start_preload()


# ── Public helpers ────────────────────────────────────────────
def is_model_loaded():
    """Check if the local MedGemma model is loaded and ready."""
    return _model is not None and _processor is not None


def get_model_status():
    """Return a dict describing current model state."""
    if is_model_loaded():
        vram = torch.cuda.memory_allocated(0) / 1024**3
        return {
            "loaded": True,
            "model": MEDGEMMA_MODEL_ID,
            "display_name": MEDGEMMA_TEXT_MODEL,
            "vram_used_gb": round(vram, 1),
            "device": "cuda",
        }
    return {
        "loaded": False,
        "error": _model_load_error,
        "attempted": _model_load_attempted,
    }


# ── Core generation ──────────────────────────────────────────
def _generate_text(messages: list, max_new_tokens: int = 2048, temperature: float = 0.3):
    """Generate text using the local MedGemma model."""
    if not is_model_loaded():
        if not _load_model():
            raise RuntimeError(f"MedGemma model not available: {_model_load_error}")

    # Convert plain string content to structured format for Gemma 3 chat template
    formatted_messages = []
    for msg in messages:
        content = msg["content"]
        if isinstance(content, str):
            content = [{"type": "text", "text": content}]
        formatted_messages.append({"role": msg["role"], "content": content})

    # Use tokenize=False to get text, then tokenize manually
    # This avoids the torch>=2.6 mask function requirement
    prompt_text = _processor.apply_chat_template(
        formatted_messages,
        add_generation_prompt=True,
        tokenize=False,
    )

    inputs = _processor(
        text=prompt_text,
        return_tensors="pt",
    ).to("cuda")

    with torch.no_grad():
        output = _model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature if temperature > 0 else None,
            do_sample=temperature > 0,
            top_p=0.9 if temperature > 0 else None,
        )

    response = _processor.decode(
        output[0][inputs["input_ids"].shape[-1]:],
        skip_special_tokens=True,
    )
    return response


# ── Gemma API fallback ────────────────────────────────────────
def _get_gemma_fallback_client():
    """Get Google GenAI client for Gemma API fallback."""
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY required for Gemma fallback")
    from google import genai
    return genai.Client(api_key=settings.GOOGLE_API_KEY)


# ── System instruction ───────────────────────────────────────
MEDGEMMA_SYSTEM_INSTRUCTION = """You are a medical AI assistant powered by MedGemma, part of Google's Health AI Developer Foundations (HAI-DEF). 
You serve Bisheshoggo AI, a healthcare platform for rural Bangladesh's Hill Tracts region.

Your capabilities:
- Evidence-based medical symptom analysis and triage
- Medication information and interaction checking  
- Health education in simple, accessible language
- Clinical decision support for community health workers
- Culturally sensitive health guidance for rural Bangladesh

Guidelines:
- Always recommend professional medical consultation for serious symptoms
- Use simple language accessible to users with limited medical knowledge
- Consider the rural context with limited healthcare access
- Provide practical guidance including home remedies for minor ailments
- Be empathetic, supportive, and culturally sensitive
- Include Bengali (বাংলা) translations where helpful
- Flag emergency symptoms clearly with urgency levels
- Never provide definitive diagnoses - frame as possibilities requiring professional evaluation

You are built on Google's MedGemma model, specifically designed for healthcare applications."""


# ═══════════════════════════════════════════════════════════════
#  PUBLIC API  (same signatures the rest of the app relies on)
# ═══════════════════════════════════════════════════════════════

async def medgemma_chat(messages: list, stream: bool = False):
    """
    Chat with MedGemma for medical Q&A.
    Tries local model first, falls back to Gemma API.
    """
    # ── Try local MedGemma ──
    try:
        chat_messages = [{"role": "system", "content": MEDGEMMA_SYSTEM_INSTRUCTION}]
        for msg in messages:
            role = "user" if msg["role"] == "user" else "assistant"
            chat_messages.append({"role": role, "content": msg["content"]})

        response = _generate_text(chat_messages)
        return {"content": response, "model": MEDGEMMA_TEXT_MODEL}
    except Exception as e:
        print(f"[MedGemma] Local chat failed ({e}), falling back to Gemma API...")

    # ── Gemma API fallback ──
    try:
        from google.genai import types
        client = _get_gemma_fallback_client()

        contents = [
            types.Content(
                role="user",
                parts=[types.Part(text=f"[System Instructions]\n{MEDGEMMA_SYSTEM_INSTRUCTION}\n[End System Instructions]\nPlease acknowledge and follow these instructions.")]
            ),
            types.Content(
                role="model",
                parts=[types.Part(text="I understand. I am a medical AI assistant for Bisheshoggo AI. How can I help you?")]
            ),
        ]
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))

        response = client.models.generate_content(
            model=GEMMA_FALLBACK_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=2048),
        )
        return {"content": response.text, "model": GEMMA_FALLBACK_MODEL}
    except Exception as e2:
        print(f"[MedGemma] Gemma API fallback also failed: {e2}")
        raise


async def medgemma_symptom_analysis(symptoms: list, severity: str, duration: str, additional_notes: str = ""):
    """Use MedGemma for evidence-based symptom analysis and triage."""
    symptoms_text = ", ".join(symptoms)

    prompt = f"""Analyze the following patient symptoms and provide a structured medical assessment.

PATIENT SYMPTOMS: {symptoms_text}
SEVERITY: {severity}
DURATION: {duration}
ADDITIONAL NOTES: {additional_notes or "None provided"}

CONTEXT: Patient is in rural Bangladesh with limited healthcare access.

Provide your analysis in the following JSON format:
{{
    "diagnosis": "Most likely condition name",
    "suggested_conditions": ["Condition 1", "Condition 2", "Condition 3"],
    "recommendations": "Detailed recommendations in both English and Bengali",
    "urgency_level": "emergency|high|moderate|low",
    "home_remedies": ["Remedy 1", "Remedy 2"],
    "warning_signs": ["Warning 1", "Warning 2"],
    "should_see_doctor": true/false,
    "triage_reasoning": "Brief clinical reasoning for the triage level",
    "follow_up": "When to follow up or seek further care"
}}

Be thorough but practical. Consider common conditions in Bangladesh (tropical diseases, waterborne illnesses, nutritional deficiencies).
Respond ONLY with the JSON object, no additional text."""

    # ── Try local MedGemma ──
    try:
        chat_messages = [
            {"role": "system", "content": "You are a medical AI triage assistant. Respond only with valid JSON."},
            {"role": "user", "content": prompt},
        ]
        response_text = _generate_text(chat_messages, temperature=0.2)
        model_used = MEDGEMMA_TEXT_MODEL
    except Exception as e:
        print(f"[MedGemma] Local symptom analysis failed ({e}), falling back to Gemma API...")
        # ── Gemma API fallback ──
        try:
            from google.genai import types
            client = _get_gemma_fallback_client()
            full_prompt = "[System: You are a medical AI triage assistant. Respond only with valid JSON.]\n\n" + prompt
            response = client.models.generate_content(
                model=GEMMA_FALLBACK_MODEL,
                contents=[types.Content(role="user", parts=[types.Part(text=full_prompt)])],
                config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=2048),
            )
            response_text = response.text
            model_used = GEMMA_FALLBACK_MODEL
        except Exception as e2:
            print(f"[MedGemma] Gemma API fallback also failed: {e2}")
            raise

    # Parse JSON response
    response_text = response_text.strip()
    if response_text.startswith("```"):
        response_text = response_text.split("\n", 1)[1]
        if response_text.endswith("```"):
            response_text = response_text[:-3].strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {
                "diagnosis": "Unable to parse AI response",
                "suggested_conditions": ["Please consult a healthcare professional"],
                "recommendations": response_text,
                "urgency_level": "moderate",
                "home_remedies": [],
                "warning_signs": ["If symptoms worsen, seek immediate medical care"],
                "should_see_doctor": True,
                "triage_reasoning": "AI response could not be structured",
                "follow_up": "Consult a healthcare professional as soon as possible"
            }

    result["model"] = model_used
    return result


async def medgemma_medicine_analysis(prescriptions: list, diagnosis: str = "", patient_history: str = ""):
    """Use MedGemma for medicine interaction checking and recommendations."""
    prompt = f"""As a medical AI assistant, analyze these prescribed medicines for a patient in rural Bangladesh.

PRESCRIBED MEDICINES:
{json.dumps(prescriptions, indent=2)}

DIAGNOSIS: {diagnosis or "Not specified"}
PATIENT HISTORY: {patient_history or "Not provided"}

Provide analysis in JSON format:
{{
    "suggestions": [
        {{
            "medicine": "Medicine name",
            "reason": "Why this medicine is prescribed and if it's appropriate",
            "shouldTake": "YES - Continue taking" or "NO - Not needed" or "CONSULT - Needs doctor review",
            "alternatives": ["Available alternatives in rural Bangladesh"],
            "precautions": ["Important precautions"],
            "interactions": ["Drug interactions to watch"],
            "effectiveness": "high|moderate|low"
        }}
    ],
    "overallRecommendation": "Summary guidance",
    "warnings": ["Critical warnings"],
    "interactionAlerts": ["Any dangerous drug interactions found"]
}}

Consider medicine availability and cost in rural Bangladesh. Respond ONLY with JSON."""

    # ── Try local MedGemma ──
    try:
        chat_messages = [
            {"role": "system", "content": "You are a medical pharmacology AI. Respond only with valid JSON."},
            {"role": "user", "content": prompt},
        ]
        response_text = _generate_text(chat_messages, temperature=0.2)
        model_used = MEDGEMMA_TEXT_MODEL
    except Exception as e:
        print(f"[MedGemma] Local medicine analysis failed ({e}), falling back to Gemma API...")
        # ── Gemma API fallback ──
        try:
            from google.genai import types
            client = _get_gemma_fallback_client()
            full_prompt = "[System: You are a medical pharmacology AI. Respond only with valid JSON.]\n\n" + prompt
            response = client.models.generate_content(
                model=GEMMA_FALLBACK_MODEL,
                contents=[types.Content(role="user", parts=[types.Part(text=full_prompt)])],
                config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=2048),
            )
            response_text = response.text
            model_used = GEMMA_FALLBACK_MODEL
        except Exception as e2:
            print(f"[MedGemma] Gemma API fallback also failed: {e2}")
            raise

    response_text = response_text.strip()
    if response_text.startswith("```"):
        response_text = response_text.split("\n", 1)[1]
        if response_text.endswith("```"):
            response_text = response_text[:-3].strip()

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {
                "suggestions": [],
                "overallRecommendation": "Unable to analyze. Please consult a healthcare professional.",
                "warnings": ["AI analysis unavailable. Seek professional medical advice."]
            }

    result["model"] = model_used
    return result
