"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { VoiceSpeechRecognition } from "@/lib/voice/speech-recognition"
import { motion } from "framer-motion"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  language?: "en" | "bn"
  disabled?: boolean
}

export function VoiceInputButton({ onTranscript, language = "en", disabled = false }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<VoiceSpeechRecognition | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const voiceRecognition = new VoiceSpeechRecognition(language)
    setIsSupported(voiceRecognition.isSupported())
    setRecognition(voiceRecognition)

    return () => {
      voiceRecognition.stop()
    }
  }, [language])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start(
        (result) => {
          if (result.isFinal) {
            onTranscript(result.transcript)
            setIsListening(false)
          }
        },
        (error) => {
          console.error("[ ] Voice recognition error:", error)
          setIsListening(false)
        },
      )
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        size="icon"
        variant={isListening ? "default" : "outline"}
        onClick={toggleListening}
        disabled={disabled}
        className="relative"
      >
        {isListening ? (
          <>
            <motion.div
              className="absolute inset-0 rounded-md bg-primary/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
            <MicOff className="w-5 h-5 relative z-10" />
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>
    </motion.div>
  )
}
