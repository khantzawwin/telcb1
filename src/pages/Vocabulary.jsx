import { useState } from 'react'
import { useNotes } from '../contexts/NotesContext'

const TYPE_LABELS = { noun: 'Noun', verb: 'Verb', adjective: 'Adj', phrase: 'Phrase', other: 'Other' }
const TYPE_COLORS = {
  noun: 'bg-blue-50 text-blue-700',
  verb: 'bg-green-50 text-green-700',
  adjective: 'bg-amber-50 text-amber-700',
  phrase: 'bg-purple-50 text-purple-700',
  other: 'bg-gray-100 text-gray-500',
}

export default function Vocabulary() {
  const { lessons, cards, loading, error } = useNotes()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [lessonFilter, setLessonFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  if (loading) return <Spinner />
  if (error) return <div className="p-6 text-red-500 text-sm">Error: {error.message}</div>

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    return (
      (!q || c.word.toLowerCase().includes(q) || c.translation.toLowerCase().includes(q)) &&
      (typeFilter === 'all' || c.type === typeFilter) &&
      (lessonFilter === 'all' || c.lesson === Number(lessonFilter))
    )
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">Vocabulary</h1>

      {/* Filters */}
      <div className="space-y-2 mb-5">
        <input
          type="text"
          placeholder="Search words or translations…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            value={lessonFilter}
            onChange={e => setLessonFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All lessons</option>
            {lessons.map(l => <option key={l.number} value={l.number}>L{l.number}</option>)}
          </select>
          <span className="text-xs text-gray-400 self-center whitespace-nowrap">{filtered.length} words</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(card => (
          <WordRow
            key={card.id}
            card={card}
            isOpen={expanded === card.id}
            onToggle={() => setExpanded(expanded === card.id ? null : card.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No words match.</div>
        )}
      </div>
    </div>
  )
}

function WordRow({ card, isOpen, onToggle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900 text-sm">{card.word}</span>
          {card.info && <span className="text-gray-400 text-xs ml-1.5">{card.info}</span>}
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0 hidden sm:block">{card.translation}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[card.type] || TYPE_COLORS.other}`}>
          {TYPE_LABELS[card.type] || card.type}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-indigo-600 text-xs font-medium mt-2 mb-2">
            L{card.lesson} — {card.lessonTitle}
          </p>

          {/* Show translation prominently on mobile (hidden in list row) */}
          <p className="text-base font-medium text-gray-800 mb-2 sm:hidden">{card.translation}</p>

          {card.notes?.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-0.5 mb-3">
              {card.notes.map((n, i) => (
                <li key={i} className="flex gap-1.5 text-xs">
                  <span className="text-gray-300 flex-shrink-0">·</span>
                  <span dangerouslySetInnerHTML={{ __html: renderInline(n) }} />
                </li>
              ))}
            </ul>
          )}

          {card.example && (
            <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
              <p className="text-gray-800 italic">{card.example}</p>
              {card.exampleTranslation && (
                <p className="text-gray-500 text-xs mt-1">{card.exampleTranslation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function renderInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
