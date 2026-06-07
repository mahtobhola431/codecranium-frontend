'use client'

import { useState, useMemo } from 'react'
import type { Metadata } from 'next'
import CourseCard from '@/components/learner/CourseCard'
import { MOCK_COURSES, CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/lib/mockData'
import type { Category, Difficulty } from '@/types'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as Difficulty[]
type SortKey = 'rating' | 'students' | 'price-asc' | 'price-desc'

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [sort, setSort] = useState<SortKey>('rating')

  const filtered = useMemo(() => {
    let list = [...MOCK_COURSES]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q))
      )
    }
    if (category) list = list.filter((c) => c.category === category)
    if (difficulty) list = list.filter((c) => c.difficulty === difficulty)
    if (priceFilter === 'free') list = list.filter((c) => c.price === 0)
    if (priceFilter === 'paid') list = list.filter((c) => c.price > 0)

    list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'students') return b.students - a.students
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })
    return list
  }, [search, category, difficulty, priceFilter, sort])

  const clearFilters = () => {
    setCategory('')
    setDifficulty('')
    setPriceFilter('all')
    setSearch('')
  }

  const hasFilters = category || difficulty || priceFilter !== 'all' || search

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-50">All Courses</h1>
        <p className="mt-2 text-zinc-500">{MOCK_COURSES.length} courses across 8 languages</p>
      </div>

      {/* Search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 focus:outline-none"
        >
          <option value="rating">Sort: Top rated</option>
          <option value="students">Sort: Most popular</option>
          <option value="price-asc">Sort: Price low → high</option>
          <option value="price-desc">Sort: Price high → low</option>
        </select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 space-y-6">
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300">
                Clear all filters ×
              </button>
            )}

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(category === cat ? '' : cat)}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                        category === cat
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Difficulty</h3>
              <ul className="space-y-1">
                {DIFFICULTIES.map((d) => (
                  <li key={d}>
                    <button
                      onClick={() => setDifficulty(difficulty === d ? '' : d)}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm capitalize transition ${
                        difficulty === d
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Price</h3>
              <ul className="space-y-1">
                {(['all', 'free', 'paid'] as const).map((p) => (
                  <li key={p}>
                    <button
                      onClick={() => setPriceFilter(p)}
                      className={`w-full rounded-lg px-3 py-1.5 text-left text-sm capitalize transition ${
                        priceFilter === p
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {p === 'all' ? 'All courses' : p === 'free' ? 'Free only' : 'Paid only'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Course grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-zinc-500">No courses match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-indigo-400 hover:text-indigo-300">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-xs text-zinc-600">{filtered.length} courses</p>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
