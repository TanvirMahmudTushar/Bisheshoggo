"""
Bisheshoggo AI - Main FastAPI Application
বিশেষজ্ঞ AI - Rural Healthcare Platform for Bangladesh
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import init_db
from .config import settings
from .routers import (
    auth,
    profile,
    consultations,
    emergency,
    facilities,
    providers,
    medical_records,
    symptom_check,
    ai,
    ocr
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup: Initialize database
    print("[+] Starting Bisheshoggo AI Backend...")
    init_db()
    print("[+] Database initialized")
    yield
    # Shutdown
    print("[*] Shutting down Bisheshoggo AI...")


# Create FastAPI application
app = FastAPI(
    title="Bisheshoggo AI",
    description="""
    বিশেষজ্ঞ AI - Expert AI Healthcare Platform
    
    A comprehensive healthcare platform designed for rural Bangladesh,
    providing AI-powered medical assistance, telemedicine, emergency SOS,
    and offline-first capabilities for the Hill Tracts region.
    
    ## Features
    
    - 🤖 AI-Powered Medical Chat Assistant
    - 📋 Symptom Checker with Triage
    - 💊 Prescription Scanner with Medicine Suggestions
    - 🏥 Medical Facility Locator
    - 👨‍⚕️ Telemedicine Consultations
    - 🆘 Emergency SOS System
    - 📱 Offline-First Support
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS - allow all localhost origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(consultations.router, prefix="/api")
app.include_router(emergency.router, prefix="/api")
app.include_router(facilities.router, prefix="/api")
app.include_router(providers.router, prefix="/api")
app.include_router(medical_records.router, prefix="/api")
app.include_router(symptom_check.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(ocr.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Bisheshoggo AI",
        "name_bn": "বিশেষজ্ঞ AI",
        "description": "Expert AI Healthcare Platform for Rural Bangladesh",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Bisheshoggo AI"}


# Run with: uvicorn app.main:app --reload --port 8000

