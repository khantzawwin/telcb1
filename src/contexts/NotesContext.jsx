import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { parseNotes, buildCardList, buildGrammarList } from '../utils/parseNotes'
import { useLevel } from './LevelContext'

const NotesContext = createContext(null)

// `lessons` and `cards` only contain the current level (B1 or B2).
// Notes grammar topics are B1 material; B2 grammar has its own pages.
export function NotesProvider({ children }) {
  const { level } = useLevel()
  const [allLessons, setAllLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/notes.md')
      .then(r => {
        if (!r.ok) throw new Error('Could not load notes.md')
        return r.text()
      })
      .then(text => setAllLessons(parseNotes(text)))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => {
    const lessons = allLessons.filter(l => l.level === level)
    return {
      lessons,
      cards: buildCardList(lessons),
      grammarTopics: buildGrammarList(allLessons.filter(l => l.level === 'B1')),
      loading,
      error,
    }
  }, [allLessons, level, loading, error])

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => useContext(NotesContext)
