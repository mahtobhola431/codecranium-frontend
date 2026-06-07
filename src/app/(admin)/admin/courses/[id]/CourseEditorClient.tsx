'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AdminCourse } from '@/lib/adminMockData'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/mockData'
import { MOCK_COURSES } from '@/lib/mockData'

interface Props {
  course: AdminCourse | null
  id: string
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

export default function CourseEditorClient({ course, id }: Props) {
  const fullCourse = MOCK_COURSES.find((c) => c.id === id)

  const [form, setForm] = useState({
    title: course?.title ?? '',
    description: fullCourse?.description ?? '',
    longDescription: fullCourse?.longDescription ?? '',
    category: fullCourse?.category ?? 'javascript',
    difficulty: fullCourse?.difficulty ?? 'beginner',
    price: String(fullCourse?.price ?? 0),
    gradient: course?.gradient ?? GRADIENTS[0],
    tags: fullCourse?.tags.join(', ') ?? '',
    whatYouLearn: fullCourse?.whatYouLearn.join('\n') ?? '',
  })
  const [sections, setSections] = useState(fullCourse?.sections ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum' | 'content'>('info')

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addSection = () =>
    setSections((p) => [
      ...p,
      { id: `s-${Date.now()}`, title: 'New Section', lessons: [] },
    ])

  const addLesson = (sectionIdx: number) =>
    setSections((p) =>
      p.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                {
                  id: `l-${Date.now()}`,
                  slug: `lesson-${s.lessons.length + 1}`,
                  title: 'New Lesson',
                  duration: 10,
                  type: 'article' as const,
                  isPreview: false,
                },
              ],
            }
          : s
      )
    )

  const removeSection = (idx: number) =>
    setSections((p) => p.filter((_, i) => i !== idx))

  const removeLesson = (sectionIdx: number, lessonIdx: number) =>
    setSections((p) =>
      p.map((s, i) =>
        i === sectionIdx
          ? { ...s, lessons: s.lessons.filter((_, j) => j !== lessonIdx) }
          : s
      )
    )

  const isNew = id === 'new' || !course

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← Courses
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-semibold text-zinc-200 truncate max-w-xs">
            {isNew ? 'New Course' : form.title || 'Untitled'}
          </h1>
          {!isNew && (
            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
              Published
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            saved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          } disabled:opacity-60`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-6">
        {(['info', 'curriculum', 'content'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── Info tab ─────────────────────────────────────────── */}
        {activeTab === 'info' && (
          <div className="max-w-3xl space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Course title</label>
                <input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. JavaScript Fundamentals"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => set('difficulty', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none"
                >
                  {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (USD) — 0 for free</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="javascript, async, closures"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Short description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={2}
                  placeholder="One-sentence course pitch shown on cards"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Long description</label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => set('longDescription', e.target.value)}
                  rows={4}
                  placeholder="Full course description shown on the detail page"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">What students will learn (one per line)</label>
                <textarea
                  value={form.whatYouLearn}
                  onChange={(e) => set('whatYouLearn', e.target.value)}
                  rows={5}
                  placeholder="Understand scope, closures, and the prototype chain&#10;Write clean async code with Promises..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-2">Cover gradient</label>
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map((g) => (
                    <button
                      key={g}
                      onClick={() => set('gradient', g)}
                      className={`h-10 w-16 rounded-lg bg-gradient-to-br ${g} ring-offset-zinc-900 transition ${form.gradient === g ? 'ring-2 ring-indigo-400 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Curriculum tab ────────────────────────────────────── */}
        {activeTab === 'curriculum' && (
          <div className="max-w-2xl space-y-4">
            {sections.map((section, si) => (
              <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                  <span className="text-xs text-zinc-600 font-mono">§{si + 1}</span>
                  <input
                    value={section.title}
                    onChange={(e) =>
                      setSections((p) =>
                        p.map((s, i) => (i === si ? { ...s, title: e.target.value } : s))
                      )
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-zinc-200 focus:outline-none"
                  />
                  <button
                    onClick={() => removeSection(si)}
                    className="text-xs text-zinc-600 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>

                <ul className="divide-y divide-zinc-800/50">
                  {section.lessons.map((lesson, li) => (
                    <li key={lesson.id} className="flex items-center gap-3 px-4 py-2.5">
                      <select
                        value={lesson.type}
                        onChange={(e) =>
                          setSections((p) =>
                            p.map((s, i) =>
                              i === si
                                ? {
                                    ...s,
                                    lessons: s.lessons.map((l, j) =>
                                      j === li ? { ...l, type: e.target.value as 'article' } : l
                                    ),
                                  }
                                : s
                            )
                          )
                        }
                        className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400 focus:outline-none"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                        <option value="challenge">Challenge</option>
                      </select>
                      <input
                        value={lesson.title}
                        onChange={(e) =>
                          setSections((p) =>
                            p.map((s, i) =>
                              i === si
                                ? {
                                    ...s,
                                    lessons: s.lessons.map((l, j) =>
                                      j === li ? { ...l, title: e.target.value } : l
                                    ),
                                  }
                                : s
                            )
                          )
                        }
                        className="flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) =>
                          setSections((p) =>
                            p.map((s, i) =>
                              i === si
                                ? {
                                    ...s,
                                    lessons: s.lessons.map((l, j) =>
                                      j === li ? { ...l, duration: Number(e.target.value) } : l
                                    ),
                                  }
                                : s
                            )
                          )
                        }
                        className="w-14 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 focus:outline-none text-right"
                      />
                      <span className="text-xs text-zinc-600">min</span>
                      <button
                        onClick={() => removeLesson(si, li)}
                        className="text-zinc-700 hover:text-red-400 transition text-sm"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="px-4 py-2.5">
                  <button
                    onClick={() => addLesson(si)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    + Add lesson
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addSection}
              className="w-full rounded-xl border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition"
            >
              + Add section
            </button>
          </div>
        )}

        {/* ── Content tab ───────────────────────────────────────── */}
        {activeTab === 'content' && (
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">MDX Content Editor</h2>
                <p className="text-xs text-zinc-600 mt-0.5">Write lesson content in MDX (Markdown + JSX). Connects to Content Service.</p>
              </div>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
                Backend required
              </span>
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
                defaultValue={`# ${form.title || 'Lesson Title'}\n\nWrite your lesson content here in MDX format.\n\n## Introduction\n\nThis lesson covers...\n\n\`\`\`javascript\n// Code example\nconst example = () => {\n  return "Hello, CodeCranium!"\n}\n\`\`\`\n\n## Key concepts\n\n- Concept one\n- Concept two\n- Concept three\n\n<Challenge>\n  Try it yourself!\n</Challenge>`}
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
