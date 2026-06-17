'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

type PlanType = 'Free' | 'Pro' | 'Team'
type StudentStatus = 'active' | 'inactive' | 'banned'

interface Student {
  id: string
  name: string
  email: string
  joined: string
  courses: number
  xp: number
  plan: PlanType
  status: StudentStatus
  lastActive: string | null
}

const PLAN_STYLES: Record<PlanType, string> = {
  Free: 'text-zinc-400 bg-zinc-700/40',
  Pro: 'text-indigo-300 bg-indigo-500/15',
  Team: 'text-violet-300 bg-violet-500/15',
}
const STATUS_STYLES: Record<StudentStatus, string> = {
  active: 'text-green-400',
  inactive: 'text-zinc-500',
  banned: 'text-red-400',
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanType | 'all'>('all')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/students', { params: { limit: 100 } })
      .then((res) => setStudents(res.data.data.students ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch = !search || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    const matchPlan = planFilter === 'all' || s.plan === planFilter
    return matchSearch && matchPlan
  })

  const toggleBan = async (id: string, current: StudentStatus) => {
    const newStatus: StudentStatus = current === 'banned' ? 'active' : 'banned'
    try {
      await api.patch(`/admin/students/${id}`, { status: newStatus })
      setStudents((p) => p.map((s) => (s.id === id ? { ...s, status: newStatus } : s)))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Students</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{students.length} registered users</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span><span className="text-indigo-300 font-medium">{students.filter((s) => s.plan === 'Pro').length}</span> Pro</span>
          <span><span className="text-violet-300 font-medium">{students.filter((s) => s.plan === 'Team').length}</span> Team</span>
          <span><span className="text-zinc-400 font-medium">{students.filter((s) => s.plan === 'Free').length}</span> Free</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'Free', 'Pro', 'Team'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                planFilter === p
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-600 animate-pulse">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Joined</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-500">Plan</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Courses</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">XP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Last active</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200 text-sm">{student.name}</p>
                          <p className="text-xs text-zinc-600">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-zinc-500">{student.joined}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_STYLES[student.plan]}`}>
                        {student.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-zinc-400">{student.courses}</td>
                    <td className="px-4 py-3.5 text-right text-indigo-400 font-mono text-xs">{student.xp.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-xs text-zinc-600">{student.lastActive ?? '—'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-medium capitalize ${STATUS_STYLES[student.status]}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleBan(student.id, student.status)}
                        className={`rounded px-2 py-1 text-xs transition ${
                          student.status === 'banned'
                            ? 'text-green-400 hover:bg-green-500/10'
                            : 'text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        {student.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-zinc-600">No students found</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
