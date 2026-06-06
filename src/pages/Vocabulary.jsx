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
  if (error) return <div className="p-6 text-red-500 text-base">Error: {error.message}</div>

  const filtered = cards.filter(c => {
    const q = search.toLowerCase()
    return (
      (!q || c.word.toLowerCase().includes(q) || c.translation.toLowerCase().includes(q)) &&
      (typeFilter === 'all' || c.type === typeFilter) &&
      (lessonFilter === 'all' || c.lesson === Number(lessonFilter))
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-7">Vocabulary</h1>

      {/* Filters */}
      <div className="space-y-3 mb-7">
        <input
          type="text"
          placeholder="Search words or translations…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-5 py-3.5 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            value={lessonFilter}
            onChange={e => setLessonFilter(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All lessons</option>
            {lessons.map(l => <option key={l.number} value={l.number}>L{l.number}</option>)}
          </select>
          <span className="text-sm text-gray-400 self-center whitespace-nowrap">{filtered.length} words</span>
        </div>
      </div>

      {/* 2-column grid on wider screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {filtered.map(card => (
          <WordRow
            key={card.id}
            card={card}
            isOpen={expanded === card.id}
            onToggle={() => setExpanded(expanded === card.id ? null : card.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400 text-base">No words match.</div>
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
        className="w-full flex items-center gap-3 px-5 py-4 text-left active:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900 text-base">{card.word}</span>
          {card.info && <span className="text-gray-400 text-sm ml-2">{card.info}</span>}
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0 hidden sm:block">{card.translation}</span>
        <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[card.type] || TYPE_COLORS.other}`}>
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
        <div className="px-5 pb-5 border-t border-gray-100">
          <p className="text-indigo-600 text-sm font-medium mt-3 mb-2">
            L{card.lesson} — {card.lessonTitle}
          </p>

          {/* Show translation prominently on mobile */}
          <p className="text-lg font-medium text-gray-800 mb-3 sm:hidden">{card.translation}</p>

          {card.notes?.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              {card.notes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gray-300 flex-shrink-0">·</span>
                  <span dangerouslySetInnerHTML={{ __html: renderInline(n) }} />
                </li>
              ))}
            </ul>
          )}

          {card.example && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-base">
              <p className="text-gray-800 italic">{card.example}</p>
              {card.exampleTranslation && (
                <p className="text-gray-500 text-sm mt-1.5">{card.exampleTranslation}</p>
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
