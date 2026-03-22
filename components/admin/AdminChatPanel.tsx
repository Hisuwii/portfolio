'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types'

interface Session {
  session_id: string
  last_message: string
  last_time: string
}

export default function AdminChatPanel() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState<Set<string>>(new Set())
  const activeSessionRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadSessions = async () => {
    const res = await fetch('/api/admin/sessions')
    const data = await res.json()
    const newSessions: Session[] = data.sessions ?? []

    // Mark sessions with new activity as unread (except the active one)
    setSessions((prev) => {
      const prevMap = new Map(prev.map((s) => [s.session_id, s.last_time]))
      const newUnread = new Set<string>()
      for (const s of newSessions) {
        const prevTime = prevMap.get(s.session_id)
        if (prevTime && s.last_time > prevTime && s.session_id !== activeSessionRef.current) {
          newUnread.add(s.session_id)
        }
      }
      if (newUnread.size > 0) {
        setUnread((u) => new Set([...u, ...newUnread]))
      }
      return newSessions
    })
  }

  const loadMessages = async (sessionId: string) => {
    const res = await fetch(`/api/chat/history?session_id=${sessionId}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
  }

  // Load sessions on mount + poll every 10s
  useEffect(() => {
    loadSessions()
    const interval = setInterval(loadSessions, 10000)
    return () => clearInterval(interval)
  }, [])

  // Auto-select first session
  useEffect(() => {
    if (sessions.length && !activeSession) {
      const first = sessions[0].session_id
      setActiveSession(first)
      activeSessionRef.current = first
    }
  }, [sessions])

  // Load messages when active session changes
  useEffect(() => {
    if (activeSession) loadMessages(activeSession)
  }, [activeSession])

  // Realtime subscription
  useEffect(() => {
    if (!activeSession) return
    const supabase = createClient()
    const channel = supabase
      .channel(`admin-${activeSession}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${activeSession}`,
      }, (payload) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.new.id)) return prev
          return [...prev, payload.new as Message]
        })
        loadSessions()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeSession])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!reply.trim() || !activeSession || sending) return
    setSending(true)
    await fetch('/api/admin/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: activeSession, content: reply.trim() }),
    })
    setReply('')
    await loadMessages(activeSession)
    setSending(false)
  }

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const shortId = (id: string) => id.slice(0, 8)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-border flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold">Conversations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
          </div>
          {unread.size > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-red-500">
              {unread.size}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6 py-12">
              <span className="text-3xl">💬</span>
              <p className="text-sm text-muted-foreground">No conversations yet. Share your portfolio!</p>
            </div>
          ) : sessions.map((s) => (
            <button
              key={s.session_id}
              onClick={() => {
                setActiveSession(s.session_id)
                activeSessionRef.current = s.session_id
                setUnread((u) => { const next = new Set(u); next.delete(s.session_id); return next })
              }}
              className={`w-full text-left px-5 py-4 border-b border-border transition-colors hover:bg-accent ${activeSession === s.session_id ? 'bg-accent' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {unread.has(s.session_id) && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  )}
                  <span className="text-xs font-mono text-muted-foreground">#{shortId(s.session_id)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(s.last_time)}</span>
              </div>
              <p className={`text-sm truncate ${unread.has(s.session_id) ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                {s.last_message}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base">Ivan&apos;s Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {activeSession ? `Session #${shortId(activeSession)}` : 'Select a conversation'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'oklch(0.45 0.22 275)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {!activeSession ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-4xl">👈</span>
              <p className="text-sm text-muted-foreground">Select a conversation</p>
            </div>
          ) : messages.map((m) => {
            const isOwner = m.role === 'owner'
            const isAI = m.role === 'ai'
            return (
              <div key={m.id} className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 mb-1 ${isOwner ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-medium text-muted-foreground">
                    {isOwner ? 'You' : isAI ? 'AI Assistant' : 'Client'}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTime(m.created_at)}</span>
                </div>
                <div
                  className="max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={isOwner
                    ? { backgroundColor: 'oklch(0.55 0.22 275)', color: 'white' }
                    : isAI
                    ? { backgroundColor: 'oklch(0.92 0.04 275)', border: '1px solid oklch(0.85 0.05 275)' }
                    : { backgroundColor: 'oklch(0.96 0.01 275)', border: '1px solid oklch(0.88 0.02 275)' }
                  }
                >
                  {m.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply input */}
        {activeSession && (
          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend() } }}
                placeholder="Reply as Ivan..."
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: 'oklch(0.55 0.22 275)' }}
              >
                {sending ? '...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send · AI replies automatically when you&apos;re offline
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
