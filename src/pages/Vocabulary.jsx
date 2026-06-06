import { useState } from 'react'
import { useNotes } from '../contexts/NotesContext'

const TYPE_LABELS = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  phrase: 'Phrase',
  other: 'Other',
}

const TYPE_COLORS = {
  noun: 'bg-blue-50 text-blue-700',
  verb: 'bg-green-50 text-green-700',
  adjective: 'bg-amber-50 text-amber-700',
  phrase: 'bg-purple-50 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
}

export default function Vocabulary() {
  const { lessons, cards, loading, error } = useNotes()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [lessonFilter, setLessonFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Loading…</div>
  if (error) return <div className="p-8 text-red-500">Error loading notes: {error.message}</div>

  const lessonOptions = lessons.map(l => ({ value: l.number, label: `L${l.number} — ${l.title}` }))

  const filtered = cards.filter(c => {
    const matchSearch = !search || c.word.toLowerCase().includes(search.toLowerCase()) || c.translation.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || c.type === typeFilter
    const matchLesson = lessonFilter === 'all' || c.lesson === Number(lessonFilter)
    return matchSearch && matchType && matchLesson
  })

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vocabulary</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search words…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52"
        />

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          value={lessonFilter}
          onChange={e => setLessonFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All lessons</option>
          {lessonOptions.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} words</span>
      </div>

      {/* Word list */}
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
          <div className="text-center py-12 text-gray-400">No words match your filters.</div>
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
        className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900">{card.word}</span>
          {card.info && <span className="text-gray-400 text-sm ml-2">{card.info}</span>}
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0">{card.translation}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[card.type] || TYPE_COLORS.other}`}>
          {TYPE_LABELS[card.type] || card.type}
        </span>
        <span className="text-gray-400 flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pt-0 border-t border-gray-100">
          <div className="text-xs text-indigo-600 font-medium mb-2">
            Lektion {card.lesson} — {card.lessonTitle}
          </div>

          {card.notes?.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-0.5 mb-3">
              {card.notes.map((n, i) => (
                <li key={i} className="flex gap-1">
                  <span className="text-gray-400">·</span>
                  <span dangerouslySetInnerHTML={{ __html: formatMarkdown(n) }} />
                </li>
              ))}
            </ul>
          )}

          {card.example && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
              <p className="text-gray-900 italic">{card.example}</p>
              {card.exampleTranslation && (
                <p className="text-gray-500 mt-1">{card.exampleTranslation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}
