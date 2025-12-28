# 🏥 Bisheshoggo AI - বিশেষজ্ঞ AI

<div align="center">
  <img src="public/icon.svg" alt="Bisheshoggo AI Logo" width="120" />
  
  **AI-Powered Healthcare Platform for Rural Bangladesh**
  
  *Expert healthcare at your fingertips - designed for the Hill Tracts*
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
</div>

---

## ✨ Features

### 🤖 AI-Powered Healthcare
- **AI Medical Chat** - 24/7 intelligent health guidance powered by Groq LLaMA 3.3
- **Smart Symptom Checker** - AI-assisted diagnosis with triage recommendations
- **Medicine Suggestions** - AI analysis of prescriptions with alternatives

### 📱 Core Features
- **Telemedicine** - Video/chat consultations with doctors
- **Healthcare Finder** - GPS-enabled facility locator
- **Emergency SOS** - Instant emergency alerts with location tracking
- **Medical Records** - Secure health record management
- **Prescription Scanner** - OCR-powered prescription digitization

### 🌐 Designed for Rural Areas
- Offline-first architecture
- Works with limited connectivity
- Bengali language support
- Culturally sensitive recommendations

---

## 🏗️ Architecture

```
bisheshoggo-ai/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT authentication
│   │   ├── database.py     # SQLite + SQLAlchemy
│   │   ├── config.py       # Settings
│   │   ├── seed.py         # Sample data seeder
│   │   └── routers/        # API endpoints
│   │       ├── auth.py
│   │       ├── profile.py
│   │       ├── consultations.py
│   │       ├── emergency.py
│   │       ├── facilities.py
│   │       ├── providers.py
│   │       ├── medical_records.py
│   │       ├── symptom_check.py
│   │       ├── ai.py
│   │       └── ocr.py
│   ├── requirements.txt
│   └── run.py
│
├── app/                    # Next.js Frontend
│   ├── page.tsx           # Landing page
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── api/               # (Legacy - now uses FastAPI)
│
├── lib/
│   └── api/
│       ├── client.ts      # API client for FastAPI
│       └── auth-context.tsx
│
└── components/            # React components
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pnpm (or npm/yarn)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/bisheshoggo-ai.git
cd bisheshoggo-ai

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Environment Setup

Create `backend/.env`:
```env
# Database
DATABASE_URL=sqlite:///./bisheshoggo.db

# JWT Settings
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# AI Settings (Get from https://console.groq.com/)
GROQ_API_KEY=your-groq-api-key

# CORS
FRONTEND_URL=http://localhost:3000
DEBUG=True
```

Create `.env.local` in project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```
Backend runs at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
pnpm dev
```
Frontend runs at: http://localhost:3000

### 4. Access the Application

- 🌐 **Frontend:** http://localhost:3000
- 📚 **API Docs:** http://localhost:8000/docs
- 🔧 **API ReDoc:** http://localhost:8000/redoc

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@bisheshoggo.ai | doctor123 |
| CHW | chw@bisheshoggo.ai | chw123 |
| Patient | patient@bisheshoggo.ai | patient123 |

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Healthcare
- `GET /api/facilities` - List medical facilities
- `GET /api/providers` - List healthcare providers
- `POST /api/consultations` - Book consultation
- `POST /api/emergency` - Create emergency alert
- `POST /api/symptom-check` - Save symptom check

### AI Features
- `POST /api/ai/chat/simple` - AI medical chat
- `POST /api/ai/medicine-suggestions` - Get medicine analysis
- `POST /api/ocr/process` - Process prescription image

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **Groq** - AI model provider (LLaMA 3.3)

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Component primitives
- **Lucide Icons** - Icon library

---

## 🌍 Localization

Bisheshoggo AI supports:
- 🇧🇩 Bengali (বাংলা)
- 🇬🇧 English

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Designed for the people of Bangladesh's Hill Tracts
- Built with love for improving rural healthcare access
- Powered by open-source AI technology

---

<div align="center">
  <strong>বিশেষজ্ঞ AI - Expert Healthcare for Everyone</strong>
  <br />
  Made with ❤️ for Bangladesh
</div>
