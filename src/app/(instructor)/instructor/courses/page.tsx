'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProgressBar from '@/components/learner/ProgressBar'
import api from '@/lib/api'

interface InstructorCourse {
  id: string
  slug: string
  title: string
  rating: number
  reviewCount: number
  price: number
  students: number
  completionRate?: number
  status: string
  gradient: string
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<InstructorCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/instructor/courses')
      .then((res) => setCourses(res.data.data.courses ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-50">My Courses</h1>
          </div>
          <Link
            href="/instructor/courses/new"
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            + New course
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">My Courses</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{courses.length} courses</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          + New course
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center`}>
              <span className="text-5xl font-mono font-bold text-white/10 select-none">CC</span>
              <span className={`absolute top-3 right-3 rounded-full border px-2 py-0.5 text-xs capitalize ${
                course.status === 'published'
                  ? 'border-green-500/30 bg-green-500/20 text-green-400'
                  : 'border-amber-500/30 bg-amber-500/20 text-amber-400'
              }`}>
                {course.status}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-zinc-50 leading-snug">{course.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                  <span>★ {course.rating.toFixed(1)}</span>
                  <span>({course.reviewCount.toLocaleString()} reviews)</span>
                  <span>·</span>
                  <span>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                </div>
              </div>

              {course.completionRate != null && (
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Completion rate</span>
                    <span>{course.completionRate}%</span>
                  </div>
                  <ProgressBar value={course.completionRate} max={100} />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div className="text-xs text-zinc-500">
                  <span className="text-indigo-400 font-semibold">{course.students.toLocaleString()}</span> students
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/instructor/courses/${course.id}`}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* New course placeholder */}
        <Link
          href="/instructor/courses/new"
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 text-center transition hover:border-zinc-600 hover:bg-zinc-900"
        >
          <span className="text-4xl mb-3 text-zinc-700">+</span>
          <p className="text-sm font-medium text-zinc-500">Create a new course</p>
          <p className="text-xs text-zinc-700 mt-1">Share your expertise</p>
        </Link>
      </div>
    </div>
  )
}
