"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { symptomCheckApi } from "@/lib/api/client";
import { AlertCircle, CheckCircle2, Activity } from "lucide-react";

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [duration, setDuration] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await symptomCheckApi.create({
        symptoms,
        severity,
        duration,
      });

      setResult(response);
      
      // Clear form
      setSymptoms("");
      setDuration("");
      setAdditionalNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-4xl">🩺</span>
          Offline Dr
        </h1>
        <p className="text-muted-foreground">
          AI-powered offline medical assistant • Powered by Local LLaMA
        </p>
        <div className="mt-2 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm text-green-700 dark:text-green-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Works Offline • No Internet Required
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              Tell Me Your Symptoms
            </CardTitle>
            <CardDescription>
              Your local AI doctor will analyze and provide recommendations offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., fever, headache, cough, body ache"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple symptoms with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 days, 1 week"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other relevant information..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Offline Dr is Analyzing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🩺</span>
                    Get Offline Diagnosis
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result && result.ai_analysis && (
            <>
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <CheckCircle2 className="h-5 w-5" />
                    🩺 Offline Dr Analysis Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Diagnosis</h3>
                    <p className="text-blue-800">{result.ai_analysis.diagnosis}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Urgency Level</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.ai_analysis.urgency_level === 'emergency' ? 'bg-red-200 text-red-900' :
                      result.ai_analysis.urgency_level === 'high' ? 'bg-orange-200 text-orange-900' :
                      result.ai_analysis.urgency_level === 'moderate' ? 'bg-yellow-200 text-yellow-900' :
                      'bg-green-200 text-green-900'
                    }`}>
                      {result.ai_analysis.urgency_level?.toUpperCase()}
                    </span>
                  </div>

                  {result.ai_analysis.suggested_conditions && result.ai_analysis.suggested_conditions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Possible Conditions</h3>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        {result.ai_analysis.suggested_conditions.map((condition: string, i: number) => (
                          <li key={i}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Recommendations</h3>
                    <p className="text-blue-800 whitespace-pre-wrap">{result.ai_analysis.recommendations}</p>
                  </div>

                  {result.ai_analysis.home_remedies && result.ai_analysis.home_remedies.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Home Remedies</h3>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        {result.ai_analysis.home_remedies.map((remedy: string, i: number) => (
                          <li key={i}>{remedy}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ai_analysis.warning_signs && result.ai_analysis.warning_signs.length > 0 && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Warning Signs
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                        {result.ai_analysis.warning_signs.map((sign: string, i: number) => (
                          <li key={i}>{sign}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.ai_analysis.should_see_doctor && (
                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                      <p className="text-orange-900 font-medium">
                        ⚠️ We recommend consulting a healthcare professional
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!result && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter your symptoms and click "Analyze Symptoms" to get AI-powered health insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
