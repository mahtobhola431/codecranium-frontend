'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

const NAV_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Learning Paths', href: '/learning-paths' },

]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
            CC
          </span>
          <span className="hidden sm:inline">CodeCranium</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="hidden rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 sm:flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden lg:inline">Search courses...</span>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-50 hidden sm:block">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden text-sm text-zinc-400 transition hover:text-zinc-50 sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
              >
                Get started
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-zinc-400 hover:text-zinc-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-zinc-800 pt-3">
              <Link href="/search" className="block text-sm text-zinc-400 hover:text-zinc-50" onClick={() => setMenuOpen(false)}>
                Search courses
              </Link>
            </li>
            {!isAuthenticated && (
              <li>
                <Link href="/auth/login" className="block text-sm text-zinc-400 hover:text-zinc-50" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
