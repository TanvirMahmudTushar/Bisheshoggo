"use client"

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface EmergencySMSData {
  patientName: string
  age: number
  location: string
  coordinates?: { lat: number; lng: number }
  emergency: string
  symptoms?: string[]
  medicalHistory?: string
}

export function generateEmergencySMS(data: EmergencySMSData, language: "en" | "bn" = "en"): string {
  if (language === "bn") {
    return `জরুরি: ${data.patientName}, বয়স ${data.age}, অবস্থান: ${data.location}${data.coordinates ? ` (${data.coordinates.lat.toFixed(4)},${data.coordinates.lng.toFixed(4)})` : ""}. জরুরি: ${data.emergency}${data.symptoms && data.symptoms.length > 0 ? `. লক্ষণ: ${data.symptoms.join(", ")}` : ""}. অবিলম্বে সাহায্য প্রয়োজন!`
  }

  return `EMERGENCY: ${data.patientName}, age ${data.age}, at ${data.location}${data.coordinates ? ` (${data.coordinates.lat.toFixed(4)},${data.coordinates.lng.toFixed(4)})` : ""}. Emergency: ${data.emergency}${data.symptoms && data.symptoms.length > 0 ? `. Symptoms: ${data.symptoms.join(", ")}` : ""}. Immediate help needed!`
}

export function generateShareableEmergencyText(data: EmergencySMSData, language: "en" | "bn" = "en"): string {
  const sms = generateEmergencySMS(data, language)
  const mapsLink = data.coordinates
    ? `\n\n${language === "en" ? "Location" : "অবস্থান"}: https://maps.google.com/?q=${data.coordinates.lat},${data.coordinates.lng}`
    : ""

  return sms + mapsLink
}

export function sendSMS(phoneNumber: string, message: string): void {
  // Create SMS link that opens default messaging app
  const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`

  if (typeof window !== "undefined") {
    window.location.href = smsLink
  }
}

export function makePhoneCall(phoneNumber: string): void {
  if (typeof window !== "undefined") {
    window.location.href = `tel:${phoneNumber}`
  }
}

export const EMERGENCY_HOTLINES = {
  ambulance: "999",
  police: "999",
  fireService: "999",
  nationalEmergency: "999",
  womenChildren: "109",
}

export const DEFAULT_CHW_CONTACTS = [
  {
    name: "Local Health Worker",
    phone: "+8801700000000",
    relationship: "Community Health Worker",
  },
  {
    name: "Nearby Clinic",
    phone: "+8801800000000",
    relationship: "Healthcare Facility",
  },
]
