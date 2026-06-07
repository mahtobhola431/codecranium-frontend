'use client'

import { INSTRUCTOR_MONTHLY_EARNINGS, INSTRUCTOR_COURSE_ANALYTICS, PAYOUT_HISTORY, INSTRUCTOR_PROFILE } from '@/lib/adminMockData'

function BarChart({ data }: { data: typeof INSTRUCTOR_MONTHLY_EARNINGS }) {
  const max = Math.max(...data.map((d) => d.earnings))
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
  const totalEarnings = INSTRUCTOR_MONTHLY_EARNINGS.reduce((a, b) => a + b.earnings, 0)
  const thisMonth = INSTRUCTOR_MONTHLY_EARNINGS[INSTRUCTOR_MONTHLY_EARNINGS.length - 1]
  const lastMonth = INSTRUCTOR_MONTHLY_EARNINGS[INSTRUCTOR_MONTHLY_EARNINGS.length - 2]
  const growth = Math.round(((thisMonth.earnings - lastMonth.earnings) / lastMonth.earnings) * 100)
  const pending = thisMonth.earnings

  const paidCourseRevenue = INSTRUCTOR_COURSE_ANALYTICS.filter((c) => c.price > 0).map((c) => ({
    ...c,
    platformRevenue: c.students * c.price,
    instructorShare: Math.round(c.students * c.price * 0.7),
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-50">Revenue</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Your 70% instructor revenue share</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total earned (2025)</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">${totalEarnings.toLocaleString()}</p>
          <p className="mt-1 text-xs text-zinc-600">70% revenue share</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">This month</p>
          <p className="mt-2 text-3xl font-bold text-zinc-50">${thisMonth.earnings.toLocaleString()}</p>
          <p className="mt-1 text-xs text-green-400">+{growth}% vs last month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Pending payout</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">${pending.toLocaleString()}</p>
          <p className="mt-1 text-xs text-zinc-600">Paid on 1st of month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Payout account</p>
          <p className="mt-2 text-sm font-medium text-zinc-200 truncate">{INSTRUCTOR_PROFILE.payoutAccount}</p>
          <p className="mt-1 text-xs text-indigo-400 cursor-pointer hover:underline">Change →</p>
        </div>
      </div>

      {/* Earnings chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-200">Monthly earnings (2025)</h2>
          <span className="text-xs text-zinc-500">Avg: ${Math.round(totalEarnings / 12).toLocaleString()}/mo</span>
        </div>
        <BarChart data={INSTRUCTOR_MONTHLY_EARNINGS} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Per-course revenue */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Revenue by course</h2>
          <div className="space-y-4">
            {INSTRUCTOR_COURSE_ANALYTICS.map((course) => {
              const paid = paidCourseRevenue.find((c) => c.courseId === course.courseId)
              return (
                <div key={course.courseId} className="flex items-center gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">{course.title}</p>
                    <p className="text-xs text-zinc-600">{course.students.toLocaleString()} students</p>
                  </div>
                  <div className="text-right">
                    {paid ? (
                      <>
                        <p className="text-sm font-semibold text-zinc-200">${paid.instructorShare.toLocaleString()}</p>
                        <p className="text-xs text-zinc-600">your share</p>
                      </>
                    ) : (
                      <p className="text-sm text-green-400">Free</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-500">
            Revenue share: you receive <span className="text-indigo-300 font-medium">70%</span> of each sale. CodeCranium keeps 30% for hosting, support, and marketing.
          </div>
        </div>

        {/* Payout history */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Payout history</h2>
          <div className="space-y-2">
            {/* Upcoming */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-indigo-300">Jun 2025 (upcoming)</p>
                <p className="text-xs text-zinc-600">Pays out Jul 1, 2025</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-indigo-400">${thisMonth.earnings.toLocaleString()}</p>
                <span className="text-xs text-indigo-500">Pending</span>
              </div>
            </div>

            {PAYOUT_HISTORY.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-zinc-300">{payout.month}</p>
                  <p className="text-xs text-zinc-600">Paid on {payout.paidOn}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-200">${payout.amount.toLocaleString()}</p>
                  <span className="flex items-center gap-1 justify-end text-xs text-green-400">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Paid
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
