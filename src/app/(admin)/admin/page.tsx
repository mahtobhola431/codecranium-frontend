'use client'

import Link from 'next/link'
import {
  PLATFORM_STATS,
  MONTHLY_REVENUE,
  ACTIVITY_FEED,
  ADMIN_COURSES,
} from '@/lib/adminMockData'

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className={`rounded-xl border ${color} p-5`}>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
    </div>
  )
}

function BarChart({ data, valueKey, labelKey }: { data: Record<string, unknown>[]; valueKey: string; labelKey: string }) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])))
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d) => (
        <div key={String(d[labelKey])} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-zinc-800 relative" style={{ height: '112px' }}>
            <div
              className="absolute bottom-0 w-full rounded-t bg-indigo-500/80 transition-all"
              style={{ height: `${(Number(d[valueKey]) / max) * 112}px` }}
            />
          </div>
          <span className="text-xs text-zinc-700 leading-none">{String(d[labelKey]).slice(0, 3)}</span>
        </div>
      ))}
    </div>
  )
}

const ACTIVITY_ICONS: Record<string, string> = {
  signup: '👤',
  upgrade: '⬆️',
  complete: '🏆',
  enroll: '📚',
  flag: '🚩',
}

export default function AdminDashboard() {
  const publishedCourses = ADMIN_COURSES.filter((c) => c.status === 'published')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Platform Overview</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Last updated: June 7, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={PLATFORM_STATS.totalStudents.toLocaleString()}
          sub={`+${PLATFORM_STATS.newSignupsThisMonth.toLocaleString()} this month`}
          color="border-zinc-800 bg-zinc-900"
        />
        <StatCard
          label="Total revenue"
          value={`$${(PLATFORM_STATS.totalRevenue / 1000).toFixed(1)}k`}
          sub={`+${PLATFORM_STATS.revenueGrowthPct}% MoM`}
          color="border-zinc-800 bg-zinc-900"
        />
        <StatCard
          label="Active subscriptions"
          value={PLATFORM_STATS.activeSubscriptions.toLocaleString()}
          sub={`Avg rating ${PLATFORM_STATS.avgRating}`}
          color="border-zinc-800 bg-zinc-900"
        />
        <StatCard
          label="Published courses"
          value={String(PLATFORM_STATS.publishedCourses)}
          sub={`${ADMIN_COURSES.filter((c) => c.status === 'draft').length} drafts`}
          color="border-zinc-800 bg-zinc-900"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Monthly Revenue (2025)</h2>
            <span className="text-xs text-zinc-500">
              Total: ${MONTHLY_REVENUE.reduce((a, b) => a + b.revenue, 0).toLocaleString()}
            </span>
          </div>
          <BarChart data={MONTHLY_REVENUE as unknown as Record<string, unknown>[]} valueKey="revenue" labelKey="month" />
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
            <span>Peak: Dec ($23.8k)</span>
            <span>·</span>
            <span>Avg: ${Math.round(MONTHLY_REVENUE.reduce((a, b) => a + b.revenue, 0) / 12).toLocaleString()}/mo</span>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {ACTIVITY_FEED.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">{ACTIVITY_ICONS[item.type] ?? '·'}</span>
                <div>
                  <p className="text-xs text-zinc-300 leading-snug">{item.text}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top courses */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-200">Published Courses</h2>
          <Link href="/admin/courses" className="text-xs text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Course</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Students</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Rating</th>
              </tr>
            </thead>
            <tbody>
              {publishedCourses.slice(0, 5).map((course) => (
                <tr key={course.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient}`} />
                      <div>
                        <p className="font-medium text-zinc-200 text-sm">{course.title}</p>
                        <p className="text-xs text-zinc-600">{course.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-400">{course.students.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-zinc-400">
                    {course.revenue === 0 ? <span className="text-green-400">Free</span> : `$${course.revenue.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-400">{course.rating > 0 ? `★ ${course.rating}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
