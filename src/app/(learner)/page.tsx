import Link from 'next/link'
import type { Metadata } from 'next'
import CourseCard from '@/components/learner/CourseCard'
import type { Course } from '@/types'

export const metadata: Metadata = {
  title: 'CodeCranium — Learn to code, build real things',
  description: 'Interactive coding courses with an in-browser playground. Master JavaScript, React, Python, Go, and Rust.',
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

const STATS = [
  { value: '50,000+', label: 'Active learners' },
  { value: '200+', label: 'Courses & lessons' },
  { value: '8', label: 'Languages' },
  { value: '60%', label: 'Avg completion rate' },
]

const WHY_ITEMS = [
  {
    icon: '⚡',
    title: 'In-browser code playground',
    desc: 'Run real code directly in the browser — no setup required. Isolated Docker containers per language.',
  },
  {
    icon: '🏆',
    title: 'Gamified learning',
    desc: 'Earn XP, maintain streaks, and unlock certificates. Completion drives word-of-mouth.',
  },
  {
    icon: '📐',
    title: 'MDX-powered lessons',
    desc: 'Lessons written in MDX — rich interactive content with inline challenges and live code examples.',
  },
  {
    icon: '🌐',
    title: 'SEO-first architecture',
    desc: 'Every lesson is server-rendered for perfect crawlability. Google is your free acquisition channel.',
  },
]

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

async function getHomeData() {
  try {
    const [coursesRes, pathsRes] = await Promise.all([
      fetch(`${API}/courses?limit=50`, { cache: 'no-store' }),
      fetch(`${API}/learning-paths`, { cache: 'no-store' }),
    ])
    const courses: Course[] = coursesRes.ok ? (await coursesRes.json()).data.courses : []
    const paths: RawPath[] = pathsRes.ok ? (await pathsRes.json()).data.paths : []
    return { courses, paths }
  } catch {
    return { courses: [], paths: [] }
  }
}

export default async function HomePage() {
  const { courses, paths } = await getHomeData()
  const featuredCourses = courses.slice(0, 4)
  const freeCourses = courses.filter((c) => c.price === 0)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950 px-4 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Live code playground — no setup required
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Build.{' '}
            <span className="text-indigo-400">Break.</span>
            <br />
            Learn. Repeat.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
            Interactive coding courses for developers who want to build real things.
            Run code in your browser, ship projects, earn certificates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="rounded-xl bg-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-600"
            >
              Browse courses
            </Link>
            <Link
              href="/learning-paths"
              className="rounded-xl border border-zinc-700 px-8 py-3.5 text-base font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-50"
            >
              View learning paths →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4">
                <div className="text-2xl font-bold text-indigo-400">{s.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-b border-zinc-800 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Featured courses</h2>
              <p className="mt-1 text-zinc-500 text-sm">Curated by the CodeCranium team</p>
            </div>
            <Link href="/courses" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning paths */}
      <section className="border-b border-zinc-800 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-50">Learning paths</h2>
            <p className="mt-1 text-zinc-500 text-sm">Structured curriculum to take you from zero to employed</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/learning-paths#${path.slug}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${path.gradient} text-2xl`}>
                  {path.icon}
                </div>
                <h3 className="font-semibold text-zinc-50 group-hover:text-indigo-300 transition">{path.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">{path.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
                  <span>{(path.courseIds ?? []).length} courses</span>
                  <span>·</span>
                  <span>{path.totalHours}h total</span>
                  <span>·</span>
                  <span className="capitalize">{path.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free courses */}
      {freeCourses.length > 0 && (
        <section className="border-b border-zinc-800 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-50">Start for free</h2>
                <p className="mt-1 text-zinc-500 text-sm">No credit card required</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why CodeCranium */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-zinc-50">Why CodeCranium?</h2>
            <p className="mt-2 text-zinc-500">We built the platform we wished we had when we were learning</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 font-semibold text-zinc-50">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-20 sm:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-zinc-50">Ready to start building?</h2>
          <p className="mt-4 text-zinc-400">Join 50,000+ developers learning on CodeCranium. First course is always free.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-xl bg-indigo-500 px-8 py-3.5 font-semibold text-white transition hover:bg-indigo-600"
            >
              Create free account
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-zinc-700 px-8 py-3.5 font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-50"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
