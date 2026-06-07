import { INSTRUCTOR_COURSE_ANALYTICS } from '@/lib/adminMockData'
import InstructorCourseEditorClient from './InstructorCourseEditorClient'

export async function generateStaticParams() {
  return INSTRUCTOR_COURSE_ANALYTICS.map((c) => ({ id: c.courseId }))
}

export default async function InstructorCourseEditorPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const course = INSTRUCTOR_COURSE_ANALYTICS.find((c) => c.courseId === id)
  return <InstructorCourseEditorClient courseId={id} course={course ?? null} />
}
