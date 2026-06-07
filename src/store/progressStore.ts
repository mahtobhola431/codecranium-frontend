'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EnrolledCourse } from '@/types'

interface ProgressState {
  enrolled: Record<string, EnrolledCourse>
  completedLessons: Record<string, string[]>
  enroll: (courseId: string) => void
  completeLesson: (courseId: string, lessonId: string) => void
  isEnrolled: (courseId: string) => boolean
  getCompletedCount: (courseId: string) => number
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      enrolled: {},
      completedLessons: {},
      enroll: (courseId) =>
        set((state) => ({
          enrolled: {
            ...state.enrolled,
            [courseId]: {
              courseId,
              progress: 0,
              lastLessonSlug: '',
              startedAt: new Date().toISOString(),
            },
          },
        })),
      completeLesson: (courseId, lessonId) =>
        set((state) => {
          const existing = state.completedLessons[courseId] ?? []
          if (existing.includes(lessonId)) return state
          return {
            completedLessons: {
              ...state.completedLessons,
              [courseId]: [...existing, lessonId],
            },
          }
        }),
      isEnrolled: (courseId) => courseId in get().enrolled,
      getCompletedCount: (courseId) => get().completedLessons[courseId]?.length ?? 0,
    }),
    { name: 'cc-progress' }
  )
)
