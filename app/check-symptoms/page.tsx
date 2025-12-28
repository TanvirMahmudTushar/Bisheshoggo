"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Stethoscope } from "lucide-react"
import Link from "next/link"
import { SymptomInputForm } from "@/components/symptom-checker/symptom-input-form"
import { TriageResults } from "@/components/symptom-checker/triage-results"
import type { TriageResult } from "@/lib/ai/triage-engine"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function CheckSymptomsPage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [language, setLanguage] = useState<"en" | "bn">("en")

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Stethoscope className="w-8 h-8 text-primary" />
                {language === "en" ? "Check Your Symptoms" : "আপনার লক্ষণ পরীক্ষা করুন"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Works offline • Instant risk assessment" : "অফলাইনে কাজ করে • তাত্ক্ষণিক ঝুঁকি মূল্যায়ন"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="font-semibold"
            >
              {language === "en" ? "বাংলা" : "English"}
            </Button>
          </div>

          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Describe Your Symptoms" : "আপনার লক্ষণ বর্ণনা করুন"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Tell us what you're experiencing so we can provide appropriate guidance"
                    : "আপনি কী অনুভব করছেন তা আমাদের বলুন যাতে আমরা উপযুক্ত নির্দেশনা দিতে পারি"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SymptomInputForm onResult={setResult} language={language} />
              </CardContent>
            </Card>
          ) : (
            <TriageResults result={result} language={language} onReset={() => setResult(null)} />
          )}
        </div>
      </div>
    </>
  )
}
