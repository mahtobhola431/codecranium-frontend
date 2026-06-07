'use client'

import { useState } from 'react'
import type { CodeLanguage } from '@/types'

interface Props {
  initialCode?: string
  language?: CodeLanguage
  readOnly?: boolean
}

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  rust: 'Rust',
  go: 'Go',
  bash: 'Bash',
}

const PLACEHOLDERS: Record<CodeLanguage, string> = {
  javascript: `// Write your JavaScript here\nconsole.log("Hello, CodeCranium!")`,
  typescript: `// Write your TypeScript here\nconst greet = (name: string): string => \`Hello, \${name}!\`\nconsole.log(greet("CodeCranium"))`,
  python: `# Write your Python here\nprint("Hello, CodeCranium!")`,
  rust: `fn main() {\n    println!("Hello, CodeCranium!");\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, CodeCranium!")\n}`,
  bash: `#!/bin/bash\necho "Hello, CodeCranium!"`,
}

export default function CodePlayground({ initialCode, language = 'javascript', readOnly = false }: Props) {
  const [code, setCode] = useState(initialCode || PLACEHOLDERS[language])
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [tab, setTab] = useState<'editor' | 'output'>('editor')

  const runCode = async () => {
    setIsRunning(true)
    setTab('output')
    await new Promise((r) => setTimeout(r, 800))
    setOutput(`// Code execution requires the backend service\n// Output will appear here once connected\n\n> Running ${LANGUAGE_LABELS[language]} code...\n> Environment: Isolated Docker container\n> Status: Backend not yet configured`)
    setIsRunning(false)
  }

  const reset = () => {
    setCode(initialCode || PLACEHOLDERS[language])
    setOutput(null)
    setTab('editor')
  }

  return (
    <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 font-mono">
            {LANGUAGE_LABELS[language]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setTab('editor')}
              className={`px-3 py-1 text-xs transition ${tab === 'editor' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setTab('output')}
              className={`px-3 py-1 text-xs transition ${tab === 'output' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Output
            </button>
          </div>
          <button
            onClick={reset}
            className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning || readOnly}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                Running...
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor / Output */}
      <div className="relative">
        {tab === 'editor' ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            readOnly={readOnly}
            spellCheck={false}
            className="w-full bg-zinc-950 p-4 font-mono text-sm text-zinc-200 focus:outline-none resize-none leading-relaxed"
            style={{ minHeight: '240px', tabSize: 2 }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                const start = e.currentTarget.selectionStart
                const end = e.currentTarget.selectionEnd
                const newCode = code.substring(0, start) + '  ' + code.substring(end)
                setCode(newCode)
                requestAnimationFrame(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
                })
              }
            }}
          />
        ) : (
          <div className="min-h-60 bg-zinc-950 p-4 font-mono text-sm leading-relaxed">
            {isRunning ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-zinc-300" />
                Executing in sandbox...
              </div>
            ) : output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-zinc-600 italic">Click Run to see output here.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
