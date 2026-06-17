'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import CourseCard from '@/components/learner/CourseCard'
import type { Course } from '@/types'
import api from '@/lib/api'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQ)
  const [results, setResults] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = query.trim() ? { q: query, limit: 50 } : { limit: 50 }
    setLoading(true)
    api.get('/courses', { params })
      .then((res) => setResults(res.data.data.courses))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-50 mb-6">Search Courses</h1>

      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, topics, or languages..."
          autoFocus
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-4 pl-12 pr-4 text-base text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {query && (
        <p className="mb-6 text-sm text-zinc-500">
          {results.length} result{results.length !== 1 ? 's' : ''} for <span className="text-zinc-300">&quot;{query}&quot;</span>
        </p>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-zinc-400 font-medium">No results for &quot;{query}&quot;</p>
          <p className="mt-2 text-sm text-zinc-600">Try a different keyword or browse all courses</p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Popular topics</h2>
        <div className="flex flex-wrap gap-2">
          {['javascript', 'react', 'python', 'typescript', 'nodejs', 'async', 'css', 'go', 'rust', 'api', 'hooks', 'generics'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
