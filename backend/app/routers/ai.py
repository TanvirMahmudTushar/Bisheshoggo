"""
Bisheshoggo AI - AI Chat and Medicine Suggestion Routes
Powered by MedGemma (Google HAI-DEF) and Groq
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import json
import os
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user
from ..config import settings
from ..medgemma_service import medgemma_chat, medgemma_symptom_analysis, medgemma_medicine_analysis

router = APIRouter(prefix="/ai", tags=["AI"])


# System prompt for medical AI assistant
SYSTEM_PROMPT = """You are a compassionate and knowledgeable medical assistant for Bisheshoggo AI, a healthcare platform serving rural areas in Bangladesh's Hill Tracts. 

Your responsibilities:
- Provide accurate, easy-to-understand medical information
- Help users understand symptoms and when to seek emergency care
- Offer guidance on medication, treatments, and preventive care
- Be culturally sensitive and consider limited healthcare access
- ALWAYS recommend professional medical consultation for serious symptoms
- Provide health statistics and insights when analyzing user health data

Important guidelines:
- Use simple language suitable for users with limited medical knowledge
- Consider rural context and limited access to healthcare facilities
- Emphasize when immediate medical attention is needed
- Provide practical home remedies for minor ailments
- Be empathetic and supportive

When asked about health data or patterns, provide insights with statistics."""


@router.post("/chat")
async def chat(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """AI Chat endpoint - tries MedGemma first (non-streaming), falls back to Groq streaming"""
    
    # Try MedGemma first (non-streaming but higher quality medical reasoning)
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        result = await medgemma_chat(messages)
        
        # Return as SSE format for compatibility with frontend
        async def generate_medgemma():
            content = result["content"]
            # Send in chunks to simulate streaming
            chunk_size = 50
            for i in range(0, len(content), chunk_size):
                chunk = content[i:i+chunk_size]
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate_medgemma(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        )
    except Exception as medgemma_error:
        print(f"[MedGemma] Streaming chat failed, falling back to Groq: {medgemma_error}")
    
    # Fallback to Groq streaming
    try:
        from groq import Groq
        
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Prepare messages with system prompt
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend([{"role": m.role, "content": m.content} for m in request.messages])
        
        # Create streaming response
        async def generate():
            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"
            
            yield "data: [DONE]\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            }
        )
    
    except Exception as e:
        print(f"[Bisheshoggo AI] Chat Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat request"
        )


@router.post("/chat/simple")
async def chat_simple(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user)
):
    """Non-streaming AI Chat endpoint - uses MedGemma with Groq fallback"""
    try:
        # Try MedGemma first (HAI-DEF model)
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        result = await medgemma_chat(messages)
        
        return {
            "content": result["content"],
            "role": "assistant",
            "model": result["model"],
            "powered_by": "MedGemma (Google HAI-DEF)"
        }
    except Exception as medgemma_error:
        print(f"[MedGemma] Chat failed, falling back to Groq: {medgemma_error}")
        try:
            from groq import Groq
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            # Prepare messages with system prompt
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            messages.extend([{"role": m.role, "content": m.content} for m in request.messages])
            
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages
            )
            
            return {
                "content": response.choices[0].message.content,
                "role": "assistant",
                "model": "llama-3.3-70b-versatile",
                "powered_by": "Groq (Fallback)"
            }
        
        except Exception as e:
            print(f"[Bisheshoggo AI] Chat Error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process chat request"
            )


@router.post("/medicine-suggestions", response_model=schemas.MedicineSuggestionResponse)
async def get_medicine_suggestions(
    request: schemas.MedicineSuggestionRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered medicine suggestions - MedGemma primary, Groq fallback"""
    
    # Try MedGemma first
    try:
        result = await medgemma_medicine_analysis(
            prescriptions=request.prescriptions,
            diagnosis=request.diagnosis or "",
            patient_history=request.patientHistory or ""
        )
        return result
    except Exception as medgemma_error:
        print(f"[MedGemma] Medicine suggestions failed, falling back to Groq: {medgemma_error}")
    
    # Fallback to Groq
    try:
        from groq import Groq
        
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Get patient's medical history
        consultations = db.query(models.Consultation).filter(
            models.Consultation.patient_id == current_user.id,
            models.Consultation.status == models.ConsultationStatus.completed
        ).order_by(models.Consultation.created_at.desc()).limit(5).all()
        
        # Build consultation history context
        consultation_history = "\n\n".join([
            f"Diagnosis: {c.diagnosis or 'N/A'}\nSymptoms: {c.symptoms or 'N/A'}\nPrescription: {c.prescription or 'N/A'}"
            for c in consultations
        ])
        
        prompt = f"""As a medical AI assistant for rural Bangladesh, analyze this prescription and patient's current condition to provide personalized medicine recommendations.

PRESCRIPTION MEDICINES:
{json.dumps(request.prescriptions, indent=2)}

ORIGINAL DIAGNOSIS: {request.diagnosis or "Not specified"}

PATIENT'S CURRENT INFORMATION:
{request.patientHistory or "Not provided"}

PREVIOUS MEDICAL HISTORY:
{consultation_history or "No previous records"}

IMPORTANT: The patient has provided information about:
1. How long they've been taking these medicines
2. Their CURRENT symptoms
3. Any additional health concerns

YOUR TASK:
1. Analyze which medicines from the prescription are relevant for the patient's CURRENT symptoms
2. Recommend which medicines they should continue taking and which they can stop
3. Explain WHY each medicine is or isn't needed based on their current symptoms
4. Provide specific dosage instructions for medicines they should take
5. Warn about any medicines that shouldn't be continued without symptoms

Respond in this JSON format:
{{
    "suggestions": [
        {{
            "medicine": "Medicine name from prescription",
            "reason": "Detailed explanation: Is this medicine needed for current symptoms? Should they continue or stop?",
            "shouldTake": "YES - Continue taking" or "NO - Not needed for current symptoms" or "CONSULT - Requires doctor consultation",
            "alternatives": ["Cheaper/available alternatives in rural Bangladesh"],
            "precautions": ["Important precautions"],
            "interactions": ["Drug interactions to watch"],
            "effectiveness": "high" | "moderate" | "low"
        }}
    ],
    "overallRecommendation": "Clear guidance on which medicines to take NOW based on current symptoms, and which to stop or consult about",
    "warnings": ["Important warnings about medicine usage, stopping, or seeking medical help"]
}}

Consider:
- Match medicines to CURRENT symptoms specifically
- Medicines available in rural Bangladesh
- Cost-effective alternatives
- Safety of continuing/stopping medicines
- When to seek immediate medical help"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a medical AI assistant. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
    
    except Exception as e:
        print(f"[Bisheshoggo AI] Medicine Suggestion Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate suggestions"
        )


# ═══════════════════════════════════════════════════════════════
# MedGemma-Powered Endpoints (Google HAI-DEF)
# These endpoints use MedGemma for enhanced medical AI capabilities
# ═══════════════════════════════════════════════════════════════

@router.post("/medgemma/chat")
async def medgemma_chat_endpoint(
    request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    MedGemma-powered medical chat endpoint.
    Uses Google's MedGemma model from HAI-DEF for more accurate medical reasoning.
    """
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        result = await medgemma_chat(messages)
        
        return {
            "content": result["content"],
            "role": "assistant",
            "model": result["model"],
            "powered_by": "MedGemma (Google HAI-DEF)"
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        print(f"[MedGemma] Chat Error: {e}")
        # Fallback to Groq if MedGemma fails
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            messages.extend([{"role": m.role, "content": m.content} for m in request.messages])
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages
            )
            return {
                "content": response.choices[0].message.content,
                "role": "assistant",
                "model": "llama-3.3-70b-versatile",
                "powered_by": "Groq (Fallback)"
            }
        except Exception as fallback_error:
            print(f"[MedGemma] Fallback also failed: {fallback_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Both MedGemma and fallback AI services unavailable"
            )


@router.post("/medgemma/symptom-analysis")
async def medgemma_symptom_analysis_endpoint(
    request: schemas.SymptomCheckCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    MedGemma-powered symptom analysis with clinical triage.
    Uses HAI-DEF model for evidence-based medical reasoning.
    """
    try:
        symptoms_list = [s.strip() for s in request.symptoms.split(",")]
        
        result = await medgemma_symptom_analysis(
            symptoms=symptoms_list,
            severity=request.severity or "moderate",
            duration=request.duration or "",
            additional_notes=request.additional_notes or ""
        )
        
        # Store in database
        db_check = models.SymptomCheck(
            user_id=current_user.id,
            symptoms=symptoms_list,
            severity=request.severity or result.get("urgency_level", "moderate"),
            duration=request.duration,
            additional_notes=request.additional_notes,
            diagnosis=result.get("diagnosis", ""),
            recommendations=result.get("recommendations", ""),
            suggested_conditions=result.get("suggested_conditions", []),
            synced=True
        )
        
        db.add(db_check)
        db.commit()
        db.refresh(db_check)
        
        return {
            "success": True,
            "data": {
                "id": db_check.id,
                "symptoms": db_check.symptoms,
                "severity": db_check.severity,
                "diagnosis": db_check.diagnosis,
                "created_at": db_check.created_at.isoformat() if db_check.created_at else None
            },
            "ai_analysis": result,
            "model": result.get("model", "MedGemma"),
            "powered_by": "MedGemma (Google HAI-DEF)"
        }
    
    except Exception as e:
        print(f"[MedGemma] Symptom Analysis Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MedGemma symptom analysis failed: {str(e)}"
        )


@router.post("/medgemma/medicine-analysis")
async def medgemma_medicine_analysis_endpoint(
    request: schemas.MedicineSuggestionRequest,
    current_user: models.User = Depends(get_current_user)
):
    """
    MedGemma-powered medicine interaction analysis.
    Uses HAI-DEF model for pharmacological reasoning.
    """
    try:
        result = await medgemma_medicine_analysis(
            prescriptions=request.prescriptions,
            diagnosis=request.diagnosis or "",
            patient_history=request.patientHistory or ""
        )
        
        return {
            **result,
            "powered_by": "MedGemma (Google HAI-DEF)"
        }
    
    except Exception as e:
        print(f"[MedGemma] Medicine Analysis Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"MedGemma medicine analysis failed: {str(e)}"
        )


@router.get("/medgemma/status")
async def medgemma_status():
    """Check MedGemma service availability"""
    try:
        from ..medgemma_service import (
            get_model_status, is_model_loaded,
            MEDGEMMA_TEXT_MODEL, GEMMA_FALLBACK_MODEL, MEDGEMMA_MODEL_ID,
        )
        status = get_model_status()

        if is_model_loaded():
            return {
                "status": "available",
                "primary_model": MEDGEMMA_MODEL_ID,
                "display_name": MEDGEMMA_TEXT_MODEL,
                "fallback_model": GEMMA_FALLBACK_MODEL,
                "vram_used_gb": status.get("vram_used_gb"),
                "inference": "local_gpu",
                "powered_by": "Google HAI-DEF (Health AI Developer Foundations)"
            }
        else:
            return {
                "status": "loading" if not status.get("attempted") else "fallback",
                "primary_model": MEDGEMMA_MODEL_ID,
                "fallback_model": GEMMA_FALLBACK_MODEL,
                "error": status.get("error"),
                "message": "MedGemma local model not loaded. Using Gemma API fallback.",
                "powered_by": "Google HAI-DEF (Health AI Developer Foundations)"
            }
    except Exception as e:
        return {
            "status": "unavailable",
            "error": str(e),
            "message": "MedGemma service error"
        }


