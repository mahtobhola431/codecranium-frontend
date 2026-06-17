'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface MonthlyPoint {
  month: string
  earnings: number
  students: number
}

interface Payout {
  id: string
  month: string
  amount: number
  status: 'paid' | 'pending' | 'processing'
  paidOn: string | null
}

interface CourseRevenue {
  courseId: string
  title: string
  students: number
  price: number
  gradient: string
  revenue: number
}

function BarChart({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(...data.map((d) => d.earnings)) || 1
  return (
    <div className="flex items-end gap-1.5 h-36">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs text-zinc-600">${(d.earnings / 1000).toFixed(1)}k</span>
          <div className="w-full rounded-t bg-zinc-800 relative" style={{ height: '96px' }}>
            <div
              className="absolute bottom-0 w-full rounded-t bg-indigo-500/80 transition-all"
              style={{ height: `${(d.earnings / max) * 96}px` }}
            />
          </div>
          <span className="text-xs text-zinc-700">{d.month.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function InstructorRevenuePage() {
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyPoint[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [payoutAccount, setPayoutAccount] = useState<string>('')
  const [courses, setCourses] = useState<CourseRevenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/instructor/revenue'),
      api.get('/instructor/courses'),
    ])
      .then(([revenueRes, coursesRes]) => {
        const rev = revenueRes.data.data
        setMonthlyEarnings(rev.monthlyEarnings ?? [])
        setPayouts(rev.payouts ?? [])
        setPayoutAccount(rev.payoutAccount ?? '')
        const allCourses = coursesRes.data.data.courses ?? []
        setCourses(allCourses.filter((c: CourseRevenue) => c.price > 0))
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

  const totalEarnings = monthlyEarnings.reduce((a, b) => a + b.earnings, 0)
  const thisMonth = monthlyEarnings[monthlyEarnings.length - 1]
  const lastMonth = monthlyEarnings[monthlyEarnings.length - 2]
  const growth = thisMonth && lastMonth && lastMonth.earnings > 0
    ? Math.round(((thisMonth.earnings - lastMonth.earnings) / lastMonth.earnings) * 100)
    : null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Revenue</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Your 70% instructor revenue share</p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total earned (12 mo)</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">${totalEarnings.toLocaleString()}</p>
          <p className="mt-1 text-xs text-zinc-600">70% revenue share</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">This month</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">${(thisMonth?.earnings ?? 0).toLocaleString()}</p>
          {growth != null && (
            <p className={`mt-1 text-xs ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growth >= 0 ? '+' : ''}{growth}% vs last month
            </p>
          )}
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Pending payout</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">${(thisMonth?.earnings ?? 0).toLocaleString()}</p>
          <p className="mt-1 text-xs text-zinc-600">Paid on 1st of month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Payout account</p>
          <p className="mt-2 text-sm font-medium text-zinc-200 truncate">{payoutAccount || '—'}</p>
          <p className="mt-1 text-xs text-indigo-400 cursor-pointer hover:underline">Change →</p>
        </div>
      </div>

      {monthlyEarnings.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Monthly earnings</h2>
            <span className="text-xs text-zinc-500">Avg: ${Math.round(totalEarnings / (monthlyEarnings.length || 1)).toLocaleString()}/mo</span>
          </div>
          <BarChart data={monthlyEarnings} />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Revenue by course</h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.courseId} className="flex items-center gap-3">
                <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{course.title}</p>
                  <p className="text-xs text-zinc-600">{course.students.toLocaleString()} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-200">${Math.round(course.revenue * 0.7).toLocaleString()}</p>
                  <p className="text-xs text-zinc-600">your share</p>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">No paid courses yet</p>
            )}
          </div>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-500">
            Revenue share: you receive <span className="text-indigo-300 font-medium">70%</span> of each sale. CodeCranium keeps 30% for hosting, support, and marketing.
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Payout history</h2>
          <div className="space-y-2">
            {payouts.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-4">No payouts yet</p>
            )}
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-zinc-300">{payout.month}</p>
                  <p className="text-xs text-zinc-600">{payout.paidOn ? `Paid on ${payout.paidOn}` : 'Pending'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-200">${payout.amount.toLocaleString()}</p>
                  <span className={`text-xs ${payout.status === 'paid' ? 'text-green-400' : 'text-amber-400'} capitalize`}>
                    {payout.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
