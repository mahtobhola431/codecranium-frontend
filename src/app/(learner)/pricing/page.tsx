import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Invest in your engineering career. Start free, upgrade when ready.',
}

const PLANS = [
  {
    
    name: 'Free',
    price: 0,
    description: 'Get started with the fundamentals — no credit card required.',
    features: [
      '3 free courses (JS, CSS, Python)',
      'In-browser code playground',
      'Community forum access',
      'Progress tracking',
      'Mobile-friendly lessons',
    ],
    notIncluded: ['Premium courses', 'Certificates', 'Offline access', 'Priority support'],
    cta: 'Start for free',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 19,
    description: 'Unlimited access to every course and all platform features.',
    features: [
      'All 200+ courses, unlimited access',
      'In-browser code playground',
      'Verified certificates',
      'Offline lesson downloads',
      'Priority community support',
      'Learning path progress dashboard',
      'Advanced challenges & quizzes',
      'Early access to new courses',
    ],
    notIncluded: [],
    cta: 'Start Pro — $19/mo',
    href: '/auth/register?plan=pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: 49,
    description: 'For engineering teams that learn together and grow faster.',
    features: [
      'Everything in Pro',
      'Team progress dashboard',
      'Admin seat management',
      'Custom learning paths',
      'Bulk invoice billing',
      'Dedicated account manager',
      'SSO (SAML 2.0)',
      'Analytics & reporting',
    ],
    notIncluded: [],
    cta: 'Start Team — $49/seat/mo',
    href: '/contact?plan=team',
    highlighted: false,
  },
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your account settings at any time — no calls, no forms. Your access continues until the end of the billing period.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'We offer a 7-day free trial for Pro. No credit card required to try.',
  },
  {
    q: 'Do certificates work on LinkedIn?',
    a: 'Yes. Our certificates follow the LinkedIn Certification standard and can be added directly to your profile.',
  },
  {
    q: 'What languages does the playground support?',
    a: 'JavaScript, TypeScript, Python, Go, Rust, and Bash. More are being added based on course demand.',
  },
]

export default function PricingPage() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-zinc-50">Invest in your career</h1>
          <p className="mt-4 text-lg text-zinc-400">Start free. Upgrade when you're ready to go deep.</p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                plan.highlighted
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-xl shadow-indigo-500/10'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-zinc-50">{plan.name}</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-zinc-50">${plan.price}</span>
                  {plan.price > 0 && <span className="text-zinc-500 text-sm ml-1">/seat/month</span>}
                </div>
                <p className="mt-2 text-sm text-zinc-500">{plan.description}</p>
              </div>

              <Link
                href={plan.href}
                className={`block w-full rounded-xl py-3 text-center font-semibold text-sm transition ${
                  plan.highlighted
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-50'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold text-zinc-50 mb-8">Frequently asked questions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-200 mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
