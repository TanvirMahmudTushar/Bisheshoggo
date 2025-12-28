"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TriageResult } from "@/lib/ai/triage-engine"
import { AlertTriangle, CheckCircle, Info, Phone, RotateCcw, Shield } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface TriageResultsProps {
  result: TriageResult
  language: "en" | "bn"
  onReset: () => void
}

export function TriageResults({ result, language, onReset }: TriageResultsProps) {
  const getRiskColor = () => {
    switch (result.riskLevel) {
      case "emergency":
        return "bg-red-500/10 border-red-500 text-red-500"
      case "high":
        return "bg-orange-500/10 border-orange-500 text-orange-500"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-500"
      case "low":
        return "bg-emerald-500/10 border-emerald-500 text-emerald-500"
    }
  }

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case "emergency":
        return <AlertTriangle className="w-8 h-8" />
      case "high":
        return <AlertTriangle className="w-8 h-8" />
      case "medium":
        return <Info className="w-8 h-8" />
      case "low":
        return <CheckCircle className="w-8 h-8" />
    }
  }

  const reasons = language === "en" ? result.reasons : result.reasonsBn
  const advice = language === "en" ? result.advice : result.adviceBn
  const warningSigns = language === "en" ? result.warningSigns : result.warningSignsBn
  const urgency = language === "en" ? result.urgency : result.urgencyBn
  const recommendation = language === "en" ? result.recommendation : result.recommendationBn

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Risk Level Card */}
      <Card className={`border-2 ${getRiskColor()}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getRiskIcon()}
              <div>
                <CardTitle className="text-2xl">{urgency}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {language === "en" ? "Risk Assessment" : "ঝুঁকি মূল্যায়ন"}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {result.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className={getRiskColor()}>
            <Shield className="h-5 w-5" />
            <AlertDescription className="text-base font-medium ml-2">{recommendation}</AlertDescription>
          </Alert>

          {result.shouldSeekImmediate && (
            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-lg h-14" asChild>
              <Link href="/dashboard/emergency">
                <Phone className="w-5 h-5 mr-2" />
                {language === "en" ? "Call Emergency Now" : "এখনই জরুরি কল করুন"}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Reasons */}
      {reasons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Why This Assessment?" : "কেন এই মূল্যায়ন?"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-base">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Health Advice */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "What You Should Do" : "আপনার কী করা উচিত"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {advice.map((item, index) => (
              <li key={index} className="flex items-start gap-3 bg-muted p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-base">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card className="border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <AlertTriangle className="w-5 h-5" />
            {language === "en" ? "Warning Signs to Watch For" : "সতর্কতা চিহ্ন"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {language === "en"
              ? "Seek immediate medical help if you experience any of these:"
              : "এইগুলির যেকোনো একটি অনুভব করলে অবিলম্বে চিকিৎসা সাহায্য নিন:"}
          </p>
          <ul className="space-y-2">
            {warningSigns.map((sign, index) => (
              <li key={index} className="flex items-start gap-2 text-base">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" size="lg" className="flex-1 h-12 bg-transparent" onClick={onReset}>
          <RotateCcw className="w-5 h-5 mr-2" />
          {language === "en" ? "Check Again" : "আবার পরীক্ষা করুন"}
        </Button>
        <Button size="lg" className="flex-1 h-12" asChild>
          <Link href="/dashboard/consultations">{language === "en" ? "Book Consultation" : "পরামর্শ বুক করুন"}</Link>
        </Button>
      </div>
    </motion.div>
  )
}
