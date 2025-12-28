"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextToSpeech } from "@/lib/voice/speech-recognition"
import { motion, AnimatePresence } from "framer-motion"

interface VoicePromptGuideProps {
  prompts: Array<{ en: string; bn: string }>
  language: "en" | "bn"
  autoPlay?: boolean
}

export function VoicePromptGuide({ prompts, language, autoPlay = false }: VoicePromptGuideProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tts, setTts] = useState<TextToSpeech | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    const textToSpeech = new TextToSpeech(language)
    setTts(textToSpeech)

    if (autoPlay && textToSpeech.isSupported()) {
      const currentPrompt = prompts[0]
      const text = language === "en" ? currentPrompt.en : currentPrompt.bn
      setTimeout(() => {
        textToSpeech.speak(text)
        setIsSpeaking(true)
      }, 500)
    }

    return () => {
      textToSpeech.stop()
    }
  }, [language, autoPlay, prompts])

  const speakCurrent = () => {
    if (!tts) return

    const currentPrompt = prompts[currentIndex]
    const text = language === "en" ? currentPrompt.en : currentPrompt.bn

    if (isSpeaking) {
      tts.stop()
      setIsSpeaking(false)
    } else {
      tts.speak(text)
      setIsSpeaking(true)
      setTimeout(() => setIsSpeaking(false), text.length * 100)
    }
  }

  if (!tts || !tts.isSupported()) {
    return null
  }

  const currentPrompt = prompts[currentIndex]
  const text = language === "en" ? currentPrompt.en : currentPrompt.bn

  return (
    <Card className="border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Button size="icon" variant="outline" onClick={speakCurrent} className="shrink-0 mt-1 bg-transparent">
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-primary" />}
          </Button>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-lg leading-relaxed flex-1"
            >
              {text}
            </motion.p>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
