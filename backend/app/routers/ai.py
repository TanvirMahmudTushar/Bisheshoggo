"""
Bisheshoggo AI - AI Chat and Medicine Suggestion Routes
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
    """AI Chat endpoint - streams response"""
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
                    # Format as SSE
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
    """Non-streaming AI Chat endpoint"""
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
            "role": "assistant"
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
    """Get AI-powered medicine suggestions based on prescription"""
    try:
        from groq import Groq
        
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Get patient's medical history
        consultations = db.query(models.Consultation).filter(
            models.Consultation.patient_id == current_user.id,
            models.Consultation.status == models.ConsultationStatus.completed
        ).order_by(models.Consultation.created_at.desc()).limit(5).all()
        
        medical_records = db.query(models.MedicalRecord).filter(
            models.MedicalRecord.patient_id == current_user.id
        ).order_by(models.MedicalRecord.created_at.desc()).limit(5).all()
        
        # Build context
        consultation_history = "\n\n".join([
            f"Diagnosis: {c.diagnosis or 'N/A'}\nSymptoms: {c.symptoms or 'N/A'}\nPrescription: {c.prescription or 'N/A'}"
            for c in consultations
        ])
        
        record_history = "\n\n".join([
            f"{r.record_type or 'Record'}: {r.title or ''}\n{r.description or ''}"
            for r in medical_records
        ])
        
        history_context = "\n\n---\n\n".join(filter(None, [consultation_history, record_history]))
        
        prompt = f"""As a medical AI assistant, analyze the following prescription and provide detailed medicine suggestions.

Current Prescription:
{json.dumps(request.prescriptions, indent=2)}

Diagnosis: {request.diagnosis or "Not specified"}

Patient Medical History:
{history_context or "No previous records"}

Patient Information:
{request.patientHistory or "Not provided"}

Please provide your response in the following JSON format:
{{
    "suggestions": [
        {{
            "medicine": "Medicine name",
            "reason": "Why this medicine is prescribed",
            "alternatives": ["Alternative 1", "Alternative 2"],
            "precautions": ["Precaution 1", "Precaution 2"],
            "interactions": ["Drug interaction 1"],
            "effectiveness": "high" | "moderate" | "low"
        }}
    ],
    "overallRecommendation": "Overall recommendation text",
    "warnings": ["Warning 1", "Warning 2"]
}}

Consider:
- Availability in rural Bangladesh
- Cost-effective alternatives
- Common side effects
- Drug interactions
- Suitable for limited medical facilities"""

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

