'use client'

import { useState } from 'react'
import { MONTHLY_REVENUE, ADMIN_COURSES, PLATFORM_STATS } from '@/lib/adminMockData'

function BarChart({ data, valueKey, color = 'bg-indigo-500' }: {
  data: Record<string, unknown>[]
  valueKey: string
  color?: string
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])))
  return (
    <div className="flex items-end gap-1 h-36">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-zinc-800 relative" style={{ height: '120px' }}>
            <div
              className={`absolute bottom-0 w-full rounded-t ${color} transition-all`}
              style={{ height: `${(Number(d[valueKey]) / max) * 120}px` }}
            />
          </div>
          <span className="text-xs text-zinc-700">{String(d.month).slice(0, 3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [metric, setMetric] = useState<'revenue' | 'students'>('revenue')

  const totalRevenue = MONTHLY_REVENUE.reduce((a, b) => a + b.revenue, 0)
  const totalStudentsThisYear = MONTHLY_REVENUE.reduce((a, b) => a + b.students, 0)
  const avgMonthlyRevenue = Math.round(totalRevenue / 12)

  const topCourses = [...ADMIN_COURSES]
    .filter((c) => c.status === 'published')
    .sort((a, b) => b.students - a.students)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Platform performance — Jan to Dec 2025</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Total revenue (2025)', value: `$${(totalRevenue / 1000).toFixed(1)}k`, delta: '+18.2%' },
          { label: 'New students (2025)', value: totalStudentsThisYear.toLocaleString(), delta: '+12.4%' },
          { label: 'Avg monthly revenue', value: `$${avgMonthlyRevenue.toLocaleString()}`, delta: '' },
          { label: 'Active subscriptions', value: PLATFORM_STATS.activeSubscriptions.toLocaleString(), delta: '+8.1%' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-50">{kpi.value}</p>
            {kpi.delta && (
              <p className="mt-1 text-xs text-green-400">{kpi.delta} YoY</p>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
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

        <BarChart
          data={MONTHLY_REVENUE as unknown as Record<string, unknown>[]}
          valueKey={metric}
          color={metric === 'revenue' ? 'bg-indigo-500/80' : 'bg-teal-500/80'}
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-zinc-500">
            <tbody>
              <tr>
                {MONTHLY_REVENUE.map((m) => (
                  <td key={m.month} className="text-center py-1 px-1 whitespace-nowrap">
                    {metric === 'revenue' ? `$${(m.revenue / 1000).toFixed(1)}k` : m.students}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top courses by enrollment */}
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
                        style={{ width: `${(course.students / topCourses[0].students) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">{course.students.toLocaleString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Plan distribution */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Subscription distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Free', count: 42180, pct: 84, color: 'bg-zinc-600' },
              { label: 'Pro', count: 6840, pct: 13, color: 'bg-indigo-500' },
              { label: 'Team', count: 1400, pct: 3, color: 'bg-violet-500' },
            ].map((tier) => (
              <div key={tier.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">{tier.label}</span>
                  <span className="text-xs text-zinc-500">{tier.count.toLocaleString()} ({tier.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800">
                  <div className={`h-2 rounded-full ${tier.color}`} style={{ width: `${tier.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Avg revenue per user (ARPU)</span>
              <span className="text-zinc-300 font-medium">$3.65/mo</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Pro churn rate</span>
              <span className="text-zinc-300 font-medium">4.2%/mo</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Free → Pro conversion</span>
              <span className="text-zinc-300 font-medium">16.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
