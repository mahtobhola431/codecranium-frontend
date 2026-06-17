import CourseEditorClient from './CourseEditorClient'

export default async function AdminCourseEditorPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  return <CourseEditorClient id={id} />
}
