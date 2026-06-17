'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface MonthlyPoint {
  month: string
  revenue: number
  students: number
}

interface AdminCourse {
  id: string
  title: string
  students: number
  status: string
  gradient: string
}

interface PlatformStats {
  totalStudents: number
  totalRevenue: number
  publishedCourses: number
  newSignupsThisMonth: number
  activeSubscriptions: number
  avgRating: number
}

function BarChart({ data, valueKey, color = 'bg-indigo-500' }: {
  data: MonthlyPoint[]
  valueKey: 'revenue' | 'students'
  color?: string
}) {
  const max = Math.max(...data.map((d) => d[valueKey])) || 1
  return (
    <div className="flex items-end gap-1 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-zinc-800 relative" style={{ height: '120px' }}>
            <div
              className={`absolute bottom-0 w-full rounded-t ${color} transition-all`}
              style={{ height: `${(d[valueKey] / max) * 120}px` }}
            />
          </div>
          <span className="text-xs text-zinc-700">{d.month.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [metric, setMetric] = useState<'revenue' | 'students'>('revenue')
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics/revenue'),
      api.get('/admin/courses'),
      api.get('/admin/stats'),
    ])
      .then(([revenueRes, coursesRes, statsRes]) => {
        setMonthly(revenueRes.data.data.monthly ?? [])
        setCourses(coursesRes.data.data.courses ?? [])
        setStats(statsRes.data.data.stats ?? null)
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

  const totalRevenue = monthly.reduce((a, b) => a + b.revenue, 0)
  const totalStudentsThisYear = monthly.reduce((a, b) => a + b.students, 0)
  const avgMonthlyRevenue = Math.round(totalRevenue / (monthly.length || 1))

  const topCourses = [...courses]
    .filter((c) => c.status === 'published')
    .sort((a, b) => b.students - a.students)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Platform performance — last 12 months</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Total revenue (12 mo)', value: `$${(totalRevenue / 1000).toFixed(1)}k`, delta: '' },
          { label: 'New students (12 mo)', value: totalStudentsThisYear.toLocaleString(), delta: '' },
          { label: 'Avg monthly revenue', value: `$${avgMonthlyRevenue.toLocaleString()}`, delta: '' },
          { label: 'Active subscriptions', value: (stats?.activeSubscriptions ?? 0).toLocaleString(), delta: '' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">{kpi.value}</p>
            {kpi.delta && <p className="mt-1 text-xs text-green-400">{kpi.delta} YoY</p>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-zinc-200">Monthly trend</h2>
          <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setMetric('revenue')}
              className={`px-3 py-1.5 text-xs transition ${metric === 'revenue' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Revenue
            </button>
            <button
              onClick={() => setMetric('students')}
              className={`px-3 py-1.5 text-xs transition ${metric === 'students' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Students
            </button>
          </div>
        </div>

        {monthly.length > 0 && (
          <>
            <BarChart
              data={monthly}
              valueKey={metric}
              color={metric === 'revenue' ? 'bg-indigo-500/80' : 'bg-teal-500/80'}
            />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-zinc-500">
                <tbody>
                  <tr>
                    {monthly.map((m) => (
                      <td key={m.month} className="text-center py-1 px-1 whitespace-nowrap">
                        {metric === 'revenue' ? `$${(m.revenue / 1000).toFixed(1)}k` : m.students}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Top courses by enrollment</h2>
          <ul className="space-y-3">
            {topCourses.map((course, idx) => (
              <li key={course.id} className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 font-mono w-4 shrink-0">{idx + 1}</span>
                <div className={`h-7 w-7 shrink-0 rounded-md bg-gradient-to-br ${course.gradient}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{course.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1 flex-1 rounded bg-zinc-800">
                      <div
                        className="h-1 rounded bg-indigo-500"
                        style={{ width: `${topCourses[0].students > 0 ? (course.students / topCourses[0].students) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">{course.students.toLocaleString()}</span>
                  </div>
                </div>
              </li>
            ))}
            {topCourses.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">No published courses</p>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Platform summary</h2>
          <div className="space-y-3">
            {[
              { label: 'Total learners', value: (stats?.totalStudents ?? 0).toLocaleString() },
              { label: 'Published courses', value: (stats?.publishedCourses ?? 0).toLocaleString() },
              { label: 'New signups this month', value: (stats?.newSignupsThisMonth ?? 0).toLocaleString() },
              { label: 'Avg course rating', value: stats?.avgRating ? `★ ${stats.avgRating}` : '—' },
              { label: 'Total platform revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                <span className="text-xs text-zinc-500">{row.label}</span>
                <span className="text-xs font-medium text-zinc-200">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
