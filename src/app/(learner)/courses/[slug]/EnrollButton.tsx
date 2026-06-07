'use client'

import Link from 'next/link'
import { useProgressStore } from '@/store/progressStore'
import type { Course } from '@/types'

interface Props {
  course: Course
  firstLessonSlug: string
}

export default function EnrollButton({ course, firstLessonSlug }: Props) {
  const { isEnrolled, enroll } = useProgressStore()
  const enrolled = isEnrolled(course.id)

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
      onClick={() => enroll(course.id)}
      className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-600"
    >
      {course.price === 0 ? 'Enroll for free' : `Enroll — $${course.price}`}
    </button>
  )
}
