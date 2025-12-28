# ShusthoBondhu - Medical Support Solution for Bangladesh

A comprehensive offline-first healthcare platform designed to bridge the medical access gap in Bangladesh's Hill Tracts and rural regions, optimized for areas with limited or no internet connectivity.

## Problem Statement

In Bangladesh's Hill Tracts and rural villages, access to medical support remains a critical challenge. Healthcare is not a guaranteed right but a distant hope, often requiring travel across unpaved roads, rivers, or steep forested terrain. ShusthoBondhu addresses this struggle with an offline-first approach that works even without internet connectivity.

## All 17 Features (Fully Implemented)

### Offline-First Core Features

1. **Offline Symptom Input System**
   - Large, accessible buttons optimized for low-literacy users
   - Voice input with speech-to-speech guidance
   - Works 100% offline using device storage
   - Multi-language support (English & Bangla)

2. **Rule-Based AI Triage Engine**
   - Completely offline AI diagnosis
   - Risk classification: Emergency, High, Medium, Low
   - No API calls required - runs entirely on device
   - Analyzes symptoms, vitals, duration, and patient history

3. **Comprehensive Health Advice System**
   - First-aid guidance in both English and Bangla
   - Medication recommendations
   - When to seek immediate care
   - Home remedy suggestions for minor ailments

4. **One-Tap Emergency Alert**
   - GPS location capture and tracking
   - SMS generator for emergency services (999)
   - Automatic notification to Community Health Workers
   - Works offline - syncs when connection restored

5. **Voice Interaction System**
   - Speech-to-text symptom description
   - Text-to-speech guided prompts for illiterate users
   - Supports both English and Bangla
   - Hands-free operation for accessibility

6. **Encrypted Case History Logging**
   - AES-256 encryption for patient privacy
   - Device-specific encryption keys
   - Automatic sync when online
   - Complete offline access to history

7. **Full Bangla Language Support**
   - Complete Bengali translation throughout app
   - Bangla voice input and output
   - Culturally appropriate medical terminology
   - Language toggle on every page

### Accessibility & User Experience

8. **Simple UI with Big Buttons**
   - High contrast design for visibility
   - Large touch targets (minimum 48px)
   - Clear icons and minimal text
   - Optimized for users with limited digital literacy

9. **CHW Dashboard**
   - View all patient cases offline
   - Risk-based filtering (Emergency, High, Medium, Low)
   - Patient call functionality
   - Real-time statistics and notifications

10. **Risk Summary Notifications**
    - Color-coded risk levels (Red, Orange, Yellow, Green)
    - High-risk patient alerts
    - Statistics dashboard for CHWs
    - Offline notification queue

11. **Intelligent Sync Module**
    - Automatic background sync when online
    - Conflict resolution for offline changes
    - Progress tracking and status indicators
    - Retry logic for failed syncs

12. **Voice Message Playback**
    - Record voice messages for CHWs
    - Playback patient audio descriptions
    - Offline audio storage
    - Bandwidth-efficient transmission

### Advanced AI Features

13. **100% Offline AI Triage**
    - No internet required for diagnosis
    - Rule-based expert system
    - Context-aware recommendations
    - Privacy-preserving (no data leaves device)

14. **Explainability Module**
    - Clear reasoning for risk classifications
    - Evidence-based recommendations
    - Symptom severity explanations
    - Decision transparency for users

15. **Searchable Medical Knowledge Base**
    - 8+ offline health articles
    - Common conditions and treatments
    - First-aid instructions
    - Bangla and English content

16. **Emergency SMS Generator**
    - Pre-formatted SMS messages
    - Automatic GPS coordinates
    - Patient information included
    - Direct integration with 999

17. **Complete Data Encryption**
    - AES-256 encryption at rest
    - Secure local storage
    - Device-specific keys
    - HIPAA-level privacy protection

### Additional Online Features

- **AI-Powered Chat Assistant** (Groq Llama 3.3)
- **OCR Prescription Scanner** (Tesseract.js)
- **AI Medicine Suggestions**
- **Telemedicine Consultations**
- **Medical Facility Finder**
- **Medical Records Management**
- **Progressive Web App (PWA)** support

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui with custom accessibility improvements
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: React Hooks + SWR

### Backend & Storage
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RLS
- **Offline Storage**: IndexedDB + localStorage
- **Encryption**: CryptoJS (AES-256)
- **API**: Next.js API Routes

### AI & Processing
- **Online AI**: Groq (Llama 3.3 70B Versatile)
- **OCR**: Tesseract.js (client-side)
- **Offline AI**: Rule-based expert system
- **Voice**: Web Speech API
- **AI SDK**: Vercel AI SDK v5

### Key Features
- **Offline-First Architecture**
- **End-to-End Encryption**
- **Row Level Security (RLS)**
- **Progressive Web App (PWA)**
- **Optimized for 2G/3G networks**
- **Works without internet after initial load**

## Database Schema

### Main Tables
- `profiles` - User profile information with roles
- `patient_profiles` - Patient-specific medical data
- `provider_profiles` - Healthcare provider credentials
- `medical_facilities` - Hospitals, clinics, pharmacies
- `symptom_checks` - Symptom checker history with severity
- `consultations` - Telemedicine appointments and notes
- `medical_records` - Digital health records
- `emergency_sos` - Emergency alerts with GPS
- `offline_sync_queue` - Data synchronization queue

All tables protected with Row Level Security (RLS) policies.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (for online features)
- Groq API key (for AI chat)

