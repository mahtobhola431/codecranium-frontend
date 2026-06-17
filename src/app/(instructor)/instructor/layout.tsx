'use client'

import { useState } from 'react'
import { useInstructorStore } from '@/store/instructorStore'
import InstructorSidebar from '@/components/instructor/InstructorSidebar'
import api from '@/lib/api'

function InstructorLoginGate() {
  const { login } = useInstructorStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { user, token } = data.data
      if (user.role !== 'instructor' && user.role !== 'admin') {
        setError('This account does not have instructor access.')
        return
      }
      login({ id: user.id, name: user.name, email: user.email, bio: user.bio ?? '', avatar: user.avatar ?? '' }, token)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-2xl">
            🎓
          </div>
          <h1 className="text-xl font-bold text-zinc-50">Instructor Portal</h1>
          <p className="mt-1 text-sm text-zinc-500">CodeCranium</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
          <div className="mb-5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-xs font-semibold text-amber-400 mb-1">Demo credentials</p>
            <p className="text-xs text-zinc-500 font-mono">sarah@codecranium.com</p>
            <p className="text-xs text-zinc-500 font-mono">sarah123</p>
            <p className="text-xs text-zinc-600 mt-1 font-mono">marcus@codecranium.com / marcus123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sarah@codecranium.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, logout } = useInstructorStore()

  // If persisted session has no token (stale store from before token field was added), force re-login
  if (typeof window !== 'undefined' && isAuthenticated && !token) {
    logout()
  }

  if (!isAuthenticated) return <InstructorLoginGate />

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <InstructorSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
