'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { formatDuration } from '@/lib/mockData'
import ProgressBar from '@/components/learner/ProgressBar'
import api from '@/lib/api'
import type { Course } from '@/types'

interface EnrollmentWithCourse {
  courseId: string
  progress: number
  completedLessons: string[]
  lastLessonSlug: string
  course: Course & { lessonCount: number }
}

interface DashboardData {
  stats: { totalXp: number; streak: number; enrolledCount: number; completedCount: number }
  enrollments: EnrollmentWithCourse[]
}

const MOCK_ACHIEVEMENTS = [
  { icon: '🔥', title: '7-day streak', desc: 'Learn 7 days in a row' },
  { icon: '⚡', title: 'First challenge', desc: 'Complete your first code challenge' },
  { icon: '🏆', title: 'Course complete', desc: 'Finish an entire course' },
  { icon: '💯', title: 'Perfect quiz', desc: 'Get 100% on a quiz' },
]

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return }
    api.get('/users/me/dashboard')
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-2xl">🔒</p>
        <h1 className="text-xl font-semibold text-zinc-50">Sign in to access your dashboard</h1>
        <p className="text-zinc-500 text-sm">Track your progress, view achievements, and pick up where you left off.</p>
        <Link href="/auth/login" className="mt-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition">
          Sign in
        </Link>
      </div>
    )
  }

  const displayName = user?.name ?? 'there'
  const xp = data?.stats.totalXp ?? user?.xp ?? 0
  const streak = data?.stats.streak ?? user?.streak ?? 0
  const xpToNext = 2000
  const enrollments = data?.enrollments ?? []
  const completedCount = data?.stats.completedCount ?? 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Welcome back, {displayName} 👋</h1>
          <p className="mt-1 text-zinc-500 text-sm">Keep going — consistency beats intensity every time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center">
            <div className="text-xl font-bold text-amber-400">🔥 {streak}</div>
            <div className="text-xs text-zinc-500 mt-0.5">day streak</div>
          </div>
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-center">
            <div className="text-xl font-bold text-indigo-400">{xp.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-0.5">XP earned</div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-300">Level progress</span>
          <span className="text-xs text-zinc-500">{xp} / {xpToNext} XP</span>
        </div>
        <ProgressBar value={xp} max={xpToNext} showLabel />
        <p className="mt-2 text-xs text-zinc-600">{Math.max(0, xpToNext - xp)} XP to next level</p>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-zinc-50">Your courses</h2>
          <Link href="/courses" className="text-sm text-indigo-400 hover:text-indigo-300">
            Browse more →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <p className="text-3xl mb-3">📚</p>
            <p className="text-zinc-400 font-medium">No courses yet</p>
            <p className="mt-1 text-sm text-zinc-600">Enroll in a course to start tracking your progress</p>
            <Link href="/courses" className="mt-4 inline-block rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => {
              const course = enrollment.course
              const completed = enrollment.completedLessons?.length ?? 0
              const total = course.lessonCount
              return (
                <Link
                  key={enrollment.courseId}
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700"
                >
                  <div className={`h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center text-sm font-bold text-white/30`}>
                    CC
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{course.title}</p>
                    <ProgressBar value={completed} max={total} showLabel className="mt-2" />
                    <p className="mt-1 text-xs text-zinc-600">{completed}/{total} lessons</p>
                  </div>
                  <div className="text-xs text-zinc-600 shrink-0">
                    {formatDuration(course.duration)}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-50 mb-5">Achievements</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_ACHIEVEMENTS.map((a, i) => {
            const unlocked = (i === 0 && streak >= 7) || (i === 1 && xp > 0) || (i === 2 && completedCount > 0)
            return (
              <div
                key={a.title}
                className={`rounded-xl border p-4 ${
                  unlocked
                    ? 'border-indigo-500/30 bg-indigo-500/5'
                    : 'border-zinc-800 bg-zinc-900 opacity-50'
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <p className={`mt-2 text-sm font-semibold ${unlocked ? 'text-zinc-200' : 'text-zinc-500'}`}>{a.title}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{a.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
