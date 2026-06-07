'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
}

interface AdminState {
  admin: AdminUser | null
  isAuthenticated: boolean
  login: (admin: AdminUser) => void
  logout: () => void
}

// Dummy credentials: admin@codecranium.com / admin123
const DUMMY_ADMINS: Record<string, { password: string; user: AdminUser }> = {
  'admin@codecranium.com': {
    password: 'admin123',
    user: { id: 'a1', name: 'Admin', email: 'admin@codecranium.com', role: 'super_admin' },
  },
}

export function validateAdminLogin(email: string, password: string): AdminUser | null {
  const entry = DUMMY_ADMINS[email]
  if (!entry || entry.password !== password) return null
  return entry.user
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      login: (admin) => set({ admin, isAuthenticated: true }),
      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    { name: 'cc-admin' }
  )
)
