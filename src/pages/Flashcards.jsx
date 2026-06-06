import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { calculateNextReview, selectSessionCards, getTodayKey, getSessionSlot } from '../utils/srs'

const RATINGS = [
  { value: 0, label: 'Again', color: 'bg-red-100 text-red-700 hover:bg-red-200', emoji: '✗' },
  { value: 1, label: 'Hard', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200', emoji: '~' },
  { value: 2, label: 'Good', color: 'bg-green-100 text-green-700 hover:bg-green-200', emoji: '✓' },
  { value: 3, label: 'Easy', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200', emoji: '★' },
]

export default function Flashcards() {
  const { user } = useAuth()
  const { cards, loading } = useNotes()
  const [session, setSession] = useState(null) // null = not started
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([]) // {cardId, rating}
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
    setLoadingSession(true)
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
    setResults(r => [...r, { cardId: card.id, rating }])

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress'), newMap, { merge: true })

    if (cardIndex + 1 >= session.length) {
      // Session done
      const correct = results.filter(r => r.rating >= 2).length + (rating >= 2 ? 1 : 0)
      const sessionRef = doc(db, 'users', user.uid, 'sessions', todayKey)
      await setDoc(sessionRef, {
        [slot]: {
          completed: true,
          cardsReviewed: session.length,
          correct,
          completedAt: new Date().toISOString(),
        }
      }, { merge: true })
      setSessionDone(true)
      setSessionComplete(true)
    } else {
      setCardIndex(i => i + 1)
      setFlipped(false)
    }
  }

  if (loading || loadingSession) {
    return <div className="flex items-center justify-center h-96 text-gray-400">Loading…</div>
  }

  if (sessionDone && !session) {
    return <SessionAlreadyDone slot={slot} onAnyway={startSession} />
  }

  if (!session) {
    const dueCount = cards.filter(c => {
      const p = progressMap[c.id]
      if (!p) return true
      return new Date(p.nextReview) <= new Date()
    }).length
    return <StartScreen slot={slot} dueCount={dueCount} onStart={startSession} />
  }

  if (sessionComplete) {
    const correct = results.filter(r => r.rating >= 2).length
    return <CompletionScreen total={session.length} correct={correct} slot={slot} />
  }

  const card = session[cardIndex]
  const progress = ((cardIndex) / session.length) * 100

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 flex-shrink-0">{cardIndex}/{session.length}</span>
      </div>

      {/* Card */}
      <div
        className="bg-white border border-gray-200 rounded-2xl min-h-64 flex flex-col items-center justify-center p-8 cursor-pointer shadow-sm mb-6 select-none"
        onClick={() => setFlipped(true)}
      >
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-4">
          {card.type} · L{card.lesson}
        </div>

        {!flipped ? (
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-2">{card.word}</p>
            {card.info && <p className="text-gray-400 text-sm">{card.info}</p>}
            <p className="text-gray-400 text-sm mt-6">tap to reveal</p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-3xl font-bold text-gray-900">{card.word}</p>
            <p className="text-xl text-indigo-600 font-medium">{card.translation}</p>
            {card.example && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left max-w-sm">
                <p className="text-sm text-gray-700 italic">{card.example}</p>
                {card.exampleTranslation && (
                  <p className="text-xs text-gray-400 mt-1">{card.exampleTranslation}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map(r => (
            <button
              key={r.value}
              onClick={() => handleRate(r.value)}
              className={`py-3 rounded-xl text-sm font-semibold transition-colors ${r.color}`}
            >
              <span className="block text-lg">{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>
      )}

      {!flipped && (
        <p className="text-center text-sm text-gray-400">
          Rate yourself after revealing the answer
        </p>
      )}
    </div>
  )
}

function StartScreen({ slot, dueCount, onStart }) {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-5xl mb-6">🃏</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} Session</h2>
      <p className="text-gray-500 mb-8">
        {dueCount} cards due · up to 20 per session
      </p>
      <button
        onClick={onStart}
        className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Start Session
      </button>
    </div>
  )
}

function SessionAlreadyDone({ slot, onAnyway }) {
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-5xl mb-6">✅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} session done!</h2>
      <p className="text-gray-500 mb-8">Great work. Come back later for your next session.</p>
      <button
        onClick={onAnyway}
        className="text-sm text-indigo-600 hover:text-indigo-700 underline"
      >
        Practice anyway
      </button>
    </div>
  )
}

function CompletionScreen({ total, correct, slot }) {
  const pct = Math.round((correct / total) * 100)
  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-5xl mb-6">{pct >= 80 ? '🎉' : '💪'}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Session complete!</h2>
      <p className="text-gray-500 mb-6">
        {correct}/{total} correct ({pct}%)
      </p>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">
        {slot === 'morning' ? 'Evening session available after 14:00.' : 'See you tomorrow!'}
      </p>
    </div>
  )
}
