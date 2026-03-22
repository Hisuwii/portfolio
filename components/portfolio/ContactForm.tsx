'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm text-muted-foreground">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-muted-foreground">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-muted-foreground">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/50"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        style={{
          backgroundColor: 'oklch(0.62 0.22 275)',
          boxShadow: '0 0 20px oklch(0.62 0.22 275 / 0.3)',
        }}
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
        {status !== 'loading' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>

      {status === 'success' && (
        <p className="text-sm" style={{ color: 'oklch(0.75 0.18 175)' }}>
          Message sent! I'll get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-destructive">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
