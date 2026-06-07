export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Category = 'javascript' | 'react' | 'python' | 'typescript' | 'nodejs' | 'css' | 'rust' | 'go'
export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'rust' | 'go' | 'bash'
export type LessonType = 'video' | 'article' | 'quiz' | 'challenge'

export interface Instructor {
  id: string
  name: string
  avatar: string
  bio: string
  courses: number
  students: number
}

export interface Lesson {
  id: string
  slug: string
  title: string
  duration: number
  type: LessonType
  isPreview: boolean
  isCompleted?: boolean
  codeLanguage?: CodeLanguage
  content?: string
  starterCode?: string
}

export interface LessonSection {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  category: Category
  difficulty: Difficulty
  duration: number
  lessonCount: number
  rating: number
  reviewCount: number
  students: number
  price: number
  gradient: string
  instructor: Instructor
  tags: string[]
  whatYouLearn: string[]
  sections: LessonSection[]
  lastUpdated: string
  codeLanguage: CodeLanguage
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  xp: number
  streak: number
  joinedAt: string
}

export interface Certificate {
  id: string
  courseId: string
  courseTitle: string
  issuedAt: string
}

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  courseIds: string[]
  difficulty: Difficulty
  totalHours: number
  icon: string
  gradient: string
}

export interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: number
  replies?: Comment[]
}

export interface EnrolledCourse {
  courseId: string
  progress: number
  lastLessonSlug: string
  startedAt: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  highlighted: boolean
  cta: string
}
