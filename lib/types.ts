export type UserRole = "patient" | "doctor" | "community_health_worker" | "pharmacy" | "clinic"

export type ConsultationStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled"

export type EmergencyStatus = "active" | "responded" | "resolved" | "cancelled"

export type FacilityType = "hospital" | "clinic" | "pharmacy" | "diagnostic_center"

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface PatientProfile {
  id: string
  date_of_birth: string | null
  blood_group: string | null
  gender: string | null
  address: string | null
  village: string | null
  district: string | null
  division: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string[] | null
  allergies: string[] | null
  current_medications: string[] | null
}

export interface ProviderProfile {
  id: string
  specialization: string | null
  license_number: string | null
  qualification: string | null
  years_of_experience: number | null
  consultation_fee: number | null
  available_for_telemedicine: boolean
  languages: string[] | null
  bio: string | null
}

export interface MedicalFacility {
  id: string
  name: string
  facility_type: FacilityType
  phone: string | null
  address: string
  village: string | null
  district: string
  division: string
  latitude: number | null
  longitude: number | null
  operating_hours: string | null
  services_offered: string[] | null
  has_ambulance: boolean
  has_emergency: boolean
  contact_person: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SymptomCheck {
  id: string
  user_id: string
  symptoms: string[]
  severity: string
  duration: string | null
  additional_notes: string | null
  suggested_conditions: string[] | null
  recommendations: string | null
  created_at: string
  synced: boolean
}

export interface Consultation {
  id: string
  patient_id: string
  provider_id: string | null
  facility_id: string | null
  consultation_type: string
  status: ConsultationStatus
  symptoms: string | null
  diagnosis: string | null
  prescription: string | null
  notes: string | null
  scheduled_at: string | null
  started_at: string | null
  ended_at: string | null
  meeting_link: string | null
  created_at: string
  updated_at: string
}

export interface EmergencySOS {
  id: string
  patient_id: string
  responder_id: string | null
  location_latitude: number
  location_longitude: number
  location_address: string | null
  emergency_type: string
  description: string | null
  status: EmergencyStatus
  responded_at: string | null
  resolved_at: string | null
  created_at: string
}

export interface MedicalRecord {
  id: string
  patient_id: string
  provider_id: string | null
  record_type: string
  title: string
  description: string | null
  document_url: string | null
  record_date: string
  created_at: string
}
