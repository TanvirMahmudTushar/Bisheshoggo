"""
Bisheshoggo AI - Symptom Check Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user
from ..config import settings

router = APIRouter(prefix="/symptom-check", tags=["Symptom Check"])


@router.post("", response_model=dict)
async def create_symptom_check(
    check_data: schemas.SymptomCheckCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new symptom check record with AI-powered analysis"""
    try:
        from groq import Groq
        
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Convert comma-separated symptoms to array
        symptoms_list = [s.strip() for s in check_data.symptoms.split(",")]
        
        # Get patient medical history
        patient_profile = db.query(models.PatientProfile).filter(
            models.PatientProfile.user_id == current_user.id
        ).first()
        
        medical_history = ""
        if patient_profile:
            medical_history = f"""
Blood Group: {patient_profile.blood_group or 'N/A'}
Gender: {patient_profile.gender or 'N/A'}
Age: {patient_profile.date_of_birth or 'N/A'}
Medical Conditions: {', '.join(patient_profile.medical_conditions or [])}
Allergies: {', '.join(patient_profile.allergies or [])}
Current Medications: {', '.join(patient_profile.current_medications or [])}
"""
        
        # AI-powered symptom analysis
        prompt = f"""As a medical AI assistant for rural Bangladesh, analyze these symptoms and provide diagnosis:

Patient Information:
{medical_history}

Current Symptoms:
{', '.join(symptoms_list)}

Severity: {check_data.severity or 'Not specified'}
Duration: {check_data.duration or 'Not specified'}
Additional Notes: {check_data.additional_notes or 'None'}

Provide your response in the following JSON format:
{{
    "diagnosis": "Primary diagnosis",
    "suggested_conditions": ["Condition 1", "Condition 2", "Condition 3"],
    "recommendations": "Detailed recommendations including when to seek medical care",
    "urgency_level": "low" | "moderate" | "high" | "emergency",
    "home_remedies": ["Remedy 1", "Remedy 2"],
    "warning_signs": ["Warning sign 1", "Warning sign 2"],
    "should_see_doctor": true | false
}}

Consider:
- Limited access to healthcare facilities
- Common conditions in Bangladesh's Hill Tracts
- Cultural context and available resources
- When immediate medical attention is needed"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a medical AI assistant. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        ai_result = json.loads(response.choices[0].message.content)
        
        # Store in database
        db_check = models.SymptomCheck(
            user_id=current_user.id,
            symptoms=symptoms_list,
            severity=check_data.severity or ai_result.get("urgency_level", "moderate"),
            duration=check_data.duration,
            additional_notes=check_data.additional_notes,
            diagnosis=ai_result.get("diagnosis", ""),
            recommendations=ai_result.get("recommendations", ""),
            suggested_conditions=ai_result.get("suggested_conditions", []),
            synced=True
        )
        
        db.add(db_check)
        db.commit()
        db.refresh(db_check)
        
        # Convert to dict for serialization
        check_data = {
            "id": db_check.id,
            "user_id": db_check.user_id,
            "symptoms": db_check.symptoms,
            "severity": db_check.severity,
            "duration": db_check.duration,
            "additional_notes": db_check.additional_notes,
            "diagnosis": db_check.diagnosis,
            "recommended": db_check.recommendations,
            "suggested_conditions": db_check.suggested_conditions,
            "synced": db_check.synced,
            "created_at": db_check.created_at.isoformat() if db_check.created_at else None
        }
        
        # Return combined result
        return {
            "success": True,
            "data": check_data,
            "ai_analysis": ai_result
        }
    
    except Exception as e:
        print(f"[Bisheshoggo AI] Symptom Check Error: {e}")
        # Fallback: save without AI analysis
        symptoms_list = [s.strip() for s in check_data.symptoms.split(",")]
        db_check = models.SymptomCheck(
            user_id=current_user.id,
            symptoms=symptoms_list,
            severity=check_data.severity,
            duration=check_data.duration,
            additional_notes=check_data.additional_notes,
            synced=True
        )
        
        db.add(db_check)
        db.commit()
        db.refresh(db_check)
        
        # Convert to dict for serialization
        check_data = {
            "id": db_check.id,
            "user_id": db_check.user_id,
            "symptoms": db_check.symptoms,
            "severity": db_check.severity,
            "duration": db_check.duration,
            "additional_notes": db_check.additional_notes,
            "synced": db_check.synced,
            "created_at": db_check.created_at.isoformat() if db_check.created_at else None
        }
        
        return {
            "success": True,
            "data": check_data,
            "note": "AI analysis temporarily unavailable"
        }


@router.get("", response_model=dict)
async def get_symptom_checks(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all symptom checks for current user"""
    checks = db.query(models.SymptomCheck).filter(
        models.SymptomCheck.user_id == current_user.id
    ).order_by(models.SymptomCheck.created_at.desc()).limit(50).all()
    
    return {"data": checks}

