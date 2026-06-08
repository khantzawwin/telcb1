import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { calculateNextReview, selectSessionCards, getTodayKey, getSessionSlot } from '../utils/srs'

const RATINGS = [
  { value: 0, label: 'Again',  sublabel: 'Forgot',    bg: 'bg-red-500',    active: 'active:bg-red-600' },
  { value: 1, label: 'Hard',   sublabel: 'Difficult', bg: 'bg-orange-400', active: 'active:bg-orange-500' },
  { value: 2, label: 'Good',   sublabel: 'Recalled',  bg: 'bg-green-500',  active: 'active:bg-green-600' },
  { value: 3, label: 'Easy',   sublabel: 'Perfect',   bg: 'bg-indigo-600', active: 'active:bg-indigo-700' },
]

const TTS_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window

function cancelSpeech() {
  if (TTS_SUPPORTED) window.speechSynthesis.cancel()
}

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
    cancelSpeech()
    const sessionCards = selectSessionCards(cards, progressMap, 20)
    setSession(sessionCards)
    setCardIndex(0)
    setFlipped(false)
    setResults([])
    setSessionComplete(false)
  }

  const handleRate = async (rating) => {
    cancelSpeech()
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
  const progress = (cardIndex + 1) / session.length
  const remaining = session.length - cardIndex

  return (
    /*
     * Height strategy:
     *   Mobile:  100dvh minus app top-bar (~60px) and bottom-nav (~56px)
     *   Desktop: full 100dvh (sidebar is horizontal, no top/bottom bars)
     * Using dvh so the height tracks the visible viewport as the browser
     * address bar shows/hides, preventing any scroll on mobile.
     */
    <div className="flex flex-col max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-6
                    h-[calc(100dvh-116px)] md:h-dvh overflow-hidden">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-3 flex-shrink-0">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-500 tabular-nums whitespace-nowrap">
          {remaining} left
        </span>
      </div>

      {/* Card — min-h-0 lets it shrink when content is short */}
      <div
        className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm flex flex-col overflow-hidden cursor-pointer select-none mb-3 active:shadow-none transition-shadow"
        onClick={() => !flipped && setFlipped(true)}
      >
        {/* Colored top bar */}
        <div className={`h-1 flex-shrink-0 ${flipped ? 'bg-indigo-500' : 'bg-gray-200'} transition-colors duration-300`} />

        {/* Scrollable inner — if example is long on small phones it scrolls inside the card */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-5 sm:p-10">
          {/* Type badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 uppercase tracking-wider mb-6">
            {card.type} · L{card.lesson}
          </span>

          {!flipped ? (
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-1">{card.word}</p>
              {card.info && <p className="text-gray-400 text-base mb-2">{card.info}</p>}
              <div className="flex justify-center mt-3 mb-5">
                <SpeakerButton text={card.word} />
              </div>
              <div className="inline-flex items-center gap-1.5 text-gray-400 text-sm bg-gray-100 px-4 py-2 rounded-full">
                <TapIcon />
                tap to reveal
              </div>
            </div>
          ) : (
            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-3 mb-2">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{card.word}</p>
                <SpeakerButton text={card.word} />
              </div>
              <p className="text-2xl sm:text-3xl font-semibold text-indigo-600 mb-5">{card.translation}</p>
              {card.example && (
                <div className="bg-slate-50 rounded-2xl px-4 py-4 text-left max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Beispiel</span>
                    <SpeakerButton text={card.example} size="sm" />
                  </div>
                  <p className="text-base text-gray-700 italic leading-relaxed">{card.example}</p>
                  {card.exampleTranslation && (
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{card.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating buttons */}
      <div className="flex-shrink-0">
        {flipped ? (
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map(r => (
              <button
                key={r.value}
                onClick={() => handleRate(r.value)}
                className={`py-3.5 sm:py-4 rounded-2xl ${r.bg} ${r.active} text-white transition-all active:scale-[0.97]`}
              >
                <span className="block text-sm font-bold">{r.label}</span>
                <span className="block text-xs opacity-75 mt-0.5">{r.sublabel}</span>
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setFlipped(true) }}
            className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-2xl active:bg-indigo-700 transition-colors"
          >
            Show answer
          </button>
        )}
      </div>
    </div>
  )
}

// ── Speaker button ────────────────────────────────────────────────────────────

function SpeakerButton({ text, size = 'md' }) {
  const [speaking, setSpeaking] = useState(false)

  if (!TTS_SUPPORTED) return null

  const handleClick = (e) => {
    e.stopPropagation()
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.85
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const sizeClass = size === 'sm' ? 'w-8 h-8 min-w-[2rem]' : 'w-10 h-10 min-w-[2.5rem]'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={handleClick}
      aria-label={speaking ? 'Stop audio' : 'Listen in German'}
      className={`${sizeClass} flex items-center justify-center rounded-full transition-all flex-shrink-0
        ${speaking
          ? 'bg-indigo-100 text-indigo-600 scale-110'
          : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'
        }`}
    >
      {speaking ? <SpeakerWaveIcon className={iconSize} /> : <SpeakerIcon className={iconSize} />}
    </button>
  )
}

function SpeakerIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  )
}

function SpeakerWaveIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06zM15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
    </svg>
  )
}

// ── Screens ───────────────────────────────────────────────────────────────────

function StartScreen({ slot, dueCount, onStart }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] md:min-h-screen px-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🃏</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} Session</h2>
        <p className="text-gray-400 mb-8 text-base">{dueCount} cards ready to review</p>
        <button
          onClick={onStart}
          className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          Start Session
        </button>
      </div>
    </div>
  )
}

function SessionAlreadyDone({ slot, onAnyway }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] md:min-h-screen px-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{slot} session done!</h2>
        <p className="text-gray-400 mb-8 text-base">Come back later for your next session.</p>
        <button
          onClick={onAnyway}
          className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-4 rounded-2xl text-base hover:border-indigo-300 hover:text-indigo-600 active:scale-[0.98] transition-all"
        >
          Practice anyway
        </button>
      </div>
    </div>
  )
}

function CompletionScreen({ total, correct, slot }) {
  const pct = Math.round((correct / total) * 100)
  const isPerfect = correct === total
  const isGood = pct >= 70

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] md:min-h-screen px-6">
      <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-sm w-full">
        <div className={`w-20 h-20 ${isPerfect ? 'bg-green-100' : isGood ? 'bg-indigo-100' : 'bg-amber-100'} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
          <span className="text-4xl">{isPerfect ? '🎉' : isGood ? '💪' : '📖'}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Session complete!</h2>
        <p className="text-gray-400 mb-8 text-base">{correct} of {total} cards correct</p>

        {/* Score ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="46" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="56" cy="56" r="46" fill="none"
              stroke={isPerfect ? '#22c55e' : isGood ? '#6366f1' : '#f59e0b'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - pct / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{pct}%</span>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          {slot === 'morning' ? 'Evening session available after 14:00.' : 'See you tomorrow!'}
        </p>
      </div>
    </div>
  )
}

function TapIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  )
}
