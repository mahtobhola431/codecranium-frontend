'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Course, Lesson } from '@/types'
import { formatDuration } from '@/lib/mockData'

interface Props {
  course: Course
  currentSlug: string
  completedIds?: string[]
}

const TYPE_ICON: Record<string, string> = {
  video: '▶',
  article: '📄',
  quiz: '❓',
  challenge: '⚡',
}

export default function LessonSidebar({ course, currentSlug, completedIds = [] }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <aside className="flex flex-col w-full">
      <div className="sticky top-16">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-50 line-clamp-1">{course.title}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">{course.lessonCount} lessons</p>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 9rem)' }}>
          {course.sections.map((section) => (
            <div key={section.id} className="border-b border-zinc-800/50">
              <button
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-800/50"
              >
                <span className="text-xs font-semibold text-zinc-300">{section.title}</span>
                <svg
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${collapsed[section.id] ? '-rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {!collapsed[section.id] && (
                <ul>
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.slug === currentSlug
                    const isDone = completedIds.includes(lesson.id)
                    return (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        courseSlug={course.slug}
                        isActive={isActive}
                        isDone={isDone}
                      />
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

function LessonItem({
  lesson, courseSlug, isActive, isDone,
}: {
  lesson: Lesson
  courseSlug: string
  isActive: boolean
  isDone: boolean
}) {
  return (
    <li>
      <Link
        href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
        className={`flex items-start gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-800/50 ${
          isActive ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'
        }`}
      >
        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xs ${
          isDone
            ? 'bg-indigo-500 text-white'
            : isActive
            ? 'border border-indigo-500 text-indigo-400'
            : 'border border-zinc-700 text-zinc-600'
        }`}>
          {isDone ? '✓' : TYPE_ICON[lesson.type] || '·'}
        </span>
        <div className="flex-1 min-w-0">
          <span className={`block leading-snug line-clamp-2 ${isActive ? 'text-indigo-300' : isDone ? 'text-zinc-400' : 'text-zinc-300'}`}>
            {lesson.title}
          </span>
          <span className="text-xs text-zinc-600">{formatDuration(lesson.duration)}</span>
        </div>
      </Link>
    </li>
  )
}
