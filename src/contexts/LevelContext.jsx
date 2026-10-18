import { createContext, useCallback, useContext, useState } from 'react'

// B2 and B1 are kept fully apart: Vocab, flashcards, Grammar and Home only
// show the chosen level. The choice is remembered on this device; B2 is the
// default because that's the exam being prepared for now.
const KEY = 'telc.level'
const LevelContext = createContext(null)

function loadLevel() {
  try { return localStorage.getItem(KEY) === 'B1' ? 'B1' : 'B2' } catch { return 'B2' }
}

export function LevelProvider({ children }) {
  const [level, setLevelState] = useState(loadLevel)

  const setLevel = useCallback(next => {
    setLevelState(next)
    try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  }, [])

  return <LevelContext.Provider value={{ level, setLevel }}>{children}</LevelContext.Provider>
}

export const useLevel = () => useContext(LevelContext)

// Firestore session keys: B1 keeps its old names so history stays intact,
// B2 gets its own (b2_morning, b2_vergangenheit …).
export const sessionKeyFor = (level, key) => (level === 'B2' ? `b2_${key}` : key)
