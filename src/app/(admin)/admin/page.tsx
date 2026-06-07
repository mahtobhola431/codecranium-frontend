export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-center px-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 max-w-md">
        <span className="text-5xl">⚙️</span>
        <h1 className="mt-6 text-2xl font-bold text-zinc-50">Admin CRM</h1>
        <p className="mt-3 text-zinc-500 leading-relaxed">
          The admin portal — course management, content upload, analytics, and user moderation — is coming in the next sprint.
        </p>
        <div className="mt-6 space-y-2 text-sm text-zinc-600">
          <p>Content Service integration (MDX editor + preview)</p>
          <p>Course publish workflow</p>
          <p>Student analytics dashboard</p>
          <p>Comment moderation</p>
        </div>
      </div>
    </div>
  )
}
