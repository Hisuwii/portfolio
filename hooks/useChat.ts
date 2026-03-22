'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types'

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load existing message history
  useEffect(() => {
    if (!sessionId) return

    const loadHistory = async () => {
      const res = await fetch(`/api/chat/history?session_id=${sessionId}`)
      const data = await res.json()
      setMessages(data.messages ?? [])
      setIsLoading(false)
    }

    loadHistory()
  }, [sessionId])

  // Subscribe to new messages via Supabase Realtime
  useEffect(() => {
    if (!sessionId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const fetchHistory = async () => {
    const res = await fetch(`/api/chat/history?session_id=${sessionId}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
  }

  const sendMessage = async (content: string) => {
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, content }),
    })
    // API awaits Gemini before returning, so AI reply is already in DB here
    await fetchHistory()
  }

  return { messages, isLoading, sendMessage }
}
