'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useInstructorStore } from '@/store/instructorStore'

const NAV = [
  { label: 'Dashboard', href: '/instructor', icon: '◉' },
  { label: 'My Courses', href: '/instructor/courses', icon: '📚' },
  { label: 'Analytics', href: '/instructor/analytics', icon: '📊' },
  { label: 'Revenue', href: '/instructor/revenue', icon: '💰' },
]

export default function InstructorSidebar() {
  const pathname = usePathname()
  const { instructor, logout } = useInstructorStore()

  const isActive = (href: string) =>
    href === '/instructor' ? pathname === '/instructor' : pathname.startsWith(href)

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-xs font-bold text-white">
            CC
          </span>
          <span className="text-sm font-semibold text-zinc-200">CodeCranium</span>
        </Link>
        <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400">
          Instructor
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive(item.href)
                    ? 'border-l-2 border-indigo-500 bg-indigo-500/10 pl-2.5 text-indigo-300 font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-zinc-800 pt-4 space-y-1">
          <Link
            href="/instructor/courses/new"
            className="flex items-center gap-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2.5 text-sm text-indigo-300 hover:bg-indigo-500/20 transition font-medium"
          >
            <span>+</span> New Course
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition"
          >
            <span>↗</span> View learner site
          </Link>
        </div>
      </nav>

      <div className="border-t border-zinc-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
            {instructor?.name.charAt(0) ?? 'I'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-300">{instructor?.name}</p>
            <p className="truncate text-xs text-zinc-600">Instructor</p>
          </div>
          <button onClick={logout} title="Sign out" className="text-zinc-600 hover:text-zinc-300 transition">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
