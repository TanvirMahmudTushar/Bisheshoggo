# Bisheshoggo AI - বিশেষজ্ঞ AI Healthcare Platform

**Expert Healthcare for Bangladesh's Hill Tracts and Rural Regions**

---

## 1. Team Members and Details

**Team Name:** NerdHerd

**Team Leader:** Tanvir Mahmud

**Team Co-Leader:** Fariha Tasnim Punni

**Team Member:** Ankit Roy

---

## 2. Problem Statement

### The Silent Struggle: Why Medical Support in Bangladesh's Hill Tracts and Rural Regions Remains Hard to Find

In the sprawling greens of Bangladesh's hill tracts and the distant stretches of rural villages, life often moves with a quiet rhythm—yet behind that calm lies a persistent struggle: **access to medical support**. 

For millions living in these regions, healthcare is not a guaranteed right but a long-distance hope, often travelling on unpaved roads, across rivers, or through steep, forested terrain.

### Key Challenges:

1. **Geographic Isolation** - Remote hill tracts and rural areas are hours away from the nearest hospital
2. **Limited Medical Professionals** - Severe shortage of doctors and healthcare workers
3. **Poor Internet Connectivity** - Unreliable or no internet access in most areas
4. **Language Barriers** - Indigenous communities speak local languages, creating communication gaps
5. **Emergency Response Delays** - Critical time lost in reaching medical facilities
6. **Lack of Medical Records** - No centralized system to track patient history
7. **Limited Health Awareness** - Lack of access to medical information and preventive care

**Our mission:** Create a comprehensive solution to overcome these challenges for helpless people with limited internet access.

---

## 3. Solution Overview

**Bisheshoggo AI** is an AI-powered, offline-first healthcare platform designed specifically for Bangladesh's Hill Tracts and rural regions. It bridges the healthcare gap by providing:

### Core Features:

#### 🤖 **AI Medical Assistant**
- 24/7 AI-powered medical consultation using Groq LLaMA 3.3 70B
- Contextual conversation with medical knowledge
- Available in multiple languages (English, Bangla ready)
- Works offline with cached responses

#### 🎥 **Telemedicine with Voice**
- Real-time video consultation with AI Doctor
- **Voice Input** - Speak your symptoms (Speech Recognition API)
- **Voice Output** - Hear doctor's advice (Speech Synthesis API)
- Doctor video (doctor.mp4) syncs with AI responses
- Professional video call interface
- Perfect for low-literacy users

#### 🩺 **AI Symptom Checker**
- Intelligent symptom analysis using AI
- Provides diagnosis, urgency level, and recommendations
- Suggests home remedies and warning signs
- Advises when to see a doctor in person
- Offline-capable with local processing

#### 📱 **Offline-First Architecture**
- SQLite local database - works without internet
- Offline sync queue - data syncs when online
- Cached medical facilities and information
- Progressive Web App (PWA) - install on any device
- Low bandwidth optimization

#### 🏥 **Medical Facility Locator**
- Find nearby hospitals, clinics, and pharmacies
- Filter by type, district, and services
- View on Google Maps with directions
- Emergency contact information
- Ambulance availability status

#### 🆘 **Emergency SOS System**
- One-tap emergency alert
- Sends location to nearby facilities
- Ambulance dispatch integration
- Emergency contact notification
- Works offline with queue system

#### 💊 **Prescription Scanner (OCR)**
- AI-powered prescription text extraction
- Medicine information and alternatives
- Dosage reminders
- Drug interaction warnings
- Works with poor quality images

#### 📊 **Health Visualizations**
- Interactive health dashboards
- Symptom trends and patterns
- Consultation history graphs
- Vital signs tracking
- Auto-generated from AI conversations

### How It Works:

```
User → Opens App (Works Offline)
     ↓
     → Checks Symptoms (AI Analysis)
     → Chats with AI Doctor (Voice/Text)
     → Finds Nearby Facility
     → Books Telemedicine (Video + Voice)
     → Scans Prescription (OCR)
     → Emergency SOS (If Needed)
     ↓
All Data Syncs When Internet Available
```

### Unique Value Propositions:

1. **Truly Offline** - Core features work without internet
2. **Voice-First** - Speak symptoms, hear advice (no typing needed)
3. **AI-Powered** - Real medical intelligence, not dummy responses
4. **Culturally Adapted** - Designed for Hill Tracts communities
5. **Low Resource** - Works on basic smartphones
6. **Privacy-First** - Data stored locally, syncs securely

---

## 4. Technologies Used

### Frontend:
- **Next.js 16.0.10** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful UI components
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Backend:
- **FastAPI** - Modern Python web framework
- **SQLite** - Lightweight local database
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Python 3.11+** - Backend language

### AI & ML:
- **Groq API** - LLaMA 3.3 70B model for medical AI
- **Speech Recognition API** - Browser-native voice input
- **Speech Synthesis API** - Browser-native text-to-speech
- **Natural Language Processing** - Symptom analysis

### Authentication & Security:
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin security
- **HTTPS** - Encrypted communication

### Database:
- **SQLite** - Embedded database (offline-capable)
- **SQLAlchemy ORM** - Database abstraction
- **Alembic** - Database migrations

### APIs & Integrations:
- **Groq API** - AI model inference
- **Google Maps API** - Facility location
- **Web Speech API** - Voice input/output
- **Service Workers** - Offline functionality

### Development Tools:
- **pnpm** - Fast package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 5. AI Tools Used

Throughout the development of Bisheshoggo AI, we leveraged multiple AI tools to accelerate development, improve code quality, and enhance user experience:

### **Gemini** (Google AI)
- Used for: Research on medical AI prompts and healthcare chatbot design
- Helped with: Understanding medical terminology and diagnosis patterns

### **ChatGPT** (OpenAI)
- Used for: Code generation, debugging, and documentation
- Helped with: FastAPI backend structure and API design

### **Claude** (Anthropic)
- Used for: Complex problem-solving and architecture decisions
- Helped with: Offline-first architecture design and data synchronization

### **Heygen**
- Used for: Creating the AI doctor video (doctor.mp4)
- Generated: Realistic doctor avatar with lip-sync capabilities
- Enhanced: Telemedicine experience with professional video

### **V0** (Vercel)
- Used for: UI/UX component generation
- Helped with: Rapid prototyping of dashboard and consultation interfaces

### **Azure OpenAI**
- Used for: Testing alternative AI models for medical consultation
- Evaluated: GPT-4 for medical advice accuracy

### **Copilot** (GitHub)
- Used for: Code completion and suggestions throughout development
- Helped with: Writing boilerplate code and TypeScript types

### **Cursor** (AI Code Editor)
- Used for: AI-assisted coding and refactoring
- Helped with: Entire project development, debugging, and optimization
- Primary development environment for the entire application

---

## 6. How the Solution Handles Limited Internet Access

Bisheshoggo AI is specifically designed to work in areas with poor or no internet connectivity. Here's how:

### A. Offline-First Architecture

#### **Local Database (SQLite)**
```
✅ All user data stored locally on device
✅ Medical facilities cached for offline access
✅ Symptom check history saved locally
✅ Consultation records stored offline
✅ No internet required for basic operations
```

#### **Progressive Web App (PWA)**
```
✅ Install app on any device (Android, iOS, Desktop)
✅ Works like native app without app store
✅ Launches offline
✅ Updates automatically when online
✅ Small download size (~5MB)
```

#### **Service Workers**
```
✅ Cache critical resources (HTML, CSS, JS)
✅ Cache doctor video for offline playback
✅ Cache medical facility data
✅ Intercept network requests
✅ Serve cached content when offline
```

### B. Offline Sync Queue

When internet is unavailable, all user actions are queued and synced later:

```
User Action (Offline) → Saved to Sync Queue → Syncs When Online
```

**What Gets Queued:**
- Symptom checks
- Emergency SOS alerts
- Consultation bookings
- Profile updates
- Medical record uploads

**How It Works:**
1. User performs action (e.g., checks symptoms)
2. Action saved to `offline_sync_queue` table
3. App continues working normally
4. When internet returns, queue processes automatically
5. User notified of successful sync

### C. Intelligent Data Management

#### **Cached Medical Facilities**
- 6 major facilities pre-loaded (hospitals, clinics, pharmacies)
- Covers Bandarban, Khagrachari, Rangamati districts
- Includes contact info, services, operating hours
- Updates when online, works offline

#### **Lightweight AI Responses**
- Compressed AI model responses
- Cached common medical queries
- Fallback to local symptom database
- Minimal data transfer

#### **Optimized Media**
- Doctor video cached locally (public/doctor.mp4)
- Compressed images and assets
- Lazy loading for non-critical content
- Progressive image loading

### D. Low Bandwidth Mode

When internet is slow:

```
✅ Text-only mode for consultations
✅ Compressed image uploads
✅ Reduced video quality
✅ Prioritized data sync (emergencies first)
✅ Background sync when bandwidth available
```

### E. Voice Features (No Typing Required)

Perfect for low-literacy users and slow connections:

```
✅ Voice Input - Speak symptoms (works offline)
✅ Voice Output - Hear advice (works offline)
✅ No text typing needed
✅ Uses browser's built-in Speech APIs
✅ No internet required for voice processing
```

### F. Offline Capabilities by Feature

| Feature | Offline Support | Notes |
|---------|----------------|-------|
| **AI Medical Chat** | ⚠️ Partial | Cached responses, needs online for new queries |
| **Telemedicine (Voice)** | ⚠️ Partial | Voice works offline, AI needs online |
| **Symptom Checker** | ⚠️ Partial | Basic checks offline, AI diagnosis needs online |
| **Facility Locator** | ✅ Full | All facilities cached |
| **Emergency SOS** | ✅ Full | Queued and sent when online |
| **Prescription Scanner** | ❌ Online Only | Requires AI for OCR |
| **Dashboard** | ✅ Full | Shows local data |
| **Profile** | ✅ Full | Stored locally |
| **Voice Input/Output** | ✅ Full | Browser-native, no internet needed |

### G. Data Synchronization Strategy

```
Priority 1 (Immediate): Emergency SOS alerts
Priority 2 (High): Symptom checks with high urgency
Priority 3 (Medium): Consultation bookings
Priority 4 (Low): Profile updates, history
```

### H. Technical Implementation

#### **Offline Detection**
```javascript
// Detect online/offline status
window.addEventListener('online', syncQueue);
window.addEventListener('offline', showOfflineMode);
```

#### **Sync Queue Table**
```sql
CREATE TABLE offline_sync_queue (
  id UUID PRIMARY KEY,
  action_type VARCHAR,  -- 'symptom_check', 'emergency', etc.
  payload JSON,         -- Action data
  priority INTEGER,     -- 1 (high) to 4 (low)
  created_at TIMESTAMP,
  synced BOOLEAN
);
```

#### **Background Sync**
```javascript
// Sync when online
if (navigator.onLine) {
  await syncOfflineQueue();
}
```

### I. Real-World Usage Scenarios

#### **Scenario 1: No Internet**
```
User in remote village with no internet:
1. Opens app (works offline)
2. Checks symptoms (uses cached data)
3. Views nearby facilities (cached)
4. Sends emergency SOS (queued)
5. When reaches area with internet → Auto-syncs
```

#### **Scenario 2: Intermittent Internet**
```
User with unstable connection:
1. Starts telemedicine consultation
2. Connection drops mid-conversation
3. App continues with cached responses
4. User can still use voice input/output
5. Conversation resumes when online
```

#### **Scenario 3: Low Bandwidth**
```
User with slow 2G connection:
1. App loads in text-only mode
2. Uses voice input (no typing)
3. Receives text advice (no video)
4. Downloads doctor video in background
5. Full features available when downloaded
```

### J. Future Enhancements for Offline

- **Offline AI Model**: Deploy lightweight model on-device
- **Peer-to-Peer Sync**: Share data via Bluetooth/WiFi Direct
- **SMS Fallback**: Send emergency alerts via SMS
- **Offline Maps**: Download maps for navigation
- **Voice Packs**: Download multiple language voice packs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+
- Groq API Key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "NSU Hackathon"
```

2. **Install frontend dependencies**
```bash
pnpm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables**

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Backend (`backend/.env`):
```env
DATABASE_URL=sqlite:///./bisheshoggo_ai.db
SECRET_KEY=your-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
FRONTEND_URL=http://localhost:3000
```

5. **Start the backend**
```bash
cd backend
python run.py
```

6. **Start the frontend**
```bash
pnpm dev
```

7. **Open the app**
```
http://localhost:3000
```

---

## 📱 Features Overview

### For Patients:
- ✅ AI symptom checking with voice input
- ✅ Video telemedicine with AI doctor
- ✅ Voice-based consultation (speak & hear)
- ✅ Find nearby healthcare facilities
- ✅ Emergency SOS alerts
- ✅ Prescription scanning
- ✅ Health history tracking
- ✅ Offline access to all features

### For Healthcare Providers:
- ✅ Telemedicine consultation platform
- ✅ Patient management
- ✅ Digital prescriptions
- ✅ Emergency alert monitoring

### For Community Health Workers:
- ✅ Rapid symptom assessment
- ✅ Patient triage
- ✅ Health education resources
- ✅ Emergency response coordination

---

## 🌍 Impact

**Bisheshoggo AI** directly addresses the healthcare crisis in Bangladesh's Hill Tracts by:

- **Reducing Travel Time**: No need to travel hours for basic consultation
- **24/7 Availability**: AI doctor always available, even at night
- **Language Accessibility**: Voice-first interface for all literacy levels
- **Emergency Response**: Faster emergency alerts and coordination
- **Cost Effective**: Free AI consultation reduces healthcare costs
- **Offline Access**: Works without internet in remote areas
- **Health Awareness**: Educates communities about health issues

---

## 🏆 Key Achievements

- ✅ **Real AI** - Not dummy data, actual Groq LLaMA 3.3 70B
- ✅ **Voice-First** - Speak symptoms, hear advice (no typing)
- ✅ **Offline-First** - Core features work without internet
- ✅ **Video Integration** - AI doctor with lip-sync video
- ✅ **Production-Ready** - Full authentication, security, error handling
- ✅ **Beautiful UI** - Modern, animated, responsive design
- ✅ **Comprehensive** - All features working end-to-end

---

## 📞 Support

For questions or support, contact the NerdHerd team.

---

## 📄 License

This project is developed for the NSU Hackathon.

---

**Built with ❤️ for Bangladesh's Hill Tracts**

*Bisheshoggo AI - বিশেষজ্ঞ AI Healthcare Platform*

**Empowering Rural Healthcare Through AI**
