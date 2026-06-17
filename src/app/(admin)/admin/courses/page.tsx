'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

type CourseStatus = 'published' | 'draft' | 'archived'

interface AdminCourse {
  id: string
  title: string
  instructor: string
  students: number
  revenue: number
  rating: number
  status: CourseStatus
  lastUpdated: string
  gradient: string
}

const STATUS_STYLES: Record<CourseStatus, string> = {
  published: 'bg-green-500/15 text-green-400 border-green-500/30',
  draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  archived: 'bg-zinc-700/50 text-zinc-500 border-zinc-700',
}

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    api.get('/admin/courses', { params: { _t: refreshKey } })
      .then((res) => setCourses(res.data.data.courses ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshKey])

  const filtered = courses.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleStatus = async (id: string, current: CourseStatus) => {
    const newStatus: CourseStatus = current === 'published' ? 'draft' : 'published'
    try {
      await api.patch(`/instructor/courses/${id}/status`, { status: newStatus })
      setCourses((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Courses</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{courses.length} total courses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-40"
            title="Refresh"
          >
            ↻
          </button>
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            + New course
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or instructors..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                statusFilter === s
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-600 animate-pulse">Loading courses...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Instructor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Students</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Rating</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Updated</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient}`} />
                        <span className="font-medium text-zinc-200 truncate max-w-[180px]">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400 text-xs">{course.instructor}</td>
                    <td className="px-4 py-3.5 text-right text-zinc-400">{course.students.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      {course.revenue === 0
                        ? <span className="text-green-400 text-xs">Free</span>
                        : <span className="text-zinc-400">${course.revenue.toLocaleString()}</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 text-right text-amber-400 text-xs">
                      {course.rating > 0 ? `★ ${course.rating}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[course.status]}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-zinc-600">{course.lastUpdated}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => toggleStatus(course.id, course.status)}
                          className={`rounded px-2 py-1 text-xs transition ${
                            course.status === 'published'
                              ? 'text-amber-400 hover:bg-amber-500/10'
                              : 'text-green-400 hover:bg-green-500/10'
                          }`}
                        >
                          {course.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-zinc-600">No courses match your filters</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
