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

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Environment variables are already configured in this v0 project:
```
NEXT_PUBLIC_SUPABASE_URL=configured
NEXT_PUBLIC_SUPABASE_ANON_KEY=configured
SUPABASE_SERVICE_ROLE_KEY=configured
GROQ_API_KEY=configured
```

3. Database is already set up with all tables and RLS policies.

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## User Journeys

### For Patients
1. Open app (works offline after first load)
2. Select symptoms or use voice input
3. Get instant AI triage and recommendations
4. View risk level and suggested actions
5. Contact emergency services if needed
6. Data syncs automatically when online

### For Community Health Workers
1. Access CHW Dashboard
2. View all patient cases filtered by risk
3. Receive high-risk notifications
4. Call patients directly from app
5. Track case resolution
6. Work completely offline if needed

### For Doctors
1. Receive consultation requests
2. Review patient history and symptoms
3. Conduct video/chat consultations
4. Prescribe medicines digitally
5. Upload medical records

## Offline Capabilities (Core Feature)

ShusthoBondhu works **completely offline** for core features:

- ✅ **Symptom checking** - Full offline AI diagnosis
- ✅ **Emergency SOS** - Stored locally, syncs later
- ✅ **Case history** - All data encrypted on device
- ✅ **Knowledge base** - 8+ articles available offline
- ✅ **Voice input/output** - Works without internet
- ✅ **CHW dashboard** - View all offline cases
- ✅ **Data encryption** - Privacy protected locally

**Online features** (require internet):
- AI chat assistant
- OCR prescription scanning
- Medicine suggestions
- Facility search with maps
- Video consultations
- Cloud backup

## Security & Privacy

### Data Protection
- **AES-256 encryption** for all local data
- **Device-specific keys** - data only accessible on user's device
- **Row Level Security** on all database tables
- **Secure authentication** with Supabase
- **HTTPS-only** in production

### Privacy Features
- **Offline-first** - no data transmission without consent
- **Encrypted storage** - data unreadable if device compromised
- **Minimal data collection** - only what's needed
- **User controls** - delete data anytime

## Hackathon Readiness

All 17 features are **implemented and functional**:

✅ Offline symptom input with voice  
✅ AI triage engine (offline)  
✅ Health advice system  
✅ Emergency SOS with GPS  
✅ Voice interaction (speech-to-speech)  
✅ Encrypted case logging  
✅ Full Bangla support  
✅ Simple UI with big buttons  
✅ CHW dashboard  
✅ Risk notifications  
✅ Sync module  
✅ Voice messages  
✅ 100% offline AI  
✅ Explainability  
✅ Knowledge base  
✅ SMS generator  
✅ Data encryption  

**Demo-ready** for:
- Live symptom checking
- Offline functionality demonstration
- CHW workflow
- Emergency alert system
- Multi-language support

## Deployment

Optimized for Vercel deployment:

1. Already connected to this v0 project
2. Environment variables configured
3. Deploy with one click
4. Automatic HTTPS and CDN

## Future Enhancements

- **SMS/USSD gateway** for feature phones
- **Real-time video** consultations with WebRTC
- **Pharmacy integration** for medicine delivery
- **Community metrics** dashboard
- **More languages** (Chakma, Marma, etc.)
- **Native mobile apps** (React Native)
- **Service workers** for better offline support
- **National health system** integration

## Impact

**Target Users**: 40+ million people in Bangladesh's rural areas and Hill Tracts

**Problem Solved**: 
- No internet required for basic healthcare guidance
- Immediate risk assessment without doctors
- Emergency response in remote areas
- Bridge to formal healthcare system

**Lives Saved**: Early detection and triage can reduce preventable deaths from delayed care

## Contributing

This humanitarian project welcomes contributions:

1. Fork the repository
2. Create a feature branch
3. Test offline functionality
4. Submit pull request

Focus areas:
- Additional languages
- Medical knowledge expansion
- Accessibility improvements
- Performance optimization

## License

MIT License - Free for social good projects

## Acknowledgments

Built to address the healthcare access crisis in Bangladesh's underserved regions. Dedicated to the millions who face barriers to medical support.

**Special Thanks**: To the community health workers who inspired this solution with their tireless dedication to rural healthcare.

---

**ShusthoBondhu (স্বাস্থ্যবন্ধু)** - Your Health Companion, Anywhere, Anytime
