import Link from 'next/link'

const LINKS = {
  Learn: [
    { label: 'All Courses', href: '/courses' },
    { label: 'Learning Paths', href: '/learning-paths' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Search', href: '/search' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
                CC
              </span>
              CodeCranium
            </Link>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
              Interactive coding courses for developers who want to build real things.
            </p>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{section}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-zinc-500 transition hover:text-zinc-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} CodeCranium. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Built with{' '}
            <span className="text-indigo-400">Next.js</span>{' '}
            &amp;{' '}
            <span className="text-indigo-400">TypeScript</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
