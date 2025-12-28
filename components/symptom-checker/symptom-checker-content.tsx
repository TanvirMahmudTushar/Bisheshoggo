"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Stethoscope, AlertCircle, ArrowLeft, Check, Loader2, WifiOff, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import type { SymptomCheck } from "@/lib/types"

interface SymptomCheckerContentProps {
  userId: string
  symptomHistory: SymptomCheck[]
}

const commonSymptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Fatigue",
  "Body aches",
  "Sore throat",
  "Runny nose",
  "Shortness of breath",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Abdominal pain",
  "Chest pain",
  "Dizziness",
  "Rash",
  "Joint pain",
]

export function SymptomCheckerContent({ userId, symptomHistory }: SymptomCheckerContentProps) {
  const [step, setStep] = useState<"input" | "results" | "history">("input")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [severity, setSeverity] = useState("")
  const [duration, setDuration] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [results, setResults] = useState<{
    conditions: string[]
    recommendations: string
    severity: string
  } | null>(null)

  // Monitor online/offline status
  if (typeof window !== "undefined") {
    window.addEventListener("online", () => setIsOffline(false))
    window.addEventListener("offline", () => setIsOffline(true))
  }

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()])
      setCustomSymptom("")
    }
  }

  const analyzeSymptoms = (
    symptoms: string[],
    severityLevel: string,
  ): {
    conditions: string[]
    recommendations: string
  } => {
    // Simple rule-based diagnosis (offline capable)
    const symptomsLower = symptoms.map((s) => s.toLowerCase())
    const conditions: string[] = []
    let recommendations = ""

    // Respiratory symptoms
    if (symptomsLower.some((s) => s.includes("cough") || s.includes("throat") || s.includes("nose"))) {
      if (symptomsLower.includes("fever")) {
        conditions.push("Upper Respiratory Infection (Common Cold/Flu)")
      } else {
        conditions.push("Allergic Rhinitis", "Common Cold")
      }
    }

    // Gastrointestinal symptoms
    if (symptomsLower.some((s) => s.includes("nausea") || s.includes("vomiting") || s.includes("diarrhea"))) {
      conditions.push("Gastroenteritis", "Food Poisoning")
    }

    // Severe symptoms
    if (
      symptomsLower.includes("chest pain") ||
      symptomsLower.includes("shortness of breath") ||
      symptomsLower.includes("severe headache")
    ) {
      conditions.push("Requires Immediate Medical Attention")
      recommendations =
        "URGENT: Please seek immediate medical attention or call emergency services. These symptoms may indicate a serious condition."
      return { conditions, recommendations }
    }

    // General recommendations based on severity
    if (severityLevel === "high") {
      recommendations =
        "We recommend scheduling a consultation with a doctor within 24 hours. Your symptoms require professional medical evaluation."
    } else if (severityLevel === "medium") {
      recommendations =
        "Consider scheduling a consultation with a healthcare provider within 2-3 days if symptoms persist or worsen. Rest, stay hydrated, and monitor your symptoms."
    } else {
      recommendations =
        "Your symptoms appear mild. Rest, stay hydrated, and monitor your condition. If symptoms worsen or persist beyond a few days, consult a healthcare provider."
    }

    if (conditions.length === 0) {
      conditions.push("General Illness", "Requires Professional Evaluation")
    }

    return { conditions, recommendations }
  }

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom")
      return
    }

    if (!severity) {
      toast.error("Please select symptom severity")
      return
    }

    setIsLoading(true)

    try {
      // Analyze symptoms locally (works offline)
      const analysis = analyzeSymptoms(selectedSymptoms, severity)

      setResults({
        conditions: analysis.conditions,
        recommendations: analysis.recommendations,
        severity,
      })

      // Try to save to database (will fail gracefully if offline)
      if (!isOffline) {
        if (!supabase) {
          throw new Error("Supabase client not available")
        }

        const { error } = await supabase.from("symptom_checks").insert({
          user_id: userId,
          symptoms: selectedSymptoms,
          severity,
          duration: duration || null,
          additional_notes: additionalNotes || null,
          suggested_conditions: analysis.conditions,
          recommendations: analysis.recommendations,
          synced: true,
        })

        if (error) {
          console.error("[v0] Error saving symptom check:", error)
          // Still show results even if save fails
        } else {
          toast.success("Symptom check saved successfully")
        }
      } else {
        // Queue for offline sync
        const offlineData = {
          user_id: userId,
          symptoms: selectedSymptoms,
          severity,
          duration: duration || null,
          additional_notes: additionalNotes || null,
          suggested_conditions: analysis.conditions,
          recommendations: analysis.recommendations,
          synced: false,
        }
        localStorage.setItem(`symptom_check_${Date.now()}`, JSON.stringify(offlineData))
        toast.info("Saved locally. Will sync when online.")
      }

      setStep("results")
    } catch (error) {
      console.error("[v0] Error in symptom checker:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedSymptoms([])
    setSeverity("")
    setDuration("")
    setAdditionalNotes("")
    setResults(null)
    setStep("input")
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Symptom Checker</h1>
            <p className="text-muted-foreground">AI-powered health assessment</p>
          </div>
        </div>
        {step !== "history" && (
          <Button variant="outline" onClick={() => setStep(step === "history" ? "input" : "history")}>
            {step === "history" ? "New Check" : "View History"}
          </Button>
        )}
      </div>

      {/* Offline Indicator */}
      {isOffline && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex items-center gap-2 py-3">
            <WifiOff className="w-5 h-5 text-amber-500" />
            <p className="text-sm">
              You&apos;re offline. Symptom checker will work, but data will sync when you&apos;re back online.
            </p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {/* Input Form */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Select Your Symptoms</CardTitle>
                <CardDescription>Choose all symptoms you&apos;re experiencing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Common Symptoms */}
                <div>
                  <Label className="mb-3 block">Common Symptoms</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <label
                          htmlFor={symptom}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {symptom}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom */}
                <div className="space-y-2">
                  <Label htmlFor="custom">Add Custom Symptom</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom"
                      placeholder="e.g., Sweating, Chills..."
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
                    />
                    <Button onClick={addCustomSymptom} variant="secondary">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Symptoms ({selectedSymptoms.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/10"
                          onClick={() => toggleSymptom(symptom)}
                        >
                          {symptom}
                          <span className="ml-1">×</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Severity */}
                <div className="space-y-2">
                  <Label htmlFor="severity">
                    Symptom Severity <span className="text-red-500">*</span>
                  </Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="How severe are your symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Mild - Minor discomfort</SelectItem>
                      <SelectItem value="medium">Moderate - Noticeable impact</SelectItem>
                      <SelectItem value="high">Severe - Significantly affecting daily life</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">How long have you had these symptoms?</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few_hours">A few hours</SelectItem>
                      <SelectItem value="1_day">1 day</SelectItem>
                      <SelectItem value="2_3_days">2-3 days</SelectItem>
                      <SelectItem value="4_7_days">4-7 days</SelectItem>
                      <SelectItem value="1_2_weeks">1-2 weeks</SelectItem>
                      <SelectItem value="more_than_2_weeks">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other relevant information about your symptoms..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSubmit} disabled={isLoading || selectedSymptoms.length === 0} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-blue-500/50 bg-blue-500/10">
              <CardContent className="flex gap-3 py-4">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Medical Disclaimer</p>
                  <p className="text-muted-foreground">
                    This tool provides general health information and is not a substitute for professional medical
                    advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical
                    concerns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {step === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      results.severity === "high"
                        ? "bg-red-500/10"
                        : results.severity === "medium"
                          ? "bg-amber-500/10"
                          : "bg-green-500/10"
                    }`}
                  >
                    {results.severity === "high" ? (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    ) : results.severity === "medium" ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Check className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle>Analysis Complete</CardTitle>
                    <CardDescription>Based on your symptoms</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Symptoms Summary */}
                <div>
                  <Label className="mb-2 block">Your Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <Badge key={symptom} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Possible Conditions */}
                <div>
                  <Label className="mb-2 block">Possible Conditions</Label>
                  <div className="space-y-2">
                    {results.conditions.map((condition, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <p className="text-sm font-medium">{condition}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <Label className="mb-2 block">Recommendations</Label>
                  <Card
                    className={
                      results.severity === "high" ? "border-red-500/50 bg-red-500/10" : "border-primary/50 bg-primary/5"
                    }
                  >
                    <CardContent className="py-4">
                      <p className="text-sm">{results.recommendations}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/dashboard/consultations">Book Consultation</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/dashboard/facilities">Find Nearby Facility</Link>
                  </Button>
                  <Button onClick={resetForm} variant="ghost">
                    New Check
                  </Button>
                </div>
              </CardContent>
            </Card>

            {results.severity === "high" && (
              <Card className="border-red-500/50 bg-red-500/10">
                <CardContent className="flex gap-3 py-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1 text-red-500">Emergency Notice</p>
                    <p>
                      Your symptoms may require immediate medical attention. Please use our Emergency SOS feature or
                      call emergency services if your condition worsens.
                    </p>
                    <Button asChild variant="destructive" size="sm" className="mt-3">
                      <Link href="/dashboard/emergency">Emergency SOS</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* History */}
        {step === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Symptom Check History</CardTitle>
                <CardDescription>Your previous health assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {symptomHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No symptom checks yet</p>
                    <Button onClick={() => setStep("input")} className="mt-4">
                      Start Your First Check
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {symptomHistory.map((check) => (
                      <div key={check.id} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <Badge
                            variant={
                              check.severity === "high"
                                ? "destructive"
                                : check.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {check.severity} severity
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(check.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-2">Symptoms:</p>
                          <div className="flex flex-wrap gap-1">
                            {check.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {check.suggested_conditions && check.suggested_conditions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Suggested Conditions:</p>
                            <p className="text-sm text-muted-foreground">{check.suggested_conditions.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
