"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, ArrowLeft, Volume2 } from "lucide-react"
import Link from "next/link"
import {
  searchKnowledgeBase,
  getKnowledgeByCategory,
  getAllCategories,
  type MedicalKnowledge,
} from "@/lib/offline/knowledge-base"
import { OfflineIndicator } from "@/components/offline-indicator"
import { TextToSpeech } from "@/lib/voice/speech-recognition"
import { motion } from "framer-motion"

export default function KnowledgeBasePage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [tts] = useState(() => new TextToSpeech(language))

  const categories = getAllCategories()
  const results = searchQuery
    ? searchKnowledgeBase(searchQuery, language)
    : selectedCategory
      ? getKnowledgeByCategory(selectedCategory)
      : []

  const speakArticle = (article: MedicalKnowledge) => {
    const text = language === "en" ? article.content : article.contentBn
    tts.setLanguage(language)
    tts.speak(text)
  }

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-primary" />
                {language === "en" ? "Medical Knowledge Base" : "চিকিৎসা জ্ঞান ভাণ্ডার"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Works offline • Always available" : "অফলাইনে কাজ করে • সর্বদা উপলব্ধ"}
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

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={language === "en" ? "Search medical information..." : "চিকিৎসা তথ্য অনুসন্ধান করুন..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedCategory(null)
                  }}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {!searchQuery && (
            <div className="grid sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="lg"
                  className="h-16 text-base justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {language === "en" ? category.label : category.labelBn}
                </Button>
              ))}
            </div>
          )}

          {/* Results */}
          {(searchQuery || selectedCategory) && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {results.length} {language === "en" ? "articles found" : "নিবন্ধ পাওয়া গেছে"}
              </p>
              {results.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {language === "en" ? article.title : article.titleBn}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {language === "en" ? article.content : article.contentBn}
                          </CardDescription>
                        </div>
                        {tts.isSupported() && (
                          <Button size="icon" variant="ghost" onClick={() => speakArticle(article)}>
                            <Volume2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {article.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!searchQuery && !selectedCategory && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en" ? "Browse Medical Information" : "চিকিৎসা তথ্য ব্রাউজ করুন"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Select a category above or search for specific topics"
                    : "উপরে একটি বিভাগ নির্বাচন করুন বা নির্দিষ্ট বিষয় অনুসন্ধান করুন"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
