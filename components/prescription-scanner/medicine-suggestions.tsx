"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, ChevronDown, ChevronUp, Pill, MessageSquare } from "lucide-react"
import { aiApi } from "@/lib/api/client"

interface MedicineSuggestionsProps {
  prescriptions: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
  }>
  diagnosis?: string
}

export function MedicineSuggestions({ prescriptions, diagnosis }: MedicineSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  
  // Questionnaire state
  const [usageDuration, setUsageDuration] = useState("")
  const [currentSymptoms, setCurrentSymptoms] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      // Build comprehensive patient history from questionnaire
      const patientHistory = `
Usage Duration: ${usageDuration || "Not specified"}
Current Symptoms: ${currentSymptoms || "Not specified"}
Additional Information: ${additionalInfo || "None"}
      `.trim()

      const response = await aiApi.getMedicineSuggestions({
        prescriptions,
        diagnosis: diagnosis || "Not specified",
        patientHistory
      })

      setSuggestions(response)
      setShowQuestionnaire(false)
    } catch (error) {
      console.error("[Bisheshoggo AI] Medicine suggestions error:", error)
      // Fallback with basic suggestions
      setSuggestions({
        suggestions: prescriptions.map(med => ({
          medicine: med.name,
          reason: "Continue as prescribed",
          alternatives: [],
          precautions: ["Follow doctor's instructions", "Complete the full course"],
          interactions: [],
          effectiveness: "moderate"
        })),
        overallRecommendation: "Please consult with your healthcare provider for personalized advice.",
        warnings: ["Unable to connect to AI service. Please try again later."]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startQuestionnaire = () => {
    setShowQuestionnaire(true)
  }

  const handleSubmitQuestionnaire = () => {
    if (!currentSymptoms.trim()) {
      alert("Please enter your current symptoms")
      return
    }
    fetchSuggestions()
  }

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "high":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "moderate":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "low":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Medicine Analysis
            </CardTitle>
            {!suggestions && !isLoading && !showQuestionnaire && (
              <Button onClick={startQuestionnaire} size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Get AI Insights
              </Button>
            )}
          </div>
        </CardHeader>

        {showQuestionnaire && !isLoading && (
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-primary mt-1" />
                  <div>
                    <p className="font-medium mb-1">AI Medical Assistant</p>
                    <p className="text-sm text-muted-foreground">
                      To provide you with the best medicine recommendations, please answer a few questions about your health.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usageDuration" className="text-base">
                    For how many months have you been taking these medicines? *
                  </Label>
                  <Input
                    id="usageDuration"
                    value={usageDuration}
                    onChange={(e) => setUsageDuration(e.target.value)}
                    placeholder="e.g., 2 months, 1 week, just started"
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps us understand if you need to continue or adjust your medication.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSymptoms" className="text-base">
                    What symptoms do you currently have? *
                  </Label>
                  <Textarea
                    id="currentSymptoms"
                    value={currentSymptoms}
                    onChange={(e) => setCurrentSymptoms(e.target.value)}
                    placeholder="Describe your current symptoms in detail (e.g., fever, headache, stomach pain, cough...)"
                    className="min-h-[100px] bg-background"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Based on your symptoms, AI will recommend which medicines from your prescription to take.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-base">
                    Any other health concerns or questions?
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="e.g., allergies, side effects, pregnancy, other medications..."
                    className="min-h-[80px] bg-background"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmitQuestionnaire} className="flex-1">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Personalized Recommendations
                </Button>
                <Button onClick={() => setShowQuestionnaire(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </CardContent>
        )}

        {isLoading && (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing your symptoms and prescription...</p>
              <p className="text-xs text-muted-foreground mt-2">AI is generating personalized recommendations...</p>
            </div>
          </CardContent>
        )}

        {suggestions && (
          <CardContent className="space-y-6">
            {suggestions.warnings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                  <div className="space-y-2">
                    <p className="font-medium text-destructive">Important Warnings</p>
                    <ul className="space-y-1 text-sm">
                      {suggestions.warnings.map((warning: string, index: number) => (
                        <li key={index} className="text-destructive/90">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="mb-1 font-medium">Overall Recommendation</p>
                  <p className="text-sm text-muted-foreground">{suggestions.overallRecommendation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <Pill className="h-4 w-4" />
                Medicine Analysis ({suggestions.suggestions.length})
              </h3>

              <AnimatePresence>
                {suggestions.suggestions.map((suggestion: any, index: number) => {
                  const isExpanded = expandedIndex === index

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-border/40">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : index)}
                          className="w-full text-left transition-colors hover:bg-accent/50"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-base">{suggestion.medicine}</CardTitle>
                                  {suggestion.shouldTake && (
                                    <Badge 
                                      variant={
                                        suggestion.shouldTake.startsWith("YES") ? "default" : 
                                        suggestion.shouldTake.startsWith("NO") ? "destructive" : 
                                        "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {suggestion.shouldTake.split(" - ")[0]}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getEffectivenessColor(suggestion.effectiveness)}>
                                  {suggestion.effectiveness}
                                </Badge>
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CardContent className="space-y-4 border-t border-border/40 pt-4">
                                {suggestion.alternatives.length > 0 && (
                                  <div>
                                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      Alternative Options
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {suggestion.alternatives.map((alt: string, i: number) => (
                                        <Badge key={i} variant="outline" className="bg-accent/50">
                                          {alt}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {suggestion.precautions.length > 0 && (
                                  <div>
                                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                      Precautions
                                    </p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                      {suggestion.precautions.map((precaution: string, i: number) => (
                                        <li key={i}>• {precaution}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {suggestion.interactions.length > 0 && (
                                  <div>
                                    <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                                      <Info className="h-4 w-4 text-blue-500" />
                                      Drug Interactions
                                    </p>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                      {suggestion.interactions.map((interaction: string, i: number) => (
                                        <li key={i}>• {interaction}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
