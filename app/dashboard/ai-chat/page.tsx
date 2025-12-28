import { Suspense } from "react"
import { AIChatContent } from "@/components/ai-chat/ai-chat-content"

export default function AIChatPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-semibold">AI Medical Assistant</h1>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <AIChatContent />
      </Suspense>
    </div>
  )
}
