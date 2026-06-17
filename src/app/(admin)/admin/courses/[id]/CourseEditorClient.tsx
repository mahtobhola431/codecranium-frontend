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
  status: string
}

const GRADIENTS = [
  'from-yellow-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-blue-500 to-indigo-500',
  'from-blue-600 to-violet-500',
  'from-green-500 to-emerald-600',
  'from-pink-500 to-rose-500',
  'from-teal-400 to-cyan-600',
  'from-orange-500 to-red-500',
  'from-violet-500 to-indigo-500',
]

interface Props { id: string }

export default function CourseEditorClient({ id }: Props) {
  const isNew = id === 'new'
  const [course, setCourse] = useState<FullCourse | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum' | 'content'>('info')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'javascript',
    difficulty: 'beginner',
    price: '0',
    gradient: GRADIENTS[2],
    tags: '',
    whatYouLearn: '',
  })

  useEffect(() => {
    if (isNew) return
    api.get(`/instructor/courses/${id}`)
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
  }, [id, isNew])

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
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
        await api.patch(`/instructor/courses/${id}`, body)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const addSection = () =>
    setSections((p) => [...p, { id: `s-${Date.now()}`, title: 'New Section', lessons: [] }])

  const addLesson = (si: number) =>
    setSections((p) =>
      p.map((s, i) =>
        i === si
          ? { ...s, lessons: [...s.lessons, { id: `l-${Date.now()}`, slug: `lesson-${s.lessons.length + 1}`, title: 'New Lesson', duration: 10, type: 'article' as const, isPreview: false }] }
          : s
      )
    )

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
          <Link href="/admin/courses" className="mt-3 block text-sm text-indigo-400">← Back to courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses" className="text-xs text-zinc-500 hover:text-zinc-300">← Courses</Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-semibold text-zinc-200 truncate max-w-xs">
            {isNew ? 'New Course' : form.title || 'Untitled'}
          </h1>
          {!isNew && course && (
            <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${
              course.status === 'published'
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            }`}>{course.status}</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            saved ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500 text-white hover:bg-indigo-600'
          } disabled:opacity-60`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      <div className="flex border-b border-zinc-800 px-6">
        {(['info', 'curriculum', 'content'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm capitalize transition border-b-2 -mb-px ${
              activeTab === tab ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'info' && (
          <div className="max-w-3xl space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Course title</label>
                <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. JavaScript Fundamentals" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none" />
              </div>

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

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (USD) — 0 for free</label>
                <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="javascript, async, closures" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Short description</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="One-sentence course pitch shown on cards" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Long description</label>
                <textarea value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} rows={4} placeholder="Full course description shown on the detail page" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">What students will learn (one per line)</label>
                <textarea value={form.whatYouLearn} onChange={(e) => set('whatYouLearn', e.target.value)} rows={5} placeholder={"Understand scope, closures, and the prototype chain\nWrite clean async code with Promises..."} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none font-mono" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-2">Cover gradient</label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map((g) => (
                    <button key={g} onClick={() => set('gradient', g)} className={`h-10 w-16 rounded-lg bg-gradient-to-br ${g} ring-offset-zinc-900 transition ${form.gradient === g ? 'ring-2 ring-indigo-400 ring-offset-2' : 'opacity-60 hover:opacity-100'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="max-w-2xl space-y-4">
            {sections.map((section, si) => (
              <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                  <span className="text-xs text-zinc-600 font-mono">§{si + 1}</span>
                  <input value={section.title} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, title: e.target.value } : s))} className="flex-1 bg-transparent text-sm font-medium text-zinc-200 focus:outline-none" />
                  <button onClick={() => setSections((p) => p.filter((_, i) => i !== si))} className="text-xs text-zinc-600 hover:text-red-400 transition">Remove</button>
                </div>

                <ul className="divide-y divide-zinc-800/50">
                  {section.lessons.map((lesson, li) => (
                    <li key={lesson.id} className="flex items-center gap-3 px-4 py-2.5">
                      <select value={lesson.type} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, type: e.target.value as 'article' } : l) } : s))} className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400 focus:outline-none">
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                        <option value="challenge">Challenge</option>
                      </select>
                      <input value={lesson.title} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, title: e.target.value } : l) } : s))} className="flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none" />
                      <input type="number" value={lesson.duration} onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, duration: Number(e.target.value) } : l) } : s))} className="w-14 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 focus:outline-none text-right" />
                      <span className="text-xs text-zinc-600">min</span>
                      <button onClick={() => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.filter((_, j) => j !== li) } : s))} className="text-zinc-700 hover:text-red-400 transition text-sm">×</button>
                    </li>
                  ))}
                </ul>

                <div className="px-4 py-2.5">
                  <button onClick={() => addLesson(si)} className="text-xs text-indigo-400 hover:text-indigo-300 transition">+ Add lesson</button>
                </div>
              </div>
            ))}

            <button onClick={addSection} className="w-full rounded-xl border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition">
              + Add section
            </button>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">MDX Content Editor</h2>
                <p className="text-xs text-zinc-600 mt-0.5">Write lesson content in MDX. Connects to Content Service.</p>
              </div>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">Backend required</span>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <span className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-zinc-500 font-mono ml-2">lesson.mdx</span>
              </div>
              <textarea
                defaultValue={`# ${form.title || 'Lesson Title'}\n\nWrite your lesson content here in MDX format.\n\n## Introduction\n\nThis lesson covers...\n\n\`\`\`javascript\n// Code example\nconst example = () => {\n  return "Hello, CodeCranium!"\n}\n\`\`\`\n\n## Key concepts\n\n- Concept one\n- Concept two\n- Concept three`}
                rows={24}
                className="w-full bg-zinc-950 px-5 py-4 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
