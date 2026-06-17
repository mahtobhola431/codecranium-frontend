import InstructorCourseEditorClient from './InstructorCourseEditorClient'

export default async function InstructorCourseEditorPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  return <InstructorCourseEditorClient courseId={id} />
}
