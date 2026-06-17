import Link from 'next/link'
import type { Metadata } from 'next'
import { DIFFICULTY_LABELS, formatDuration } from '@/lib/mockData'
import type { Course } from '@/types'

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: 'Structured curriculum to take you from beginner to production-ready developer.',
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

interface RawPath {
  id: string
  slug: string
  title: string
  description: string
  courseIds: string[]
  difficulty: string
  totalHours: number
  icon: string
  gradient: string
}

interface LearningPath extends Omit<RawPath, 'courseIds'> {
  courses: Course[]
}

async function getLearningPaths(): Promise<LearningPath[]> {
  try {
    const [pathsRes, coursesRes] = await Promise.all([
      fetch(`${API}/learning-paths`, { cache: 'no-store' }),
      fetch(`${API}/courses?limit=50`, { cache: 'no-store' }),
    ])
    if (!pathsRes.ok) return []
    const pathsJson = await pathsRes.json()
    const coursesJson = coursesRes.ok ? await coursesRes.json() : { data: { courses: [] } }
    const rawPaths: RawPath[] = pathsJson.data.paths ?? []
    const allCourses: Course[] = coursesJson.data.courses ?? []
    const courseById = new Map(allCourses.map((c) => [c.id, c]))
    return rawPaths.map((p) => ({
      ...p,
      courses: (p.courseIds ?? []).map((id) => courseById.get(id)).filter(Boolean) as Course[],
    }))
  } catch {
    return []
  }
}

export default async function LearningPathsPage() {
  const paths = await getLearningPaths()

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-zinc-50">Learning Paths</h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
          Curated sequences of courses designed to take you from zero to job-ready in a specific track.
        </p>
      </div>

      <div className="space-y-8">
        {paths.map((path) => {
          const courses = path.courses ?? []
          const totalDuration = courses.reduce((acc, c) => acc + (c.duration ?? 0), 0)

          return (
            <div
              key={path.id}
              id={path.slug}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${path.gradient} p-7`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black/20 text-3xl">
                    {path.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80 capitalize">
                        {DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{path.title}</h2>
                    <p className="mt-1.5 text-white/70 text-sm max-w-xl">{path.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                      <span>{courses.length} courses</span>
                      <span>·</span>
                      <span>{formatDuration(totalDuration)} total</span>
                      <span>·</span>
                      <span>{courses.reduce((a, c) => a + (c.lessonCount ?? 0), 0)} lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                  Course sequence
                </h3>
                <div className="space-y-3">
                  {courses.map((course, idx) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 transition hover:border-zinc-700"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-xs font-bold text-zinc-500">
                        {idx + 1}
                      </span>
                      <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center text-xs font-bold text-white/30`}>
                        CC
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{course.title}</p>
                        <p className="text-xs text-zinc-600 capitalize">{course.difficulty} · {formatDuration(course.duration)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 shrink-0">
                        {course.price === 0 ? (
                          <span className="text-green-400">Free</span>
                        ) : (
                          <span>${course.price}</span>
                        )}
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-5">
                  <Link
                    href={`/courses/${courses[0]?.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                  >
                    Start this path →
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
