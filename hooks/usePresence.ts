'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePresence() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('owner-presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'owner_presence',
          filter: 'id=eq.1',
        },
        (payload) => {
          const lastSeen = new Date(payload.new.last_seen).getTime()
          const timeout = 120000
          setIsOnline(Date.now() - lastSeen < timeout)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { isOnline }
}
