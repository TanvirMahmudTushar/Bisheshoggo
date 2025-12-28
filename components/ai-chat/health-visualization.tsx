"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, Activity, Heart, BarChart } from "lucide-react"

interface HealthVisualizationProps {
  data: {
    symptoms: Array<{ name: string; count: number }>
    healthScore: number
    consultations: Array<{ month: string; count: number }>
    vitals: {
      heartRate: number
      bloodPressure: string
      temperature: number
      weight: number
    }
  }
}

export function HealthVisualization({ data }: HealthVisualizationProps) {
  const maxSymptom = Math.max(...data.symptoms.map((s) => s.count))
  const maxConsultation = Math.max(...data.consultations.map((c) => c.count))

  return (
    <div className="mt-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-primary">{data.healthScore}%</span>
                <span className="flex items-center gap-1 text-sm text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  +5% this month
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.healthScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart className="h-4 w-4 text-primary" />
              Common Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.symptoms.map((symptom, index) => (
                <div key={symptom.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{symptom.name}</span>
                    <span className="font-medium">{symptom.count} times</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(symptom.count / maxSymptom) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2">
                {data.consultations.map((item, index) => (
                  <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative h-24 w-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.count / maxConsultation) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-primary to-blue-500"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-primary" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Heart Rate</p>
                  <p className="text-lg font-semibold">{data.vitals.heartRate} bpm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">BP</p>
                  <p className="text-lg font-semibold">{data.vitals.bloodPressure}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Temp</p>
                  <p className="text-lg font-semibold">{data.vitals.temperature}°F</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-lg font-semibold">{data.vitals.weight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
