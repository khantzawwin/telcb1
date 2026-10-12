import { Link } from 'react-router-dom'
import { useTodayPlan } from '../utils/useTodayPlan'

// Shown on finish screens: jump straight to the next unfinished task of the day.
export default function UpNext({ current, className = '' }) {
  const { nextAfter, loading } = useTodayPlan()
  if (loading) return null
  const next = nextAfter(current)

  if (!next) {
    return (
      <Link
        to="/"
        className={`block w-full text-center py-4 rounded-2xl text-base font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors ${className}`}
      >
        All done for today · Home
      </Link>
    )
  }

  return (
    <Link
      to={next.to}
      className={`flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all ${className}`}
    >
      <span className="min-w-0 text-left">
        <span className="block text-xs font-semibold uppercase tracking-widest text-indigo-200">Up next</span>
        <span className="block text-base font-semibold truncate">{next.title} · {next.detail}</span>
      </span>
      <span className="text-xl flex-shrink-0" aria-hidden>→</span>
    </Link>
  )
}
