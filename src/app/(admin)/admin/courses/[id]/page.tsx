import { ADMIN_COURSES } from '@/lib/adminMockData'
import CourseEditorClient from './CourseEditorClient'

export async function generateStaticParams() {
  return [...ADMIN_COURSES.map((c) => ({ id: c.id })), { id: 'new' }]
}

export default async function AdminCourseEditorPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const course = ADMIN_COURSES.find((c) => c.id === id)
  return <CourseEditorClient course={course ?? null} id={id} />
}
