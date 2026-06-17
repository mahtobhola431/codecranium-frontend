'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface InstructorUser {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
}

interface InstructorState {
  instructor: InstructorUser | null
  token: string | null
  isAuthenticated: boolean
  login: (instructor: InstructorUser, token: string) => void
  logout: () => void
}

// Dummy credentials: sarah@codecranium.com / sarah123
const DUMMY_INSTRUCTORS: Record<string, { password: string; user: InstructorUser }> = {
  'sarah@codecranium.com': {
    password: 'sarah123',
    user: {
      id: 'i1',
      name: 'Sarah Chen',
      email: 'sarah@codecranium.com',
      bio: 'Senior frontend engineer with 10+ years building production React apps at scale.',
      avatar: '',
    },
  },
  'marcus@codecranium.com': {
    password: 'marcus123',
    user: {
      id: 'i2',
      name: 'Marcus Webb',
      email: 'marcus@codecranium.com',
      bio: 'Systems programmer and open-source contributor. Loves Go, Rust, and distributed systems.',
      avatar: '',
    },
  },
}

export function validateInstructorLogin(email: string, password: string): InstructorUser | null {
  const entry = DUMMY_INSTRUCTORS[email]
  if (!entry || entry.password !== password) return null
  return entry.user
}

export const useInstructorStore = create<InstructorState>()(
  persist(
    (set) => ({
      instructor: null,
      token: null,
      isAuthenticated: false,
      login: (instructor, token) => {
        if (typeof window !== 'undefined') localStorage.setItem('cc-auth-token', token)
        set({ instructor, token, isAuthenticated: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('cc-auth-token')
        set({ instructor: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'cc-instructor' }
  )
)
