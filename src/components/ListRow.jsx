import { Link } from 'react-router-dom'

// Card-style link row used by the Grammar lists and "From your notes" links.
export default function ListRow({ to, title, done, tag }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-5 py-4 hover:bg-gray-50 transition-colors"
    >
      <span className="flex-1 min-w-0 text-base font-medium text-gray-900">{title}</span>
      {done && (
        <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
          ✓ today
        </span>
      )}
      {tag && <span className="text-xs font-medium text-gray-500 flex-shrink-0">{tag}</span>}
      <span className="text-gray-300 flex-shrink-0">›</span>
    </Link>
  )
}
