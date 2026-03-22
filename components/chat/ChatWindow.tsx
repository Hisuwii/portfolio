'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useChat } from '@/hooks/useChat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

const SUGGESTIONS = [
  { label: '👤 Who is Ivan?', message: 'Who is Ivan?' },
  { label: '💼 I have a project', message: 'I have a project in mind.' },
  { label: '🛠️ What are your skills?', message: 'What are your skills?' },
  { label: '💰 How much do you charge?', message: 'How much do you charge?' },
  { label: '📅 Are you available?', message: 'Are you currently available for work?' },
  { label: '📬 How do I contact Ivan?', message: 'How can I contact Ivan directly?' },
]

interface ChatWindowProps {
  sessionId: string
  onClose: () => void
}

export default function ChatWindow({ sessionId, onClose }: ChatWindowProps) {
  const { messages, isLoading, sendMessage } = useChat(sessionId)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || sending) return
    setInput('')
    setSending(true)
    setIsTyping(true)
    await sendMessage(content)
    setTimeout(() => setIsTyping(false), 1500)
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = !isLoading && messages.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-background"
      style={{
        width: 'min(360px, calc(100vw - 32px))',
        height: 'min(560px, calc(100dvh - 100px))',
        boxShadow: '0 25px 60px oklch(0 0 0 / 0.12), 0 0 0 1px oklch(0 0 0 / 0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-border">
              <Image src="/images/pfp.png" alt="Ivan Jade Quilang" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card bg-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Ivan Jade Quilang</p>
            <p className="text-xs text-muted-foreground">Typically replies instantly</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center text-center gap-3 px-5 pt-6 pb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg bg-secondary">
              👋
            </div>
            <div>
              <p className="text-sm font-semibold">Hey! I&apos;m Ivan&apos;s assistant.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pick a question or type your own.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — 2 columns */}
      {!isLoading && !sending && (
        <div className="px-3 py-2 border-t border-border shrink-0">
          <div className="grid grid-cols-2 gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.message}
                onClick={() => handleSend(s.message)}
                disabled={sending}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary text-foreground transition-all hover:bg-accent hover:scale-105 active:scale-95 disabled:opacity-40 truncate"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border shrink-0 bg-card">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-border bg-secondary">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 min-w-0"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-foreground text-background transition-all disabled:opacity-30 hover:scale-105 shrink-0"
            aria-label="Send message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground/40 mt-1.5">Powered by AI when offline</p>
      </div>
    </motion.div>
  )
}
