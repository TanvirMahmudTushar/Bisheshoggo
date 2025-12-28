"use client"

import { useOffline } from "@/lib/hooks/use-offline"
import { WifiOff, Wifi } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineIndicator() {
  const isOffline = useOffline()

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>You are offline. Data will sync when connection is restored.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ConnectionStatus() {
  const isOffline = useOffline()

  return (
    <div className="flex items-center gap-2 text-xs">
      {isOffline ? (
        <>
          <WifiOff className="w-3 h-3 text-destructive" />
          <span className="text-muted-foreground">Offline</span>
        </>
      ) : (
        <>
          <Wifi className="w-3 h-3 text-emerald-500" />
          <span className="text-muted-foreground">Online</span>
        </>
      )}
    </div>
  )
}
