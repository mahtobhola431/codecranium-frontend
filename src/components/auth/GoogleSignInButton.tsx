'use client'

import Script from 'next/script'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

/** Minimal shape of the bits of Google Identity Services we actually call. */
interface GoogleCredentialResponse {
  credential: string
}
interface GoogleIdApi {
  initialize: (config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
  }) => void
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black'
      size?: 'small' | 'medium' | 'large'
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
      shape?: 'rectangular' | 'pill' | 'circle' | 'square'
      logo_alignment?: 'left' | 'center'
      width?: number
    }
  ) => void
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } }
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

interface Props {
  /** Changes only the button's wording — the endpoint handles signup and login alike. */
  text?: 'continue_with' | 'signup_with' | 'signin_with'
  onError?: (message: string) => void
}

export default function GoogleSignInButton({ text = 'continue_with', onError }: Props) {
  const router = useRouter()
  const { login } = useAuthStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [busy, setBusy] = useState(false)

  // Google hands us an ID token; the backend verifies its signature and audience,
  // then returns our own JWT + user in the same shape /auth/login does.
  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      setBusy(true)
      try {
        const { data } = await api.post('/auth/google', { credential: response.credential })
        const { user, token } = data.data
        login(user, token)
        if (user.role === 'admin') router.push('/admin')
        else if (user.role === 'instructor') router.push('/instructor')
        else router.push('/dashboard')
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        onError?.(msg ?? 'Google sign-in failed. Please try again.')
        setBusy(false)
      }
      // On success we leave `busy` set — the route change unmounts this component.
    },
    [login, router, onError]
  )

  useEffect(() => {
    if (!scriptLoaded || !CLIENT_ID || !containerRef.current) return

    window.google?.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
    })

    window.google?.accounts.id.renderButton(containerRef.current, {
      theme: 'filled_black', // closest match to the zinc-800 surface around it
      size: 'large',
      shape: 'pill',
      text,
      logo_alignment: 'left',
      width: 320, // matches the max-w-sm card's inner width (384px - 2*32px padding)
    })
  }, [scriptLoaded, handleCredential, text])

  // Without a client ID the GIS script renders nothing at all, which would look
  // like a broken layout. Say so instead — only ever shows in a misconfigured env.
  if (!CLIENT_ID) {
    return (
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-center text-xs text-amber-400">
        Google sign-in unavailable — NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => onError?.('Could not reach Google. Check your connection and retry.')}
      />

      <div className="relative flex justify-center">
        {/* Google requires its own rendered button — we can't restyle its internals,
            only the frame around it. */}
        <div ref={containerRef} className="flex justify-center [color-scheme:light]" />

        {/* Placeholder occupying the button's height until GIS paints, so the card
            doesn't jump. */}
        {!scriptLoaded && (
          <div className="h-10 w-full animate-pulse rounded-full border border-zinc-800 bg-zinc-800/60" />
        )}

        {/* Swallows clicks while the token round-trip is in flight. */}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-zinc-900/70 text-xs text-zinc-400">
            Signing in...
          </div>
        )}
      </div>
    </>
  )
}
