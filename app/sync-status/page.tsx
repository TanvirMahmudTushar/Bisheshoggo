"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Wifi, WifiOff, CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { syncManager, type SyncStatus } from "@/lib/offline/sync-manager"
import { offlineStorage } from "@/lib/offline/storage"
import { motion } from "framer-motion"

export default function SyncStatusPage() {
  const [language, setLanguage] = useState<"en" | "bn">("en")
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: false,
    lastSyncTime: null,
    pendingItems: 0,
    syncing: false,
  })

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((status) => {
      setSyncStatus(status)
    })

    // Start auto-sync
    syncManager.startAutoSync(30000) // Every 30 seconds

    return () => {
      unsubscribe()
      syncManager.stopAutoSync()
    }
  }, [])

  const handleManualSync = () => {
    syncManager.syncNow()
  }

  const pendingData = offlineStorage.getUnsyncedItems()

  return (
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
            <h1 className="text-2xl md:text-3xl font-bold">{language === "en" ? "Sync Status" : "সিঙ্ক স্ট্যাটাস"}</h1>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Manage offline data synchronization" : "অফলাইন ডেটা সিঙ্ক্রোনাইজেশন পরিচালনা করুন"}
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

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {syncStatus.isOnline ? (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-emerald-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <WifiOff className="w-6 h-6 text-orange-500" />
                  </div>
                )}
                <div>
                  <CardTitle>{language === "en" ? "Connection Status" : "সংযোগ স্ট্যাটাস"}</CardTitle>
                  <CardDescription>
                    {syncStatus.isOnline
                      ? language === "en"
                        ? "Connected to internet"
                        : "ইন্টারনেটের সাথে সংযুক্ত"
                      : language === "en"
                        ? "Working offline"
                        : "অফলাইনে কাজ করছে"}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={syncStatus.isOnline ? "default" : "secondary"} className="text-base px-4 py-2">
                {syncStatus.isOnline
                  ? language === "en"
                    ? "Online"
                    : "অনলাইন"
                  : language === "en"
                    ? "Offline"
                    : "অফলাইন"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Synchronization" : "সিঙ্ক্রোনাইজেশন"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your data is automatically synced when online"
                : "অনলাইন থাকলে আপনার ডেটা স্বয়ংক্রিয়ভাবে সিঙ্ক হয়"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {syncStatus.syncing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{language === "en" ? "Syncing..." : "সিঙ্ক হচ্ছে..."}</span>
                  <span className="font-medium">{syncStatus.pendingItems} items</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{language === "en" ? "Pending" : "অপেক্ষমাণ"}</span>
                </div>
                <p className="text-2xl font-bold">{syncStatus.pendingItems}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === "en" ? "Synced" : "সিঙ্ক হয়েছে"}</span>
                </div>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>{language === "en" ? "Last Sync" : "শেষ সিঙ্ক"}</span>
                </div>
                <p className="text-sm font-medium">
                  {syncStatus.lastSyncTime
                    ? new Date(syncStatus.lastSyncTime).toLocaleString()
                    : language === "en"
                      ? "Never"
                      : "কখনও না"}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleManualSync}
              disabled={!syncStatus.isOnline || syncStatus.syncing}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${syncStatus.syncing ? "animate-spin" : ""}`} />
              {language === "en" ? "Sync Now" : "এখনই সিঙ্ক করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Pending Data */}
        {pendingData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Pending Data" : "অপেক্ষমাণ ডেটা"}</CardTitle>
              <CardDescription>
                {language === "en" ? "This data will be synced when you're online" : "আপনি অনলাইনে থাকলে এই ডেটা সিঙ্ক হবে"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingData.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm font-medium">{item.key}</span>
                    <Badge variant="secondary">{language === "en" ? "Pending" : "অপেক্ষমাণ"}</Badge>
                  </motion.div>
                ))}
                {pendingData.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    {language === "en"
                      ? `+${pendingData.length - 5} more items`
                      : `+${pendingData.length - 5} আরও আইটেম`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
