import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CATEGORY_LABELS, DIFFICULTY_LABELS, formatDuration } from '@/lib/mockData'
import type { Course } from '@/types'
import EnrollButton from './EnrollButton'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function getCourse(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API}/courses/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data.course
  } catch {
    return null
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const course = await getCourse(slug)
  if (!course) return {}
  return { title: course.title, description: course.description }
}

export default async function CourseDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const course = await getCourse(slug)
  if (!course) notFound()

  const firstLesson = course.sections[0]?.lessons[0]
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex-1 min-w-0">
          <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-600">
            <Link href="/courses" className="hover:text-zinc-400">Courses</Link>
            <span>/</span>
            <span className="text-zinc-400">{CATEGORY_LABELS[course.category]}</span>
          </nav>

          <div className={`mb-8 overflow-hidden rounded-2xl bg-gradient-to-br ${course.gradient} p-8 sm:p-12`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-medium text-white/80 capitalize mb-3">
                  {DIFFICULTY_LABELS[course.difficulty]}
                </span>
                <h1 className="text-2xl font-bold text-white sm:text-4xl max-w-2xl leading-tight">
                  {course.title}
                </h1>
                <p className="mt-3 text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {course.rating} ({course.reviewCount.toLocaleString()} reviews)
              </span>
              <span>{course.students.toLocaleString()} students</span>
              <span>{formatDuration(course.duration)}</span>
              <span>{totalLessons} lessons</span>
              <span>Updated {course.lastUpdated}</span>
            </div>
          </div>

          <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-zinc-50 mb-4">What you&apos;ll learn</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {course.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="mt-0.5 text-indigo-400 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-50 mb-4">Course curriculum</h2>
            <div className="space-y-3">
              {course.sections.map((section) => (
                <details key={section.id} open className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 list-none select-none hover:bg-zinc-800/50">
                    <span className="font-medium text-zinc-200">{section.title}</span>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{section.lessons.length} lessons</span>
                      <svg className="h-4 w-4 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <ul className="border-t border-zinc-800">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-600 w-4">
                            {lesson.type === 'video' ? '▶' : lesson.type === 'quiz' ? '❓' : lesson.type === 'challenge' ? '⚡' : '📄'}
                          </span>
                          <span className={`text-sm ${lesson.isPreview ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            {lesson.title}
                          </span>
                          {lesson.isPreview && (
                            <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-xs text-indigo-400">
                              Preview
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-zinc-600">{formatDuration(lesson.duration)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-zinc-50 mb-4">Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-50">{course.instructor.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{course.instructor.bio}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:w-80 lg:shrink-0">
          <div className="sticky top-20 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className={`mb-4 h-40 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
              <span className="text-5xl font-mono font-bold text-white/20">
                {CATEGORY_LABELS[course.category]?.slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-zinc-50">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </span>
            </div>

            {firstLesson && (
              <EnrollButton course={course} firstLessonSlug={firstLesson.slug} />
            )}

            <div className="mt-5 space-y-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2"><span>⏱</span><span>{formatDuration(course.duration)} total</span></div>
              <div className="flex items-center gap-2"><span>📄</span><span>{totalLessons} lessons</span></div>
              <div className="flex items-center gap-2"><span>⚡</span><span>In-browser code playground</span></div>
              <div className="flex items-center gap-2"><span>🏆</span><span>Certificate of completion</span></div>
              <div className="flex items-center gap-2"><span>♾</span><span>Lifetime access</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
