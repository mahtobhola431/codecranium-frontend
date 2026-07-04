'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProgressBar from '@/components/learner/ProgressBar'
import api from '@/lib/api'

interface CourseAnalytic {
  courseId: string
  title: string
  students: number
  completionRate: number
  rating: number
  reviewCount: number
  revenue: number
  price: number
  gradient: string
  totalLessons: number
}

interface StudentSample {
  name: string
  course: string
  progress: number
  joined: string
  xp: number
}

interface MonthlyPoint {
  month: string
  earnings: number
  students: number
}

function BarChart({ data, valueKey, color = 'bg-indigo-500' }: { data: MonthlyPoint[]; valueKey: 'students' | 'earnings'; color?: string }) {
  const max = Math.max(...data.map((d) => d[valueKey])) || 1
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-zinc-800 relative" style={{ height: '112px' }}>
            <div className={`absolute bottom-0 w-full rounded-t ${color}`} style={{ height: `${(d[valueKey] / max) * 112}px` }} />
          </div>
          <span className="text-xs text-zinc-700">{d.month.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function InstructorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CourseAnalytic[]>([])
  const [students, setStudents] = useState<StudentSample[]>([])
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/instructor/analytics'),
      api.get('/instructor/students'),
      api.get('/instructor/revenue'),
    ])
      .then(([analyticsRes, studentsRes, revenueRes]) => {
        setAnalytics(analyticsRes.data.data.analytics ?? [])
        setStudents(studentsRes.data.data.students ?? [])
        setMonthlyEarnings(revenueRes.data.data.monthlyEarnings ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-zinc-900 animate-pulse" />)}
      </div>
    )
  }

  const totalStudents = analytics.reduce((a, c) => a + c.students, 0)
  const totalReviews = analytics.reduce((a, c) => a + c.reviewCount, 0)
  const avgRating = analytics.length
    ? (analytics.reduce((a, c) => a + c.rating, 0) / analytics.length).toFixed(2)
    : '0.00'
  const avgCompletion = analytics.length
    ? Math.round(analytics.reduce((a, c) => a + c.completionRate, 0) / analytics.length)
    : 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Performance across all your courses</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Total students', value: totalStudents.toLocaleString(), sub: 'All time' },
          { label: 'Avg rating', value: `★ ${avgRating}`, sub: `${totalReviews.toLocaleString()} reviews` },
          { label: 'Avg completion', value: `${avgCompletion}%`, sub: 'Platform avg: 48%' },
          { label: 'Courses', value: String(analytics.length), sub: 'All published' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">{kpi.value}</p>
            <p className="mt-1 text-xs text-zinc-600">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {monthlyEarnings.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Monthly new students</h2>
          <BarChart data={monthlyEarnings} valueKey="students" color="bg-teal-500/80" />
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-5">Per-course performance</h2>
        <div className="space-y-5">
          {analytics.map((course) => (
            <div key={course.courseId}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient}`} />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{course.title}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-600 mt-0.5">
                      <span>{course.students.toLocaleString()} students</span>
                      <span>·</span>
                      <span>★ {course.rating.toFixed(1)} ({course.reviewCount.toLocaleString()})</span>
                      <span>·</span>
                      <span>{course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/instructor/courses/${course.courseId}`} className="text-xs text-indigo-400 hover:text-indigo-300">
                  Edit →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <ProgressBar value={course.completionRate} max={100} className="flex-1" showLabel />
                <span className="text-xs text-zinc-600 shrink-0 w-24 text-right">completion rate</span>
              </div>
            </div>
          ))}
          {analytics.length === 0 && (
            <p className="text-sm text-zinc-600 text-center py-8">No published courses yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-4">Recent student activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-2.5 text-left text-xs font-medium text-zinc-500">Student</th>
                <th className="pb-2.5 text-left text-xs font-medium text-zinc-500">Course</th>
                <th className="pb-2.5 text-right text-xs font-medium text-zinc-500">Progress</th>
                <th className="pb-2.5 text-right text-xs font-medium text-zinc-500">XP</th>
                <th className="pb-2.5 text-right text-xs font-medium text-zinc-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-zinc-800/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-300">
                        {s.name.charAt(0)}
                      </div>
                      <span className="text-xs text-zinc-300">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-zinc-500">{s.course}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1 w-20 rounded-full bg-zinc-800">
                        <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-8">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-xs text-indigo-400 font-mono">{s.xp.toLocaleString()}</td>
                  <td className="py-3 text-right text-xs text-zinc-600">{s.joined}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-zinc-600">No students yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
