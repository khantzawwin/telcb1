import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavGuard } from '../contexts/NavGuardContext'

// Shared pieces for the Grammar drill pages (Verben, Konnektoren, werden):
// back link, collapsible Reference card on top, Practice section below.

export function BackToGrammar({ to = '/grammar', label = 'Grammar' }) {
  const { confirmNav } = useNavGuard()
  return (
    <Link
      to={to}
      onClick={e => { if (!confirmNav()) e.preventDefault() }}
      className="inline-block -my-2 py-2 mb-4 text-sm font-medium text-gray-500 hover:text-indigo-600"
    >
      ← {label}
    </Link>
  )
}

export function ReferenceSection({ title = 'Reference', defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-10 rounded-3xl shadow-sm overflow-hidden bg-white">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-base font-semibold text-gray-800">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 sm:px-6 pb-6 pt-5 border-t border-gray-100 bg-slate-50">{children}</div>}
    </div>
  )
}

export function PracticeHeading() {
  return <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-5">Practice</h2>
}
