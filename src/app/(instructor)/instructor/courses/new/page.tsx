'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/mockData'

const GRADIENTS = [
  'from-yellow-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-blue-500 to-indigo-500',
  'from-green-500 to-emerald-600',
  'from-pink-500 to-rose-500',
  'from-teal-400 to-cyan-600',
  'from-orange-500 to-red-500',
  'from-violet-500 to-indigo-500',
]

const STEPS = ['Basics', 'Curriculum', 'Content', 'Review']

export default function NewCoursePage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'javascript',
    difficulty: 'beginner',
    price: '0',
    gradient: GRADIENTS[0],
    tags: '',
    whatYouLearn: '',
    codeLanguage: 'javascript',
  })
  const [sections, setSections] = useState([
    { id: 's1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome', type: 'article', duration: 5, isPreview: true }] },
  ])
  const [saving, setSaving] = useState(false)
  const [published, setPublished] = useState(false)

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const addSection = () =>
    setSections((p) => [...p, { id: `s${Date.now()}`, title: 'New Section', lessons: [] }])

  const addLesson = (si: number) =>
    setSections((p) =>
      p.map((s, i) =>
        i === si
          ? { ...s, lessons: [...s.lessons, { id: `l${Date.now()}`, title: 'New Lesson', type: 'article', duration: 10, isPreview: false }] }
          : s
      )
    )

  const handlePublish = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSaving(false)
    setPublished(true)
  }

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 max-w-md">
          <span className="text-5xl">🎉</span>
          <h2 className="mt-6 text-2xl font-bold text-zinc-50">Course submitted!</h2>
          <p className="mt-3 text-zinc-500 leading-relaxed">
            <strong className="text-zinc-300">{form.title || 'Your course'}</strong> has been submitted for review. It typically goes live within 24 hours.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/instructor/courses" className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-600">
              My courses
            </Link>
            <button
              onClick={() => { setPublished(false); setStep(0); setForm({ title: '', description: '', longDescription: '', category: 'javascript', difficulty: 'beginner', price: '0', gradient: GRADIENTS[0], tags: '', whatYouLearn: '', codeLanguage: 'javascript' }); setSections([{ id: 's1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome', type: 'article', duration: 5, isPreview: true }] }]) }}
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses" className="text-xs text-zinc-500 hover:text-zinc-300">← Courses</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm font-semibold text-zinc-200">New Course</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Step indicators */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 text-xs transition ${i === step ? 'text-indigo-300' : i < step ? 'text-zinc-400' : 'text-zinc-700'}`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i === step ? 'bg-indigo-500 text-white' : i < step ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800 text-zinc-600'}`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
                {i < STEPS.length - 1 && <span className="text-zinc-800 ml-1">—</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Step 0 — Basics */}
        {step === 0 && (
          <div className="max-w-2xl space-y-5">
            <h2 className="text-lg font-semibold text-zinc-50">Course basics</h2>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Course title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Mastering TypeScript" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none" />
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
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (USD) — enter 0 for free</label>
              <input type="number" min={0} value={form.price} onChange={(e) => set('price', e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Short description *</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="One sentence that sells the course" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full description</label>
              <textarea value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} rows={4} placeholder="Detailed course description shown on the course page" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">What students will learn (one per line)</label>
              <textarea value={form.whatYouLearn} onChange={(e) => set('whatYouLearn', e.target.value)} rows={4} placeholder="Master the type system&#10;Write generic utility types&#10;Configure strict mode" className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none resize-none font-mono" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Cover gradient</label>
              <div className="flex flex-wrap gap-2">
                {GRADIENTS.map((g) => (
                  <button key={g} onClick={() => set('gradient', g)} className={`h-10 w-16 rounded-lg bg-gradient-to-br ${g} ring-offset-zinc-900 transition ${form.gradient === g ? 'ring-2 ring-indigo-400 ring-offset-2' : 'opacity-50 hover:opacity-100'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Curriculum */}
        {step === 1 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-zinc-50">Curriculum</h2>
            <p className="text-sm text-zinc-500">Build out your sections and lessons. You can write lesson content in the next step.</p>

            {sections.map((section, si) => (
              <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-800/30">
                  <span className="text-xs text-zinc-600 font-mono w-4">§{si + 1}</span>
                  <input
                    value={section.title}
                    onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, title: e.target.value } : s))}
                    className="flex-1 bg-transparent text-sm font-semibold text-zinc-200 focus:outline-none"
                  />
                  <button onClick={() => setSections((p) => p.filter((_, i) => i !== si))} className="text-xs text-zinc-600 hover:text-red-400">
                    Remove
                  </button>
                </div>

                {section.lessons.map((lesson, li) => (
                  <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800/50 last:border-0">
                    <select
                      value={lesson.type}
                      onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, type: e.target.value } : l) } : s))}
                      className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400 focus:outline-none"
                    >
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="quiz">Quiz</option>
                      <option value="challenge">Challenge</option>
                    </select>
                    <input
                      value={lesson.title}
                      onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, title: e.target.value } : l) } : s))}
                      className="flex-1 bg-transparent text-sm text-zinc-300 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.map((l, j) => j === li ? { ...l, duration: Number(e.target.value) } : l) } : s))}
                      className="w-12 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 text-right focus:outline-none"
                    />
                    <span className="text-xs text-zinc-600">min</span>
                    <button onClick={() => setSections((p) => p.map((s, i) => i === si ? { ...s, lessons: s.lessons.filter((_, j) => j !== li) } : s))} className="text-zinc-700 hover:text-red-400 text-sm">×</button>
                  </div>
                ))}

                <div className="px-4 py-2.5">
                  <button onClick={() => addLesson(si)} className="text-xs text-indigo-400 hover:text-indigo-300">
                    + Add lesson
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addSection} className="w-full rounded-xl border border-dashed border-zinc-700 py-3 text-sm text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition">
              + Add section
            </button>
          </div>
        )}

        {/* Step 2 — Content */}
        {step === 2 && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-zinc-50 mb-2">Lesson content</h2>
            <p className="text-sm text-zinc-500 mb-5">Write lesson content in MDX. Once the Content Service is connected, this will have a live preview.</p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <span className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-zinc-500 font-mono ml-2">introduction/welcome.mdx</span>
              </div>
              <textarea
                defaultValue={`# Welcome to ${form.title || 'the course'}\n\nWrite your lesson content here in MDX.\n\n## What we'll cover\n\nIn this lesson, you'll learn:\n\n- Core concept one\n- Core concept two\n\n\`\`\`${form.codeLanguage}\n// Your starter code here\nconsole.log("Hello, world!")\n\`\`\`\n\n<Challenge>\n  Complete the exercise below.\n</Challenge>`}
                rows={20}
                className="w-full bg-zinc-950 px-5 py-4 font-mono text-sm text-zinc-300 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-zinc-50 mb-5">Review & publish</h2>

            <div className={`h-40 rounded-xl bg-gradient-to-br ${form.gradient} flex items-center justify-center mb-5`}>
              <p className="text-2xl font-bold text-white/80">{form.title || 'Untitled Course'}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
              {[
                { label: 'Title', value: form.title || '—' },
                { label: 'Category', value: CATEGORY_LABELS[form.category as keyof typeof CATEGORY_LABELS] },
                { label: 'Difficulty', value: DIFFICULTY_LABELS[form.difficulty as keyof typeof DIFFICULTY_LABELS] },
                { label: 'Price', value: form.price === '0' ? 'Free' : `$${form.price}` },
                { label: 'Sections', value: String(sections.length) },
                { label: 'Total lessons', value: String(sections.reduce((a, s) => a + s.lessons.length, 0)) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-zinc-500">{row.label}</span>
                  <span className="text-sm text-zinc-200 font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-xs text-indigo-300 leading-relaxed">
              After publishing, your course will be reviewed by the CodeCranium team (typically &lt;24h) before going live to learners.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between max-w-2xl">
          <button
            onClick={() => setStep((p) => Math.max(0, p - 1))}
            disabled={step === 0}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-30"
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((p) => p + 1)}
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Next: {STEPS[step + 1]} →
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={saving || !form.title}
              className="rounded-xl bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
            >
              {saving ? 'Publishing...' : 'Submit for review'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
