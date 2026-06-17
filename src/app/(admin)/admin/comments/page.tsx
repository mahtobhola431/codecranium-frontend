'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

type CommentStatus = 'pending' | 'approved' | 'rejected'

interface ModComment {
  id: string
  author: string
  email: string
  courseTitle: string
  lessonSlug: string
  content: string
  postedAt: string
  status: CommentStatus
  flagReason?: string
}

const STATUS_STYLES: Record<CommentStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<ModComment[]>([])
  const [filter, setFilter] = useState<CommentStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/comments')
      .then((res) => setComments(res.data.data.comments ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const moderate = async (id: string, status: CommentStatus) => {
    try {
      await api.patch(`/admin/comments/${id}`, { status })
      setComments((p) => p.map((c) => (c.id === id ? { ...c, status } : c)))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === 'all' ? comments : comments.filter((c) => c.status === filter)
  const pending = comments.filter((c) => c.status === 'pending').length

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Comment Moderation</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{comments.length} total comments</p>
        </div>
        {pending > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            {pending} pending review
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
              filter === s
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {s} {s !== 'all' && `(${comments.filter((c) => c.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl bg-zinc-900 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-xl border bg-zinc-900 p-5 ${
                comment.status === 'pending' && comment.flagReason
                  ? 'border-amber-500/30'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  {comment.flagReason && comment.status === 'pending' && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                      <span className="text-red-400 text-xs">🚩</span>
                      <span className="text-xs text-red-400">{comment.flagReason}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                        {comment.author.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{comment.author}</span>
                      <span className="text-xs text-zinc-600">{comment.email}</span>
                    </div>
                    <span className="text-xs text-zinc-700">·</span>
                    <span className="text-xs text-zinc-500">{comment.courseTitle}</span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed">{comment.content}</p>
                  <p className="mt-1.5 text-xs text-zinc-700">{comment.postedAt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[comment.status]}`}>
                    {comment.status}
                  </span>
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => moderate(comment.id, 'approved')}
                      className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/20"
                    >
                      Approve
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => moderate(comment.id, 'rejected')}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-zinc-400 font-medium">No comments in this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
