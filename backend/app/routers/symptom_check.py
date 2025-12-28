"""
Bisheshoggo AI - Symptom Check Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/symptom-check", tags=["Symptom Check"])


@router.post("", response_model=dict)
async def create_symptom_check(
    check_data: schemas.SymptomCheckCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new symptom check record"""
    # Convert comma-separated symptoms to array
    symptoms_list = [s.strip() for s in check_data.symptoms.split(",")]
    
    db_check = models.SymptomCheck(
        user_id=current_user.id,
        symptoms=symptoms_list,
        severity=check_data.severity,
        duration=check_data.duration,
        additional_notes=check_data.recommendations,
        recommendations=check_data.diagnosis,
        suggested_conditions=[],
        synced=True
    )
    
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    
    return {"success": True, "data": db_check}


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

