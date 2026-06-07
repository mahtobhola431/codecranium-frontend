import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MOCK_COURSES, getCourseBySlug, getLessonBySlug, formatDuration } from '@/lib/mockData'
import LessonSidebar from '@/components/learner/LessonSidebar'
import CodePlayground from '@/components/learner/CodePlayground'
import CompleteButton from './CompleteButton'

export async function generateStaticParams() {
  const params: { slug: string; lessonSlug: string }[] = []
  for (const course of MOCK_COURSES) {
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        params.push({ slug: course.slug, lessonSlug: lesson.slug })
      }
    }
  }
  return params
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lessonSlug: string }>
}): Promise<Metadata> {
  const { slug, lessonSlug } = await props.params
  const course = getCourseBySlug(slug)
  if (!course) return {}
  const lesson = getLessonBySlug(course, lessonSlug)
  return {
    title: lesson ? `${lesson.title} — ${course.title}` : course.title,
  }
}

export default async function LessonPage(props: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await props.params
  const course = getCourseBySlug(slug)
  if (!course) notFound()

  const lesson = getLessonBySlug(course, lessonSlug)
  if (!lesson) notFound()

  // Find prev/next lesson
  const allLessons = course.sections.flatMap((s) => s.lessons)
  const currentIdx = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  const hasCode = lesson.type === 'challenge' || !!lesson.starterCode

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:block">
        <LessonSidebar course={course} currentSlug={lessonSlug} />
      </div>

      {/* Main lesson content */}
      <div className="flex-1 min-w-0">
        {/* Lesson header */}
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-zinc-600 mb-1">
                <Link href={`/courses/${course.slug}`} className="hover:text-zinc-400 transition">
                  {course.title}
                </Link>
                <span>/</span>
                <span className="text-zinc-500 capitalize">{lesson.type}</span>
                <span>·</span>
                <span>{formatDuration(lesson.duration)}</span>
              </div>
              <h1 className="text-lg font-semibold text-zinc-50 truncate">{lesson.title}</h1>
            </div>
            <CompleteButton courseId={course.id} lessonId={lesson.id} />
          </div>
        </div>

        {/* Lesson body */}
        <div className="px-6 py-8 max-w-3xl">
          {/* Lesson type badge */}
          <div className="mb-6 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              lesson.type === 'challenge'
                ? 'bg-amber-400/10 text-amber-400'
                : lesson.type === 'quiz'
                ? 'bg-purple-400/10 text-purple-400'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {lesson.type === 'challenge' ? '⚡' : lesson.type === 'quiz' ? '❓' : lesson.type === 'video' ? '▶' : '📄'}
              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
            </span>
          </div>

          {/* Content placeholder — will be MDX from Content Service */}
          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 text-sm leading-relaxed text-zinc-400">
              <p className="text-zinc-300 font-medium">
                {lesson.title}
              </p>
              <p>
                This lesson content is served from the <strong className="text-zinc-300">Content Service</strong> as MDX.
                Connect the backend to load the full lesson including text, diagrams, embedded challenges, and code examples.
              </p>
              <p>
                The lesson covers core concepts, includes interactive examples, and ends with a practical challenge to test your understanding.
              </p>
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-indigo-300 text-xs">
                💡 <strong>Key concept:</strong> Understanding this lesson is foundational for everything that follows in the course.
              </div>
            </div>
          </div>

          {/* Code playground */}
          {hasCode && (
            <div className="mt-8">
              <h2 className="text-base font-semibold text-zinc-50 mb-3">
                {lesson.type === 'challenge' ? '⚡ Code challenge' : 'Try it yourself'}
              </h2>
              <CodePlayground
                language={lesson.codeLanguage ?? course.codeLanguage}
                initialCode={lesson.starterCode}
              />
            </div>
          )}

          {/* Prev/Next navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6">
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="line-clamp-1 max-w-[140px]">{prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson && (
              <Link
                href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
              >
                <span className="line-clamp-1 max-w-[140px]">{nextLesson.title}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
