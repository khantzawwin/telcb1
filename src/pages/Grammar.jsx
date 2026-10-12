import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { groupTopics } from '../utils/grammarThemes'
import { findExercises } from '../utils/grammarExercises'
import { useGrammarToday } from '../utils/useGrammarToday'
import ListRow from '../components/ListRow'

const OPEN_KEY = 'grammar.openThemes'

function loadOpen() {
  try { return JSON.parse(localStorage.getItem(OPEN_KEY)) || [] } catch { return [] }
}

// One flat list of themes; tapping a theme expands its drill + topics in place.
// /grammar/:themeId and /grammar#themeId open (and scroll to) that theme.
export default function Grammar() {
  const { user } = useAuth()
  const { grammarTopics, loading } = useNotes()
  const { sessionDone, topicDone } = useGrammarToday(user)
  const { themeId } = useParams()
  const { hash } = useLocation()
  const target = themeId || hash.slice(1)
  const [open, setOpen] = useState(() => {
    const saved = loadOpen()
    return target && !saved.includes(target) ? [...saved, target] : saved
  })
  const themes = groupTopics(grammarTopics)

  useEffect(() => {
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(open)) } catch { /* ignore */ }
  }, [open])

  // Scroll to the theme we came back to
  useEffect(() => {
    if (!loading && target) document.getElementById(`theme-${target}`)?.scrollIntoView({ block: 'start' })
  }, [loading, target])

  const toggle = id => setOpen(o => (o.includes(id) ? o.filter(x => x !== id) : [...o, id]))

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Grammar</h1>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {themes.map(theme => {
            const isOpen = open.includes(theme.id)
            const count = theme.items.length + (theme.drill ? 1 : 0)
            const doneToday = (theme.drill && sessionDone(theme.drill.sessionKey)) || theme.items.some(t => topicDone(t.id))
            return (
              <div key={theme.id} id={`theme-${theme.id}`} className="scroll-mt-20">
                <button
                  onClick={() => toggle(theme.id)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center gap-3 bg-white shadow-sm px-5 py-4 text-left hover:bg-gray-50 transition-colors ${
                    isOpen ? 'rounded-t-2xl' : 'rounded-2xl'
                  }`}
                >
                  <svg
                    className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="flex-1 min-w-0 text-base font-semibold text-gray-900">{theme.title}</span>
                  {doneToday && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                      ✓ today
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-500 flex-shrink-0">{count}</span>
                </button>

                {isOpen && (
                  <div className="bg-slate-100 rounded-b-2xl px-3 py-3 space-y-2">
                    {theme.drill && (
                      <ListRow
                        to={theme.drill.to}
                        title={theme.drill.title || 'Mixed practice'}
                        done={sessionDone(theme.drill.sessionKey)}
                        tag="Drill"
                      />
                    )}
                    {theme.items.map(t => {
                      const exercises = findExercises(t.id)
                      return (
                        <ListRow
                          key={t.id}
                          to={`/grammar/topic/${t.id}`}
                          title={t.title}
                          done={topicDone(t.id)}
                          tag={exercises ? `${exercises.length} questions` : 'Read only'}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
