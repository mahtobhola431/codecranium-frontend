export default function InstructorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-center px-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 max-w-md">
        <span className="text-5xl">🎓</span>
        <h1 className="mt-6 text-2xl font-bold text-zinc-50">Instructor Portal</h1>
        <p className="mt-3 text-zinc-500 leading-relaxed">
          The instructor portal — course builder, student analytics, and revenue share dashboard — is in development.
        </p>
        <div className="mt-6 space-y-2 text-sm text-zinc-600">
          <p>Drag-and-drop course builder</p>
          <p>Student progress analytics</p>
          <p>Revenue share dashboard</p>
          <p>Direct student messaging</p>
        </div>
      </div>
    </div>
  )
}
