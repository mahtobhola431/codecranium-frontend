'use client'

import Link from 'next/link'
import { useInstructorStore } from '@/store/instructorStore'
import {
  INSTRUCTOR_PROFILE,
  INSTRUCTOR_COURSE_ANALYTICS,
  INSTRUCTOR_MONTHLY_EARNINGS,
  INSTRUCTOR_STUDENTS_SAMPLE,
} from '@/lib/adminMockData'
import ProgressBar from '@/components/learner/ProgressBar'

export default function InstructorDashboard() {
  const { instructor } = useInstructorStore()
  const name = instructor?.name ?? INSTRUCTOR_PROFILE.name

  const thisMonth = INSTRUCTOR_MONTHLY_EARNINGS[INSTRUCTOR_MONTHLY_EARNINGS.length - 1]
  const lastMonth = INSTRUCTOR_MONTHLY_EARNINGS[INSTRUCTOR_MONTHLY_EARNINGS.length - 2]
  const growth = Math.round(((thisMonth.earnings - lastMonth.earnings) / lastMonth.earnings) * 100)

  const totalStudents = INSTRUCTOR_COURSE_ANALYTICS.reduce((a, c) => a + c.students, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Hey, {name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Here's how your courses are performing</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          + New course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total students</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">{totalStudents.toLocaleString()}</p>
          <p className="mt-1 text-xs text-green-400">+{thisMonth.students} this month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">This month earnings</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">${thisMonth.earnings.toLocaleString()}</p>
          <p className="mt-1 text-xs text-green-400">+{growth}% vs last month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Avg rating</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">★ {INSTRUCTOR_PROFILE.avgRating}</p>
          <p className="mt-1 text-xs text-zinc-600">Across all courses</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Courses</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">{INSTRUCTOR_COURSE_ANALYTICS.length}</p>
          <p className="mt-1 text-xs text-indigo-400">
            <Link href="/instructor/courses/new" className="hover:underline">+ Add new →</Link>
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Course performance */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-zinc-200">Course performance</h2>
            <Link href="/instructor/analytics" className="text-xs text-indigo-400 hover:text-indigo-300">
              Full analytics →
            </Link>
          </div>
          <div className="space-y-4">
            {INSTRUCTOR_COURSE_ANALYTICS.map((course) => (
              <div key={course.courseId} className="flex items-center gap-4">
                <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center text-xs font-bold text-white/30`}>
                  CC
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-zinc-300 truncate">{course.title}</p>
                    <span className="text-xs text-zinc-500 shrink-0 ml-2">{course.completionRate}% completion</span>
                  </div>
                  <ProgressBar value={course.completionRate} max={100} />
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600">
                    <span>{course.students.toLocaleString()} students</span>
                    <span>·</span>
                    <span>★ {course.rating}</span>
                    <span>·</span>
                    <span>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                  </div>
                </div>
                <Link
                  href={`/instructor/courses/${course.courseId}`}
                  className="shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent students */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Recent students</h2>
          <ul className="space-y-3">
            {INSTRUCTOR_STUDENTS_SAMPLE.slice(0, 5).map((s, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-300">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{s.name}</p>
                  <p className="text-xs text-zinc-600 truncate">{s.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-400">{s.progress}%</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/instructor/analytics" className="mt-4 block text-xs text-indigo-400 hover:text-indigo-300 text-center">
            View all students →
          </Link>
        </div>
      </div>
    </div>
  )
}
