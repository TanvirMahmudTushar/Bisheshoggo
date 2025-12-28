"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Activity, AlertCircle, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { offlineStorage } from "@/lib/offline/storage"
import { motion } from "framer-motion"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function HistoryPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const symptomChecks = offlineStorage.getAll("symptom_check_")
    const emergencies = offlineStorage.getAll("emergency_")

    const combined = [
      ...symptomChecks.map((item: any) => ({ ...item, type: "symptom_check" })),
      ...emergencies.map((item: any) => ({ ...item, type: "emergency" })),
    ]

    combined.sort((a, b) => new Date(b.date || b.timestamp).getTime() - new Date(a.date || a.timestamp).getTime())
    setHistory(combined)
  }

  const clearHistory = () => {
    if (confirm(language === "en" ? "Clear all history?" : "সব ইতিহাস মুছবেন?")) {
      offlineStorage.clear()
      setHistory([])
    }
  }

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
              <h1 className="text-2xl md:text-3xl font-bold">{language === "en" ? "Case History" : "কেস ইতিহাস"}</h1>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Your symptom checks and emergency alerts" : "আপনার লক্ষণ পরীক্ষা এবং জরুরি সতর্কতা"}
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

          {history.length > 0 && (
            <Button variant="destructive" onClick={clearHistory} className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              {language === "en" ? "Clear History" : "ইতিহাস মুছুন"}
            </Button>
          )}

          {history.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en" ? "No History Yet" : "এখনও কোন ইতিহাস নেই"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Your symptom checks and alerts will appear here"
                    : "আপনার লক্ষণ পরীক্ষা এবং সতর্কতা এখানে প্রদর্শিত হবে"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {item.type === "emergency" ? (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          ) : (
                            <Activity className="w-6 h-6 text-primary" />
                          )}
                          <div>
                            <CardTitle className="text-lg">
                              {item.type === "emergency"
                                ? language === "en"
                                  ? "Emergency Alert"
                                  : "জরুরি সতর্কতা"
                                : language === "en"
                                  ? "Symptom Check"
                                  : "লক্ষণ পরীক্ষা"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.date || item.timestamp).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                        {item.result?.riskLevel && (
                          <Badge
                            className={
                              item.result.riskLevel === "emergency" || item.result.riskLevel === "high"
                                ? "bg-red-500"
                                : item.result.riskLevel === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-emerald-500"
                            }
                          >
                            {item.result.riskLevel.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.input?.symptoms && item.input.symptoms.length > 0 && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">{language === "en" ? "Symptoms:" : "লক্ষণ:"}</span>{" "}
                          {item.input.symptoms.join(", ")}
                        </p>
                      )}
                      {item.data?.emergency && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">{language === "en" ? "Emergency:" : "জরুরি:"}</span>{" "}
                          {item.data.emergency}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
