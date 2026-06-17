'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

interface Props {
  courseId: string
  lessonId: string
}

export default function CompleteButton({ courseId, lessonId }: Props) {
  const { isAuthenticated, updateUser } = useAuthStore()
  const [isDone, setIsDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/enrollments')
      .then((res) => {
        const enrollments: { courseId: string; completedLessons: string[] }[] = res.data.data.enrollments
        const enrollment = enrollments.find((e) => e.courseId === courseId)
        setIsDone(!!enrollment?.completedLessons?.includes(lessonId))
      })
      .catch(() => {})
  }, [isAuthenticated, courseId, lessonId])

  const handleComplete = async () => {
    if (!isAuthenticated || isDone || loading) return
    setLoading(true)
    try {
      const res = await api.post(`/enrollments/${courseId}/complete-lesson`, { lessonId })
      setIsDone(true)
      if (res.data.data?.user) {
        updateUser({ xp: res.data.data.user.xp, streak: res.data.data.user.streak })
      }
    } catch {
      // Ignore errors
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <button
      onClick={handleComplete}
      disabled={isDone || loading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        isDone
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
          : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-50'
      }`}
    >
      {isDone ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </>
      ) : loading ? 'Saving...' : 'Mark complete'}
    </button>
  )
}
