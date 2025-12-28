# Bisheshoggo AI 

**Doctor you need**

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

**Bisheshoggo AI** is always ready to bring treatment to the place where even internet can't reach:

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


```



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

Throughout the development of Bisheshoggo AI, we used multiple AI tools to accelerate development, improve code quality, and enhance user experience:

### **Gemini** (Google AI)
- Used for: Researching the problem


### **ChatGPT** (OpenAI)
- Used for: Researching the problem and generating components for UI


### **Claude** (Anthropic)
- Used for: Generating code


### **Heygen**
- Used for: Creating the AI doctor video (doctor.mp4)


### **V0** (Vercel)
- Used for: UI/UX component generation


### **Azure OpenAI**
- Used for: Testing alternative AI models for medical consultation (Couldn't use it as I crossed the monthly limit)



### **Cursor** (AI Code Editor)
- Used for: AI-assisted coding and debugging


---

## 6. How the Solution Handles Limited Internet Access



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

