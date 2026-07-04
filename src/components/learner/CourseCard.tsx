import Link from 'next/link'
import type { Course } from '@/types'
import { CATEGORY_LABELS, DIFFICULTY_LABELS, formatDuration } from '@/lib/mockData'

interface Props {
  course: Course
  variant?: 'default' | 'compact'
}

const DIFFICULTY_COLORS = {
  beginner: 'text-green-400 bg-green-400/10',
  intermediate: 'text-amber-400 bg-amber-400/10',
  advanced: 'text-red-400 bg-red-400/10',
}

export default function CourseCard({ course, variant = 'default' }: Props) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden transition hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30"
    >
      {/* Cover */}
      <div className={`h-36 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center`}>
        <span className="text-5xl font-mono font-bold text-white/20 select-none">
          {CATEGORY_LABELS[course.category]?.slice(0, 2).toUpperCase()}
        </span>
        {course.price === 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">
            Free
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty]}`}>
            {DIFFICULTY_LABELS[course.difficulty]}
          </span>
          <span className="text-xs text-zinc-500">{CATEGORY_LABELS[course.category]}</span>
        </div>

        <h3 className="font-semibold text-zinc-50 leading-snug mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {variant === 'default' && (
          <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">{course.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(course.duration)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {course.lessonCount} lessons
            </span>
          </div>

          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-zinc-300">{course.rating}</span>
            <span className="text-xs text-zinc-600">({course.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-50">
            {course.price === 0 ? 'Free' : `₹${course.price}`}
          </span>
          <span className="text-xs text-zinc-500">{course.instructor.name}</span>
        </div>
      </div>
    </Link>
  )
}
