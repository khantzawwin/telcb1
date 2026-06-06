import { createContext, useContext, useEffect, useState } from 'react'
import { parseNotes, buildCardList, buildGrammarList } from '../utils/parseNotes'

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const [lessons, setLessons] = useState([])
  const [cards, setCards] = useState([])
  const [grammarTopics, setGrammarTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/notes.md')
      .then(r => {
        if (!r.ok) throw new Error('Could not load notes.md')
        return r.text()
      })
      .then(text => {
        const parsed = parseNotes(text)
        setLessons(parsed)
        setCards(buildCardList(parsed))
        setGrammarTopics(buildGrammarList(parsed))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return (
    <NotesContext.Provider value={{ lessons, cards, grammarTopics, loading, error }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)
