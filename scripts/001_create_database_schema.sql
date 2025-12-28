-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'community_health_worker', 'pharmacy', 'clinic');
CREATE TYPE consultation_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE emergency_status AS ENUM ('active', 'responded', 'resolved', 'cancelled');
CREATE TYPE facility_type AS ENUM ('hospital', 'clinic', 'pharmacy', 'diagnostic_center');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient profiles
CREATE TABLE IF NOT EXISTS public.patient_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  blood_group TEXT,
  gender TEXT,
  address TEXT,
  village TEXT,
  district TEXT,
  division TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_conditions TEXT[],
  allergies TEXT[],
  current_medications TEXT[]
);

-- Healthcare provider profiles
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  license_number TEXT,
  qualification TEXT,
  years_of_experience INTEGER,
  consultation_fee DECIMAL(10,2),
  available_for_telemedicine BOOLEAN DEFAULT true,
  languages TEXT[],
  bio TEXT
);

-- Medical facilities
CREATE TABLE IF NOT EXISTS public.medical_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  facility_type facility_type NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  village TEXT,
  district TEXT NOT NULL,
  division TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  operating_hours TEXT,
  services_offered TEXT[],
  has_ambulance BOOLEAN DEFAULT false,
  has_emergency BOOLEAN DEFAULT false,
  contact_person TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Symptom checker history
CREATE TABLE IF NOT EXISTS public.symptom_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  symptoms TEXT[] NOT NULL,
  severity TEXT NOT NULL,
  duration TEXT,
  additional_notes TEXT,
  suggested_conditions TEXT[],
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced BOOLEAN DEFAULT true
);

-- Consultations
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  facility_id UUID REFERENCES public.medical_facilities(id) ON DELETE SET NULL,
  consultation_type TEXT NOT NULL, -- 'video', 'chat', 'in_person'
  status consultation_status NOT NULL DEFAULT 'pending',
  symptoms TEXT,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency SOS
CREATE TABLE IF NOT EXISTS public.emergency_sos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  location_latitude DECIMAL(10, 8) NOT NULL,
  location_longitude DECIMAL(11, 8) NOT NULL,
  location_address TEXT,
  emergency_type TEXT NOT NULL,
  description TEXT,
  status emergency_status NOT NULL DEFAULT 'active',
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical records
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  record_type TEXT NOT NULL, -- 'prescription', 'lab_report', 'imaging', 'consultation_notes'
  title TEXT NOT NULL,
  description TEXT,
  document_url TEXT,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages for telemedicine
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offline sync queue
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  data JSONB NOT NULL,
  synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_sos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for patient_profiles
CREATE POLICY "Patients can view own profile" ON public.patient_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Healthcare providers can view patient profiles" ON public.patient_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'community_health_worker'))
);
CREATE POLICY "Patients can update own profile" ON public.patient_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Patients can insert own profile" ON public.patient_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for provider_profiles
CREATE POLICY "Anyone can view provider profiles" ON public.provider_profiles FOR SELECT USING (true);
CREATE POLICY "Providers can update own profile" ON public.provider_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Providers can insert own profile" ON public.provider_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for medical_facilities
CREATE POLICY "Anyone can view facilities" ON public.medical_facilities FOR SELECT USING (true);
CREATE POLICY "Healthcare providers can insert facilities" ON public.medical_facilities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'community_health_worker', 'clinic', 'pharmacy'))
);
CREATE POLICY "Creators can update own facilities" ON public.medical_facilities FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for symptom_checks
CREATE POLICY "Users can view own symptom checks" ON public.symptom_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own symptom checks" ON public.symptom_checks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consultations
CREATE POLICY "Patients can view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view assigned consultations" ON public.consultations FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Patients can create consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own consultations" ON public.consultations FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Providers can update assigned consultations" ON public.consultations FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for emergency_sos
CREATE POLICY "Patients can view own SOS" ON public.emergency_sos FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Healthcare workers can view all SOS" ON public.emergency_sos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'community_health_worker'))
);
CREATE POLICY "Patients can create SOS" ON public.emergency_sos FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Healthcare workers can update SOS" ON public.emergency_sos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'community_health_worker'))
);

-- RLS Policies for medical_records
CREATE POLICY "Patients can view own records" ON public.medical_records FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Providers can view records they created" ON public.medical_records FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can insert records" ON public.medical_records FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update own records" ON public.medical_records FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for consultation_messages
CREATE POLICY "Participants can view messages" ON public.consultation_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.consultations 
    WHERE id = consultation_id 
    AND (patient_id = auth.uid() OR provider_id = auth.uid())
  )
);
CREATE POLICY "Participants can send messages" ON public.consultation_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.consultations 
    WHERE id = consultation_id 
    AND (patient_id = auth.uid() OR provider_id = auth.uid())
  )
);

-- RLS Policies for offline_sync_queue
CREATE POLICY "Users can view own sync queue" ON public.offline_sync_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sync items" ON public.offline_sync_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sync items" ON public.offline_sync_queue FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_facilities_district ON public.medical_facilities(district);
CREATE INDEX idx_facilities_type ON public.medical_facilities(facility_type);
CREATE INDEX idx_facilities_location ON public.medical_facilities(latitude, longitude);
CREATE INDEX idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX idx_consultations_provider ON public.consultations(provider_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_emergency_status ON public.emergency_sos(status);
CREATE INDEX idx_messages_consultation ON public.consultation_messages(consultation_id);
