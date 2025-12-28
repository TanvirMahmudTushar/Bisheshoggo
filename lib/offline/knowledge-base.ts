"use client"

export interface MedicalKnowledge {
  id: string
  category: string
  title: string
  titleBn: string
  content: string
  contentBn: string
  keywords: string[]
}

export const medicalKnowledgeBase: MedicalKnowledge[] = [
  {
    id: "fever-basics",
    category: "common-symptoms",
    title: "Fever - When to Worry",
    titleBn: "জ্বর - কখন চিন্তিত হবেন",
    content:
      "Fever is body temperature above 100.4°F (38°C). Mild fever helps fight infection. Seek medical help if fever is above 103°F, lasts more than 3 days, or accompanied by severe symptoms.",
    contentBn:
      "জ্বর হল শরীরের তাপমাত্রা ১০০.৪°ফা (৩৮°সে) এর উপরে। হালকা জ্বর সংক্রমণের বিরুদ্ধে লড়াই করতে সাহায্য করে। জ্বর ১০৩°ফা এর উপরে হলে, ৩ দিনের বেশি স্থায়ী হলে বা গুরুতর লক্ষণ থাকলে চিকিৎসা নিন।",
    keywords: ["fever", "temperature", "জ্বর"],
  },
  {
    id: "diarrhea-treatment",
    category: "common-symptoms",
    title: "Diarrhea - Home Treatment",
    titleBn: "ডায়রিয়া - ঘরোয়া চিকিৎসা",
    content:
      "Stay hydrated with ORS (Oral Rehydration Solution). Mix 6 teaspoons sugar + 1/2 teaspoon salt in 1 liter clean water. Drink frequently. Avoid dairy and spicy foods. Seek help if blood in stool or severe dehydration.",
    contentBn:
      "ওআরএস (মুখে খাওয়ার স্যালাইন) দিয়ে শরীরে পানির পরিমাণ ঠিক রাখুন। ১ লিটার বিশুদ্ধ পানিতে ৬ চা চামচ চিনি + ১/২ চা চামচ লবণ মিশান। ঘন ঘন পান করুন। দুধ ও ঝাল খাবার এড়িয়ে চলুন। মলে রক্ত বা মারাত্মক পানিশূন্যতা হলে সাহায্য নিন।",
    keywords: ["diarrhea", "dehydration", "ors", "ডায়রিয়া", "স্যালাইন"],
  },
  {
    id: "cough-cold",
    category: "respiratory",
    title: "Cough and Cold",
    titleBn: "কাশি ও সর্দি",
    content:
      "Most colds resolve in 7-10 days. Rest, drink warm fluids, gargle with salt water. Honey can soothe cough (not for babies under 1 year). See doctor if difficulty breathing, chest pain, or high fever.",
    contentBn:
      "বেশিরভাগ সর্দি ৭-১০ দিনে সেরে যায়। বিশ্রাম নিন, গরম তরল পান করুন, লবণ পানিতে গার্গল করুন। মধু কাশি কমায় (১ বছরের কম বাচ্চাদের জন্য নয়)। শ্বাস নিতে কষ্ট, বুকে ব্যথা বা তীব্র জ্বর হলে ডাক্তার দেখান।",
    keywords: ["cough", "cold", "flu", "কাশি", "সর্দি"],
  },
  {
    id: "wounds-cuts",
    category: "first-aid",
    title: "Wound Care",
    titleBn: "ক্ষত পরিচর্যা",
    content:
      "Clean wound with clean water and soap. Apply pressure if bleeding. Cover with clean cloth or bandage. Change dressing daily. Watch for signs of infection: increased pain, redness, swelling, pus, or fever.",
    contentBn:
      "ক্ষতটি পরিষ্কার পানি ও সাবান দিয়ে ধুয়ে নিন। রক্তপাত হলে চাপ দিন। পরিষ্কার কাপড় বা ব্যান্ডেজ দিয়ে ঢেকে রাখুন। প্রতিদিন ড্রেসিং পরিবর্তন করুন। সংক্রমণের লক্ষণ দেখুন: ব্যথা বৃদ্ধি, লাল হওয়া, ফোলা, পুঁজ বা জ্বর।",
    keywords: ["wound", "cut", "bleeding", "ক্ষত", "রক্তপাত"],
  },
  {
    id: "snake-bite",
    category: "emergency",
    title: "Snake Bite First Aid",
    titleBn: "সাপে কাটা প্রাথমিক চিকিৎসা",
    content:
      "IMMEDIATELY go to hospital. Keep affected limb still and below heart level. Remove jewelry/tight clothing. DO NOT cut wound, apply tourniquet, or try to suck venom. Note snake appearance if safe to do so.",
    contentBn:
      "অবিলম্বে হাসপাতালে যান। ক্ষতিগ্রস্ত অঙ্গটি স্থির রাখুন এবং হৃদয়ের নিচে রাখুন। গহনা/আঁটসাঁট পোশাক সরিয়ে ফেলুন। ক্ষত কাটবেন না, টর্নিকেট প্রয়োগ করবেন না বা বিষ চুষে বের করার চেষ্টা করবেন না। নিরাপদ হলে সাপের চেহারা মনে রাখুন।",
    keywords: ["snake", "bite", "venom", "emergency", "সাপ", "কামড়"],
  },
  {
    id: "pregnancy-warning",
    category: "maternal-health",
    title: "Pregnancy Warning Signs",
    titleBn: "গর্ভাবস্থায় বিপদ চিহ্ন",
    content:
      "Seek immediate help for: severe headache, vision problems, severe abdominal pain, vaginal bleeding, fluid leakage, decreased fetal movement, high fever, severe swelling of face/hands.",
    contentBn:
      "অবিলম্বে সাহায্য নিন যদি: তীব্র মাথাব্যথা, দৃষ্টি সমস্যা, তীব্র পেট ব্যথা, যোনিপথে রক্তপাত, তরল নিঃসরণ, শিশুর নড়াচড়া কমে যাওয়া, তীব্র জ্বর, মুখ/হাত মারাত্মক ফুলে যাওয়া।",
    keywords: ["pregnancy", "maternal", "warning", "গর্ভাবস্থা", "মা"],
  },
  {
    id: "chest-pain",
    category: "emergency",
    title: "Chest Pain - Emergency",
    titleBn: "বুকে ব্যথা - জরুরি",
    content:
      "Chest pain can be serious. Call for emergency help if pain is severe, crushing, spreading to arm/jaw/back, with sweating, nausea, or shortness of breath. Could be heart attack. Chew aspirin if available while waiting.",
    contentBn:
      "বুকে ব্যথা গুরুতর হতে পারে। জরুরি সাহায্য ডাকুন যদি ব্যথা তীব্র হয়, চাপা লাগে, বাহু/চোয়াল/পিঠে ছড়ায়, ঘাম, বমি বমি ভাব বা শ্বাসকষ্ট হয়। হার্ট অ্যাটাক হতে পারে। অপেক্ষা করার সময় অ্যাসপিরিন চিবান।",
    keywords: ["chest pain", "heart attack", "cardiac", "বুকে ব্যথা", "হার্ট"],
  },
  {
    id: "diabetes-basics",
    category: "chronic-disease",
    title: "Diabetes Management",
    titleBn: "ডায়াবেটিস ব্যবস্থাপনা",
    content:
      "Monitor blood sugar regularly. Take medications as prescribed. Eat balanced diet with controlled portions. Exercise regularly. Check feet daily for wounds. Watch for symptoms: increased thirst, frequent urination, blurred vision, fatigue.",
    contentBn:
      "নিয়মিত রক্তে চিনি পরীক্ষা করুন। নির্দেশিত ওষুধ খান। নিয়ন্ত্রিত পরিমাণে সুষম খাবার খান। নিয়মিত ব্যায়াম করুন। প্রতিদিন পায়ে ক্ষত আছে কিনা পরীক্ষা করুন। লক্ষণগুলি লক্ষ্য করুন: অতিরিক্ত তৃষ্ণা, ঘন ঘন প্রস্রাব, ঝাপসা দৃষ্টি, ক্লান্তি।",
    keywords: ["diabetes", "blood sugar", "insulin", "ডায়াবেটিস", "চিনি"],
  },
]

export function searchKnowledgeBase(query: string, language: "en" | "bn" = "en"): MedicalKnowledge[] {
  const lowerQuery = query.toLowerCase()
  return medicalKnowledgeBase.filter((item) => {
    const searchText = language === "bn" ? `${item.titleBn} ${item.contentBn}` : `${item.title} ${item.content}`
    const keywords = item.keywords.join(" ").toLowerCase()
    return searchText.toLowerCase().includes(lowerQuery) || keywords.includes(lowerQuery)
  })
}

export function getKnowledgeByCategory(category: string): MedicalKnowledge[] {
  return medicalKnowledgeBase.filter((item) => item.category === category)
}

export function getAllCategories(): Array<{ id: string; label: string; labelBn: string }> {
  return [
    { id: "common-symptoms", label: "Common Symptoms", labelBn: "সাধারণ লক্ষণ" },
    { id: "respiratory", label: "Respiratory Issues", labelBn: "শ্বাসযন্ত্রের সমস্যা" },
    { id: "first-aid", label: "First Aid", labelBn: "প্রাথমিক চিকিৎসা" },
    { id: "emergency", label: "Emergency", labelBn: "জরুরি" },
    { id: "maternal-health", label: "Maternal Health", labelBn: "মাতৃস্বাস্থ্য" },
    { id: "chronic-disease", label: "Chronic Disease", labelBn: "দীর্ঘমেয়াদী রোগ" },
  ]
}
