export const translations = {
  // Navigation
  dashboard: { en: "Dashboard", bn: "ড্যাশবোর্ড" },
  checkSymptoms: { en: "Check Symptoms", bn: "লক্ষণ পরীক্ষা করুন" },
  emergency: { en: "Emergency", bn: "জরুরি" },
  facilities: { en: "Facilities", bn: "সুবিধা" },
  consultations: { en: "Consultations", bn: "পরামর্শ" },
  records: { en: "Medical Records", bn: "চিকিৎসা রেকর্ড" },
  profile: { en: "Profile", bn: "প্রোফাইল" },
  settings: { en: "Settings", bn: "সেটিংস" },

  // Common Actions
  submit: { en: "Submit", bn: "জমা দিন" },
  cancel: { en: "Cancel", bn: "বাতিল" },
  save: { en: "Save", bn: "সংরক্ষণ করুন" },
  edit: { en: "Edit", bn: "সম্পাদনা" },
  delete: { en: "Delete", bn: "মুছুন" },
  back: { en: "Back", bn: "ফিরে যান" },
  next: { en: "Next", bn: "পরবর্তী" },
  previous: { en: "Previous", bn: "পূর্ববর্তী" },
  close: { en: "Close", bn: "বন্ধ" },
  search: { en: "Search", bn: "অনুসন্ধান" },

  // Status
  online: { en: "Online", bn: "অনলাইন" },
  offline: { en: "Offline", bn: "অফলাইন" },
  syncing: { en: "Syncing", bn: "সিঙ্ক হচ্ছে" },
  synced: { en: "Synced", bn: "সিঙ্ক হয়েছে" },
  pending: { en: "Pending", bn: "অপেক্ষমাণ" },
  completed: { en: "Completed", bn: "সম্পন্ন" },
  cancelled: { en: "Cancelled", bn: "বাতিল" },

  // Health Terms
  symptoms: { en: "Symptoms", bn: "লক্ষণ" },
  diagnosis: { en: "Diagnosis", bn: "রোগ নির্ণয়" },
  prescription: { en: "Prescription", bn: "প্রেসক্রিপশন" },
  medicine: { en: "Medicine", bn: "ওষুধ" },
  treatment: { en: "Treatment", bn: "চিকিৎসা" },
  doctor: { en: "Doctor", bn: "ডাক্তার" },
  patient: { en: "Patient", bn: "রোগী" },
  hospital: { en: "Hospital", bn: "হাসপাতাল" },
  clinic: { en: "Clinic", bn: "ক্লিনিক" },
  pharmacy: { en: "Pharmacy", bn: "ফার্মেসি" },

  // Emergency
  callEmergency: { en: "Call Emergency", bn: "জরুরি কল করুন" },
  sendAlert: { en: "Send Alert", bn: "সতর্কতা পাঠান" },
  getLocation: { en: "Get Location", bn: "অবস্থান পান" },
  ambulance: { en: "Ambulance", bn: "অ্যাম্বুলেন্স" },
  helpNeeded: { en: "Help Needed", bn: "সাহায্য প্রয়োজন" },
}

export function t(key: keyof typeof translations, language: "en" | "bn" = "en"): string {
  return translations[key]?.[language] || key
}
