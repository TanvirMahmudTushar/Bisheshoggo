"""
Bisheshoggo AI - Profile Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=schemas.FullProfileResponse)
async def get_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile with additional data"""
    additional_data = None
    
    if current_user.role == schemas.UserRole.patient:
        additional_data = db.query(models.PatientProfile).filter(
            models.PatientProfile.user_id == current_user.id
        ).first()
    elif current_user.role in [schemas.UserRole.doctor, schemas.UserRole.community_health_worker]:
        additional_data = db.query(models.ProviderProfile).filter(
            models.ProviderProfile.user_id == current_user.id
        ).first()
    
    return {
        "profile": current_user,
        "additionalData": additional_data
    }


@router.put("")
async def update_profile(
    profile_data: schemas.UserUpdate,
    patient_data: schemas.PatientProfileCreate = None,
    provider_data: schemas.ProviderProfileCreate = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Update user fields
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
    if profile_data.phone:
        current_user.phone = profile_data.phone
    if profile_data.avatar_url:
        current_user.avatar_url = profile_data.avatar_url
    
    # Update patient-specific data
    if patient_data and current_user.role == schemas.UserRole.patient:
        patient_profile = db.query(models.PatientProfile).filter(
            models.PatientProfile.user_id == current_user.id
        ).first()
        
        if not patient_profile:
            patient_profile = models.PatientProfile(user_id=current_user.id)
            db.add(patient_profile)
        
        for field, value in patient_data.model_dump(exclude_unset=True).items():
            setattr(patient_profile, field, value)
    
    # Update provider-specific data
    if provider_data and current_user.role in [schemas.UserRole.doctor, schemas.UserRole.community_health_worker]:
        provider_profile = db.query(models.ProviderProfile).filter(
            models.ProviderProfile.user_id == current_user.id
        ).first()
        
        if not provider_profile:
            provider_profile = models.ProviderProfile(user_id=current_user.id)
            db.add(provider_profile)
        
        for field, value in provider_data.model_dump(exclude_unset=True).items():
            setattr(provider_profile, field, value)
    
    db.commit()
    
    return {"success": True}

