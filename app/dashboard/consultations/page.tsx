"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/api/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Video, Loader2, Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function TelemedicinePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current && voiceEnabled) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (synthesisRef.current && !voiceEnabled) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startCall = () => {
    setIsCallActive(true);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm Dr. AI from Bisheshoggo Health. I'm here to help you with your medical concerns. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
    
    // Start video
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setMessages([]);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setIsDoctorSpeaking(true);

    // Make video loop while speaking
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.play();
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/ai/chat/simple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('bisheshoggo_token') || ''}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are Dr. AI, a compassionate and knowledgeable medical doctor providing telemedicine consultations for patients in Bangladesh's Hill Tracts and rural regions. Provide professional medical advice, ask relevant questions, and show empathy. If the condition is serious, recommend seeing a doctor in person. Keep responses concise but informative."
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: "user",
              content: input,
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from doctor");
      }

      const data = await response.json();

      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, I couldn't process that. Could you please repeat?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, doctorMessage]);
      
      // Speak the doctor's response
      if (voiceEnabled) {
        speakText(doctorMessage.content);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      if (voiceEnabled) {
        speakText(errorMessage.content);
      }
    } finally {
      setIsSending(false);
      setIsDoctorSpeaking(false);
      
      // Stop looping video after speaking
      if (videoRef.current) {
        videoRef.current.loop = false;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          Telemedicine - AI Doctor Consultation
        </h1>
        <p className="text-muted-foreground">
          Consult with Dr. AI for medical advice in real-time
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Section */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Dr. AI</span>
                {isCallActive && (
                  <span className="flex items-center gap-2 text-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] bg-slate-900">
                {isCallActive ? (
                  <>
                    <video
                      ref={videoRef}
                      src="/doctor.mp4"
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    {isDoctorSpeaking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: "300ms" }}></div>
                            </div>
                            <span>Dr. AI is speaking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <Video className="h-12 w-12" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Dr. AI</h3>
                      <p className="text-sm text-slate-300">
                        Medical Specialist
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Available 24/7
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-900 space-y-2">
                {!isCallActive ? (
                  <Button
                    onClick={startCall}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Start Consultation
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={endCall}
                      variant="destructive"
                      className="w-full"
                      size="lg"
                    >
                      <PhoneOff className="mr-2 h-5 w-5" />
                      End Consultation
                    </Button>
                    <Button
                      onClick={toggleVoice}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {voiceEnabled ? (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" />
                          Voice On
                        </>
                      ) : (
                        <>
                          <VolumeX className="mr-2 h-4 w-4" />
                          Voice Off
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {isCallActive && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm">Quick Tips:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Describe your symptoms clearly</li>
                  <li>• Mention duration and severity</li>
                  <li>• Share relevant medical history</li>
                  <li>• Ask about medications if needed</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Consultation Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">
              {!isCallActive ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Video className="h-16 w-16 mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Start a consultation to chat with Dr. AI</h3>
                  <p className="text-sm">Click "Start Consultation" to begin your telemedicine session</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === "assistant" && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                Dr
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isSending && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            Dr
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
            
            {isCallActive && (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe your symptoms or ask a question..."
                      className="min-h-[60px] resize-none flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending || isListening}
                    />
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isSending}
                      size="icon"
                      variant={isListening ? "destructive" : "outline"}
                      className="h-[60px] w-[60px] flex-shrink-0"
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? (
                        <MicOff className="h-5 w-5 animate-pulse" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isSending}
                    size="icon"
                    className="h-[60px] w-[60px] flex-shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {isListening && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                    <Mic className="h-3 w-3 animate-pulse text-red-500" />
                    Listening... Speak now
                  </p>
                )}
                {isSpeaking && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                    <Volume2 className="h-3 w-3 animate-pulse text-blue-500" />
                    Dr. AI is speaking...
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
