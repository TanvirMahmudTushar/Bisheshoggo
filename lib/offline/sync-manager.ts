"use client"

import { offlineStorage } from "./storage"

export interface SyncStatus {
  isOnline: boolean
  lastSyncTime: number | null
  pendingItems: number
  syncing: boolean
}

class SyncManager {
  private syncCallbacks: Array<(status: SyncStatus) => void> = []
  private syncInterval: NodeJS.Timeout | null = null
  private isOnline = true
  private syncing = false

  constructor() {
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
    }
  }

  private handleOnline() {
    console.log("[ ] Device is online, initiating sync")
    this.isOnline = true
    this.notifyListeners()
    this.syncNow()
  }

  private handleOffline() {
    console.log("[ ] Device is offline")
    this.isOnline = false
    this.notifyListeners()
  }

  subscribe(callback: (status: SyncStatus) => void) {
    this.syncCallbacks.push(callback)
    callback(this.getStatus())
    return () => {
      this.syncCallbacks = this.syncCallbacks.filter((cb) => cb !== callback)
    }
  }

  private notifyListeners() {
    const status = this.getStatus()
    this.syncCallbacks.forEach((cb) => cb(status))
  }

  getStatus(): SyncStatus {
    const unsynced = offlineStorage.getUnsyncedItems()
    const lastSync = offlineStorage.get("last_sync_time")

    return {
      isOnline: this.isOnline,
      lastSyncTime: lastSync,
      pendingItems: unsynced.length,
      syncing: this.syncing,
    }
  }

  async syncNow(): Promise<void> {
    if (!this.isOnline || this.syncing) return

    this.syncing = true
    this.notifyListeners()

    try {
      const unsyncedItems = offlineStorage.getUnsyncedItems()
      console.log(`[ ] Syncing ${unsyncedItems.length} items`)

      for (const item of unsyncedItems) {
        try {
          await this.syncItem(item.key, item.data)
          offlineStorage.markAsSynced(item.key)
        } catch (error) {
          console.error(`[ ] Failed to sync item ${item.key}:`, error)
        }
      }

      offlineStorage.set("last_sync_time", Date.now(), true)
    } finally {
      this.syncing = false
      this.notifyListeners()
    }
  }

  private async syncItem(key: string, data: any): Promise<void> {
    if (!data.type) return

    console.log(`[ ] Syncing ${data.type}:`, key)

    try {
      if (data.type === "symptom_check") {
        const response = await fetch("/api/symptom-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.data),
        })

        if (!response.ok) throw new Error("Failed to sync symptom check")
      } else if (data.type === "emergency") {
        const response = await fetch("/api/emergency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.data),
        })

        if (!response.ok) throw new Error("Failed to sync emergency")
      } else if (data.type === "consultation") {
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.data),
        })

        if (!response.ok) throw new Error("Failed to sync consultation")
      }

      console.log(`[ ] Successfully synced ${data.type}`)
    } catch (error) {
      console.error(`[ ] Sync failed for ${key}:`, error)
      throw error
    }
  }

  startAutoSync(intervalMs = 30000) {
    this.stopAutoSync()
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncNow()
      }
    }, intervalMs)
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}

export const syncManager = new SyncManager()
