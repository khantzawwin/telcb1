import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { calculateNextReview, selectSessionCards, getTodayKey, getSessionSlot } from '../utils/srs'

const RATINGS = [
  { value: 0, label: 'Again', sublabel: 'Forgot', bg: 'bg-red-50 active:bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  { value: 1, label: 'Hard', sublabel: 'Difficult', bg: 'bg-orange-50 active:bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  { value: 2, label: 'Good', sublabel: 'Recalled', bg: 'bg-green-50 active:bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  { value: 3, label: 'Easy', sublabel: 'Perfect', bg: 'bg-indigo-50 active:bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
]

export default function Flashcards() {
  const { user } = useAuth()
  const { cards, loading } = useNotes()
  const [session, setSession] = useState(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const [sessionComplete, setSessionComplete] = useState(false)
  const [progressMap, setProgressMap] = useState({})
  const [sessionDone, setSessionDone] = useState(false)
  const [loadingSession, setLoadingSession] = useState(true)

  const slot = getSessionSlot()
  const todayKey = getTodayKey()

  useEffect(() => {
    if (!user || !cards.length) return
    init()
  }, [user, cards])

  const init = async () => {
    try {
      const [progressDoc, sessionDoc] = await Promise.all([
        getDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress')),
        getDoc(doc(db, 'users', user.uid, 'sessions', todayKey)),
      ])
      const pMap = progressDoc.exists() ? progressDoc.data() : {}
      const sData = sessionDoc.exists() ? sessionDoc.data() : {}
      setProgressMap(pMap)
      setSessionDone(sData[slot]?.completed || false)
    } finally {
      setLoadingSession(false)
    }
  }

  const startSession = () => {
    const sessionCards = selectSessionCards(cards, progressMap, 20)
    setSession(sessionCards)
    setCardIndex(0)
    setFlipped(false)
    setResults([])
    setSessionComplete(false)
  }

  const handleRate = async (rating) => {
    const card = session[cardIndex]
    const current = progressMap[card.id] || {}
    const next = calculateNextReview(current, rating)
    const newMap = { ...progressMap, [card.id]: next }
    setProgressMap(newMap)

    const newResults = [...results, { cardId: card.id, rating }]
    setResults(newResults)

    await setDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress'), newMap, { merge: true })

    if (cardIndex + 1 >= session.length) {
      const correct = newResults.filter(r => r.rating >= 2).length
      await setDoc(doc(db, 'users', user.uid, 'sessions', todayKey), {
        [slot]: { completed: true, cardsReviewed: session.length, correct, completedAt: new Date().toISOString() }
      }, { merge: true })
      setSessionDone(true)
      setSessionComplete(true)
    } else {
      setCardIndex(i => i + 1)
      setFlipped(false)
    }
  }

  if (loading || loadingSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (sessionComplete) {
    const correct = results.filter(r => r.rating >= 2).length
    return <CompletionScreen total={session.length} correct={correct} slot={slot} />
  }

  if (sessionDone && !session) {
    return <SessionAlreadyDone slot={slot} onAnyway={startSession} />
  }

  if (!session) {
    const dueCount = cards.filter(c => {
      const p = progressMap[c.id]
      return !p || new Date(p.nextReview) <= new Date()
    }).length
    return <StartScreen slot={slot} dueCount={Math.min(dueCount, 20)} onStart={startSession} />
  }

  const card = session[cardIndex]
  const progress = cardIndex / session.length

  return (
    // Full-height session view — important on mobile
    <div className="flex flex-col h-[calc(100vh-56px)] md:h-screen max-w-lg mx-auto px-4 py-4 sm:py-8">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 tabular-nums">{cardIndex}/{session.length}</span>
      </div>

      {/* Card — takes most of the space */}
      <div
        className="flex-1 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 sm:p-10 cursor-pointer shadow-sm select-none mb-4 active:bg-gray-50 transition-colors"
        onClick={() => !flipped && setFlipped(true)}
      >
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">
          {card.type} · L{card.lesson}
        </div>

        {!flipped ? (
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">{card.word}</p>
            {card.info && <p className="text-gray-400 text-sm mb-6">{card.info}</p>}
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm mt-4 bg-gray-100 px-4 py-2 rounded-full">
              <span>tap to reveal</span>
            </div>
          </div>
        ) : (
          <div className="text-center w-full">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{card.word}</p>
            <p className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">{card.translation}</p>
            {card.example && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-left max-w-sm mx-auto mt-2">
                <p className="text-sm text-gray-700 italic leading-relaxed">{card.example}</p>
                {card.exampleTranslation && (
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{card.exampleTranslation}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons — large, thumb-friendly */}
      <div className="flex-shrink-0">
        {flipped ? (
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map(r => (
              <button
                key={r.value}
                onClick={() => handleRate(r.value)}
                className={`py-3.5 sm:py-4 rounded-xl border ${r.bg} ${r.text} ${r.border} transition-colors`}
              >
                <span className="block text-xs font-bold">{r.label}</span>
                <span className="block text-xs opacity-60 mt-0.5 hidden sm:block">{r.sublabel}</span>
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setFlipped(true)}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl active:bg-indigo-700 transition-colors"
          >
            Show answer
          </button>
        )}
      </div>
    </div>
  )
}

function StartScreen({ slot, dueCount, onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">🃏</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} Session</h2>
      <p className="text-gray-500 mb-8 text-sm">{dueCount} cards ready to review</p>
      <button
        onClick={onStart}
        className="bg-indigo-600 text-white font-semibold px-10 py-4 rounded-2xl text-base hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
      >
        Start Session
      </button>
    </div>
  )
}

function SessionAlreadyDone({ slot, onAnyway }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} session done!</h2>
      <p className="text-gray-500 mb-8 text-sm">Come back later for your next session.</p>
      <button onClick={onAnyway} className="text-sm text-indigo-600 underline">
        Practice anyway
      </button>
    </div>
  )
}

function CompletionScreen({ total, correct, slot }) {
  const pct = Math.round((correct / total) * 100)
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">{pct >= 80 ? '🎉' : '💪'}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Session complete!</h2>
      <p className="text-gray-500 mb-6 text-sm">{correct}/{total} correct</p>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-3 mb-2">
        <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-6">{pct}%</p>
      <p className="text-xs text-gray-400">
        {slot === 'morning' ? 'Evening session available after 14:00.' : 'See you tomorrow!'}
      </p>
    </div>
  )
}
