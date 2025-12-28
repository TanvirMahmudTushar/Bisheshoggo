"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EmergencyAlert } from "@/components/emergency/emergency-alert"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function EmergencyPage() {
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
              <h1 className="text-2xl md:text-3xl font-bold text-red-500">
                {language === "en" ? "Emergency SOS" : "জরুরি এসওএস"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Get immediate medical help" : "তাৎক্ষণিক চিকিৎসা সাহায্য পান"}
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

          <EmergencyAlert language={language} />
        </div>
      </div>
    </>
  )
}
