'use client'

import { useEffect } from 'react'

// Pings /api/presence/heartbeat every 60s to keep owner marked as online
export default function PresenceHeartbeat() {
  useEffect(() => {
    const ping = () => fetch('/api/presence/heartbeat', { method: 'POST' })
    ping()
    const interval = setInterval(ping, 60_000)
    return () => clearInterval(interval)
  }, [])

  return null
}
