"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, AlertTriangle, CheckCircle2, Info, Loader2, ChevronDown, ChevronUp, Pill } from "lucide-react"

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

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/medicine-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptions, diagnosis }),
      })

      if (!response.ok) throw new Error("Failed to fetch suggestions")

      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("[ ] Medicine suggestions error:", error)
    } finally {
      setIsLoading(false)
    }
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
            {!suggestions && !isLoading && (
              <Button onClick={fetchSuggestions} size="sm">
                Get AI Insights
              </Button>
            )}
          </div>
        </CardHeader>

        {isLoading && (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing prescription with AI...</p>
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
                                <CardTitle className="mb-2 text-base">{suggestion.medicine}</CardTitle>
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
