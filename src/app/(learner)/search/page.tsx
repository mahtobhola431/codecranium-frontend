import { Suspense } from 'react'
import SearchContent from './SearchContent'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="h-10 w-32 rounded-lg bg-zinc-800 animate-pulse mb-6" />
        <div className="h-14 w-full rounded-xl bg-zinc-800 animate-pulse" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
