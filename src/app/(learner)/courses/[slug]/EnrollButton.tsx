'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import type { Course } from '@/types'
import api from '@/lib/api'

interface Props {
  course: Course
  firstLessonSlug: string
}

interface RazorpayCheckoutResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: { name?: string; email?: string }
  theme?: { color?: string }
  handler: (response: RazorpayCheckoutResponse) => void
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
  open: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function EnrollButton({ course, firstLessonSlug }: Props) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    api.get('/enrollments')
      .then((res) => {
        const enrollments: { courseId: string }[] = res.data.data.enrollments
        setEnrolled(enrollments.some((e) => e.courseId === course.id))
      })
      .catch(() => {})
  }, [isAuthenticated, course.id])

  const errorMessage = (err: unknown, fallback: string) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback

  const enrollFree = async () => {
    await api.post('/enrollments', { courseId: course.id })
    setEnrolled(true)
  }

  const enrollPaid = async () => {
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded || !window.Razorpay) {
      setError('Could not load the payment widget. Check your connection and try again.')
      return
    }

    const { data } = await api.post('/payments/orders', { courseId: course.id })
    const order = data.data as { orderId: string; amount: number; currency: string; keyId: string }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'CodeCranium',
      description: course.title,
      order_id: order.orderId,
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#6366f1' },
      handler: async (response) => {
        try {
          await api.post('/payments/verify', response)
          setEnrolled(true)
        } catch (err) {
          setError(errorMessage(err, 'Payment succeeded but verification failed — contact support.'))
        } finally {
          setLoading(false)
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    })
    razorpay.open()
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (course.price === 0) {
        await enrollFree()
        setLoading(false)
      } else {
        await enrollPaid()
        // loading is cleared by the Razorpay handler/ondismiss callbacks above
      }
    } catch (err) {
      setError(errorMessage(err, 'Something went wrong — please try again.'))
      setLoading(false)
    }
  }

  if (enrolled) {
    return (
      <Link
        href={`/courses/${course.slug}/lessons/${firstLessonSlug}`}
        className="block w-full rounded-xl bg-indigo-500 py-3 text-center font-semibold text-white transition hover:bg-indigo-600"
      >
        Continue learning →
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
      >
        {loading ? 'Processing...' : course.price === 0 ? 'Enroll for free' : `Enroll — ₹${course.price}`}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
    </div>
  )
}
