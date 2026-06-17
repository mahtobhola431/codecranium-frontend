'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import type { Course } from '@/types'
import api from '@/lib/api'

interface Props {
  course: Course
  firstLessonSlug: string
}

export default function EnrollButton({ course, firstLessonSlug }: Props) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/enrollments')
      .then((res) => {
        const enrollments: { courseId: string }[] = res.data.data.enrollments
        setEnrolled(enrollments.some((e) => e.courseId === course.id))
      })
      .catch(() => {})
  }, [isAuthenticated, course.id])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    setLoading(true)
    try {
      await api.post('/enrollments', { courseId: course.id })
      setEnrolled(true)
    } catch {
      // Already enrolled or error — redirect anyway
      setEnrolled(true)
    } finally {
      setLoading(false)
    }
  }

  if (enrolled) {
    return (
      <Link
        href={`/courses/${course.slug}/lessons/${firstLessonSlug}`}
        className="block w-full rounded-xl bg-indigo-500 py-3 text-center font-semibold text-white transition hover:bg-indigo-600"
      >
        Continue learning →
      </Link>
    )
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
    >
      {loading ? 'Enrolling...' : course.price === 0 ? 'Enroll for free' : `Enroll — $${course.price}`}
    </button>
  )
}
