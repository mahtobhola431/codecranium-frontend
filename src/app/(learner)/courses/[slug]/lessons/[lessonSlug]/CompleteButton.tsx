'use client'

import { useProgressStore } from '@/store/progressStore'

interface Props {
  courseId: string
  lessonId: string
}

export default function CompleteButton({ courseId, lessonId }: Props) {
  const { completeLesson, completedLessons } = useProgressStore()
  const isDone = completedLessons[courseId]?.includes(lessonId)

  return (
    <button
      onClick={() => completeLesson(courseId, lessonId)}
      disabled={isDone}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        isDone
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
          : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-50'
      }`}
    >
      {isDone ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </>
      ) : (
        'Mark complete'
      )}
    </button>
  )
}
