"""
Bisheshoggo AI - OCR Processing Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/ocr", tags=["OCR"])


@router.post("/process", response_model=schemas.OCRResponse)
async def process_prescription(
    request: schemas.OCRRequest,
    current_user: models.User = Depends(get_current_user)
):
    """Process prescription image with OCR"""
    try:
        # In production, use actual OCR service like Google Cloud Vision, AWS Textract, or Tesseract
        # For demo, returning mock data
        
        # Simulate processing delay
        import asyncio
        await asyncio.sleep(1)
        
        # Mock extracted data - in production this would come from actual OCR
        extracted_data = schemas.OCRResponse(
            doctorName="Dr. Rahman Ahmed",
            date=datetime.now().strftime("%d/%m/%Y"),
            diagnosis="Upper Respiratory Tract Infection",
            medicines=[
                schemas.OCRMedicine(
                    name="Amoxicillin 500mg",
                    dosage="500mg",
                    frequency="3 times daily",
                    duration="7 days"
                ),
                schemas.OCRMedicine(
                    name="Paracetamol 500mg",
                    dosage="500mg",
                    frequency="As needed for fever",
                    duration="5 days"
                ),
                schemas.OCRMedicine(
                    name="Cetirizine 10mg",
                    dosage="10mg",
                    frequency="Once daily at bedtime",
                    duration="5 days"
                )
            ],
            rawText=f"""Dr. Rahman Ahmed
MBBS, MD (Medicine)
Reg. No: 12345

Date: {datetime.now().strftime("%d/%m/%Y")}

Patient Name: {current_user.full_name}
Age: --

Diagnosis: Upper Respiratory Tract Infection

Rx:
1. Tab Amoxicillin 500mg - 1+1+1 (After meals) - 7 days
2. Tab Paracetamol 500mg - SOS (for fever) - 5 days
3. Tab Cetirizine 10mg - 0+0+1 (At bedtime) - 5 days

General Instructions:
- Take medicines regularly
- Drink plenty of fluids
- Rest adequately
- Follow up if symptoms persist

Dr. Rahman Ahmed
Signature"""
        )
        
        return extracted_data
    
    except Exception as e:
        print(f"[Bisheshoggo AI] OCR Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process image"
        )

