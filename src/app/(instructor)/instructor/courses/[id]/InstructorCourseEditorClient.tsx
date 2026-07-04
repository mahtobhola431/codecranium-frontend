'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/mockData'

interface Lesson {
  id: string
  slug: string
  title: string
  type: 'article' | 'video' | 'quiz' | 'challenge'
  duration: number
  isPreview: boolean
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface FullCourse {
  id: string
  title: string
  description: string
  longDescription: string
  category: string
  difficulty: string
  price: number
  gradient: string
  tags: string[]
  whatYouLearn: string[]
  sections: Section[]
  students: number
  rating: number
  reviewCount: number
  completionRate?: number
  status: string
}

interface Props { courseId: string }

export default function InstructorCourseEditorClient({ courseId }: Props) {
  const isNew = courseId === 'new'
  const [course, setCourse] = useState<FullCourse | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'javascript',
    difficulty: 'beginner',
    price: '0',
    gradient: 'from-blue-500 to-indigo-500',
    tags: '',
    whatYouLearn: '',
  })

  useEffect(() => {
    if (isNew) return
    api.get(`/instructor/courses/${courseId}`)
      .then((res) => {
        const c: FullCourse = res.data.data.course
        setCourse(c)
        setForm({
          title: c.title,
          description: c.description ?? '',
          longDescription: c.longDescription ?? '',
          category: c.category,
          difficulty: c.difficulty,
          price: String(c.price),
          gradient: c.gradient,
          tags: (c.tags ?? []).join(', '),
          whatYouLearn: (c.whatYouLearn ?? []).join('\n'),
        })
        setSections(c.sections ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [courseId, isNew])

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const togglePublish = async () => {
    if (!course) return
    const newStatus = course.status === 'published' ? 'draft' : 'published'
    setPublishing(true)
    try {
      await api.patch(`/instructor/courses/${courseId}/status`, { status: newStatus })
      setCourse((c) => c ? { ...c, status: newStatus } : c)
    } catch (err) {
      console.error(err)
    } finally {
      setPublishing(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const preparedSections = sections.map((sec, si) => ({
        ...sec,
        lessons: sec.lessons.map((l, li) => ({
          ...l,
          slug: l.slug && /^[a-z0-9-]+$/.test(l.slug) ? l.slug : slugify(l.title) || `lesson-${si + 1}-${li + 1}`,
        })),
      }))
      const body = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription,
        category: form.category,
        difficulty: form.difficulty,
        price: Number(form.price),
        gradient: form.gradient,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        whatYouLearn: form.whatYouLearn.split('\n').filter(Boolean).map((s) => s.slice(0, 200)),
        sections: preparedSections,
      }
      if (isNew) {
        await api.post('/instructor/courses', { ...body, slug: slugify(form.title) })
      } else {
        await api.patch(`/instructor/courses/${courseId}`, body)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!isNew && !course) {
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
          <span className="text-sm font-semibold text-zinc-200 max-w-xs truncate">{form.title || 'New Course'}</span>
          {!isNew && course && (
            <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${
              course.status === 'published'
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            }`}>{course.status}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isNew && course && (
            <button
              onClick={togglePublish}
              disabled={publishing}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                course.status === 'published'
                  ? 'border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              {publishing ? '...' : course.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          )}
          <button onClick={save} disabled={saving} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${saved ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500 text-white hover:bg-indigo-600'} disabled:opacity-60`}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
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
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (INR) — 0 for free</label>
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

            {course && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Course stats</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-zinc-50">{course.students.toLocaleString()}</p>
                    <p className="text-xs text-zinc-600">students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-400">★ {course.rating.toFixed(1)}</p>
                    <p className="text-xs text-zinc-600">{course.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  {course.completionRate != null && (
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-400">{course.completionRate}%</p>
                      <p className="text-xs text-zinc-600">completion</p>
                    </div>
                  )}
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
