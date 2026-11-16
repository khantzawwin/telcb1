import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { useLevel } from '../contexts/LevelContext'
import { useReviewStats } from '../utils/useReviewStats'

const TYPE_LABELS = { noun: 'Noun', verb: 'Verb', adjective: 'Adj', phrase: 'Phrase', other: 'Other' }
const TYPE_COLORS = {
  noun: 'bg-blue-50 text-blue-700',
  verb: 'bg-green-50 text-green-700',
  adjective: 'bg-amber-50 text-amber-700',
  phrase: 'bg-purple-50 text-purple-700',
  other: 'bg-gray-100 text-gray-500',
}

export default function Vocabulary() {
  // Only the current level's words (B1 or B2)
  const { lessons, cards, loading, error } = useNotes()
  const { level } = useLevel()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [lessonFilter, setLessonFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [view, setView] = useState(() => readPref('vocabView', 'cards'))
  const [sort, setSort] = useState(() => readPref('vocabSort', 'notes'))
  const changeView = v => { setView(v); writePref('vocabView', v) }
  const changeSort = v => { setSort(v); writePref('vocabSort', v) }

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
  // 'notes' keeps the order of the notes file
  if (sort === 'newest') filtered.sort((a, b) => (b.added || '').localeCompare(a.added || ''))
  if (sort === 'oldest') filtered.sort((a, b) => (a.added || '').localeCompare(b.added || ''))
  if (sort === 'az') filtered.sort((a, b) => bare(a.word).localeCompare(bare(b.word), 'de'))

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-7">{level} Wortschatz</h1>

      <ReviewCard cards={cards} level={level} />

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
            className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            value={lessonFilter}
            onChange={e => setLessonFilter(e.target.value)}
            className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-xl text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All {level === 'B2' ? 'classes' : 'lessons'}</option>
            {lessons.map(l => <option key={l.number} value={l.number}>{l.title}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex bg-gray-100 rounded-xl p-1" role="group" aria-label="View">
            {[['cards', 'Cards'], ['table', 'Table']].map(([k, label]) => (
              <button
                key={k}
                onClick={() => changeView(k)}
                aria-pressed={view === k}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => changeSort(e.target.value)}
            aria-label="Sort"
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="notes">Notes order</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A–Z</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto whitespace-nowrap">{filtered.length} words</span>
        </div>
      </div>

      {view === 'table' ? (
        <WordTable cards={filtered} expanded={expanded} setExpanded={setExpanded} />
      ) : (
      /* 2-column grid on wider screens */
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
          <div className="col-span-2 text-center py-16 text-gray-500 text-base">No words match.</div>
        )}
      </div>
      )}
    </div>
  )
}

// Today's flashcard review — opens the SRS session at /vocabulary/review
function ReviewCard({ cards, level }) {
  const { user } = useAuth()
  const { stats, slot, sessionAvailable, loading } = useReviewStats(user, cards, level)
  const ready = Math.min(stats.due + stats.new, 20)

  return (
    <div className="bg-indigo-600 rounded-3xl p-6 sm:p-7 text-white mb-7 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1 capitalize">
          {level} · {slot} flashcards
        </p>
        <h2 className="text-2xl font-bold">
          {loading ? '…' : sessionAvailable ? `${ready} cards ready` : 'Review complete ✓'}
        </h2>
        {!loading && (
          <p className="text-indigo-200 text-sm mt-1">
            {sessionAvailable
              ? `${stats.due} due · ${stats.new} new`
              : 'Come back for the next session.'}
          </p>
        )}
      </div>
      {!loading && (sessionAvailable ? (
        <Link
          to="/vocabulary/review"
          className="self-start sm:self-auto bg-white text-indigo-700 font-semibold text-base px-6 py-3 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all"
        >
          Start review →
        </Link>
      ) : (
        <Link to="/vocabulary/review?anyway=1" className="self-start sm:self-auto text-indigo-100 text-sm font-medium hover:text-white py-2">
          Review anyway →
        </Link>
      ))}
    </div>
  )
}

// Table view: one row per word with the date it was added. Click a row for details.
function WordTable({ cards, expanded, setExpanded }) {
  if (cards.length === 0) return <div className="text-center py-16 text-gray-500 text-base">No words match.</div>
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
            <th className="px-5 py-3 font-semibold whitespace-nowrap">Added</th>
            <th className="px-5 py-3 font-semibold">Word</th>
            <th className="px-5 py-3 font-semibold">Meaning</th>
            <th className="px-5 py-3 font-semibold hidden md:table-cell">Type</th>
            <th className="px-5 py-3 font-semibold hidden lg:table-cell">Class</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => {
            const open = expanded === card.id
            return (
              <Fragment key={card.id}>
                <tr
                  onClick={() => setExpanded(open ? null : card.id)}
                  className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${open ? 'bg-indigo-50/40' : ''}`}
                >
                  <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap tabular-nums">{formatDate(card.added)}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{card.word}</td>
                  <td className="px-5 py-3 text-gray-600 text-sm">{card.translation}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${TYPE_COLORS[card.type] || TYPE_COLORS.other}`}>
                      {TYPE_LABELS[card.type] || card.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 hidden lg:table-cell">{card.lessonTitle}</td>
                </tr>
                {open && (
                  <tr className="border-b border-gray-100">
                    <td colSpan={5} className="px-5 pb-5"><WordDetails card={card} /></td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Sort "der Hund" under H, not D
const bare = w => w.replace(/^(der|die|das|sich)\s+/i, '')

function readPref(key, fallback) {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}
function writePref(key, value) {
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}

function WordRow({ card, isOpen, onToggle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left active:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-900 text-base">{card.word}</span>
          {card.info && <span className="text-gray-500 text-sm ml-2">{card.info}</span>}
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0 hidden sm:block">{card.translation}</span>
        <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[card.type] || TYPE_COLORS.other}`}>
          {TYPE_LABELS[card.type] || card.type}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <WordDetails card={card} />
        </div>
      )}
    </div>
  )
}

function WordDetails({ card }) {
  return (
    <>
      <p className="text-indigo-600 text-sm font-medium mt-3 mb-2">
        {card.lessonTitle}
        {card.added && <span className="text-gray-400 font-normal"> · added {formatDate(card.added)}</span>}
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
    </>
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
