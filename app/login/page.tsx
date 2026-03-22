'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { password, redirect: false })
    if (res?.error) {
      setError('Invalid password')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm p-8 glass rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Ivan&apos;s portfolio dashboard</p>
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-border rounded-xl px-4 py-2.5 bg-background outline-none focus:ring-2 focus:ring-primary text-sm"
          required
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'oklch(0.55 0.22 275)' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  )
}
