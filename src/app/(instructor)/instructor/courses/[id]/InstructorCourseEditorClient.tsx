'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { INSTRUCTOR_COURSE_ANALYTICS } from '@/lib/adminMockData'
import { MOCK_COURSES } from '@/lib/mockData'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/mockData'

type Course = typeof INSTRUCTOR_COURSE_ANALYTICS[number]

interface Props { courseId: string; course: Course | null }

export default function InstructorCourseEditorClient({ courseId, course }: Props) {
  const fullCourse = MOCK_COURSES.find((c) => c.id === courseId)
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: course?.title ?? fullCourse?.title ?? '',
    description: fullCourse?.description ?? '',
    category: fullCourse?.category ?? 'javascript',
    difficulty: fullCourse?.difficulty ?? 'beginner',
    price: String(course?.price ?? fullCourse?.price ?? 0),
    tags: fullCourse?.tags.join(', ') ?? '',
    whatYouLearn: fullCourse?.whatYouLearn.join('\n') ?? '',
  })
  const [sections, setSections] = useState(fullCourse?.sections ?? [])

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const save = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!course && !fullCourse) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <p className="text-zinc-400">Course not found</p>
          <Link href="/instructor/courses" className="mt-3 block text-sm text-indigo-400">← Back to courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses" className="text-xs text-zinc-500 hover:text-zinc-300">← Courses</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm font-semibold text-zinc-200 max-w-xs truncate">{form.title}</span>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Published</span>
        </div>
        <button onClick={save} disabled={saving} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${saved ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500 text-white hover:bg-indigo-600'} disabled:opacity-60`}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      <div className="flex border-b border-zinc-800 px-6">
        {(['info', 'curriculum'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm capitalize transition border-b-2 -mb-px ${activeTab === tab ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="max-w-2xl space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Course title</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none">
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none">
                  {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (USD)</label>
              <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Short description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">What students will learn (one per line)</label>
              <textarea value={form.whatYouLearn} onChange={(e) => set('whatYouLearn', e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none font-mono" />
            </div>

            {/* Analytics snapshot */}
            {course && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Course stats</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-zinc-50">{course.students.toLocaleString()}</p>
                    <p className="text-xs text-zinc-600">students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-400">★ {course.rating}</p>
                    <p className="text-xs text-zinc-600">{course.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-400">{course.completionRate}%</p>
                    <p className="text-xs text-zinc-600">completion</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="max-w-2xl space-y-4">
            {sections.map((section, si) => (
              <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-800/30">
                  <span className="text-xs text-zinc-600 font-mono">§{si + 1}</span>
                  <input value={section.title} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, title: e.target.value } : s))} className="flex-1 bg-transparent text-sm font-semibold text-zinc-200 focus:outline-none" />
                  <button onClick={() => setSections((p) => p.filter((_, i) => i !== si))} className="text-xs text-zinc-600 hover:text-red-400">Remove</button>
                </div>
                {section.lessons.map((lesson, li) => (
                  <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/50 last:border-0">
                    <span className="text-xs text-zinc-600 w-6">{lesson.type === 'video' ? '▶' : lesson.type === 'quiz' ? '❓' : lesson.type === 'challenge' ? '⚡' : '📄'}</span>
                    <input value={lesson.title} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, title: e.target.value } : l) } : s))} className="flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none" />
                    <span className="text-xs text-zinc-600">{lesson.duration}m</span>
                    {lesson.isPreview && <span className="text-xs text-indigo-400">Preview</span>}
                  </div>
                ))}
                <div className="px-4 py-2.5">
                  <button onClick={() => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: [...s.lessons, { id: `l${Date.now()}`, slug: `lesson-${s.lessons.length + 1}`, title: 'New Lesson', type: 'article' as const, duration: 10, isPreview: false }] } : s))} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add lesson</button>
                </div>
              </div>
            ))}
            <button onClick={() => setSections((p) => [...p, { id: `s${Date.now()}`, title: 'New Section', lessons: [] }])} className="w-full rounded-xl border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition">
              + Add section
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
