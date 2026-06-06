import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { getTodayKey, getSessionSlot, isDueForReview } from '../utils/srs'

export default function Dashboard() {
  const { user } = useAuth()
  const { cards, grammarTopics, loading } = useNotes()
  const [progress, setProgress] = useState({})
  const [sessionDone, setSessionDone] = useState({ morning: false, evening: false })
  const [stats, setStats] = useState({ due: 0, new: 0, total: 0 })

  useEffect(() => {
    if (!user || !cards.length) return
    loadProgress()
  }, [user, cards])

  const loadProgress = async () => {
    try {
      const progressDoc = await getDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress'))
      const sessionDoc = await getDoc(doc(db, 'users', user.uid, 'sessions', getTodayKey()))

      const progressMap = progressDoc.exists() ? progressDoc.data() : {}
      const sessionData = sessionDoc.exists() ? sessionDoc.data() : {}

      setProgress(progressMap)
      setSessionDone({
        morning: sessionData.morning?.completed || false,
        evening: sessionData.evening?.completed || false,
      })

      let due = 0
      let newCards = 0
      for (const card of cards) {
        const p = progressMap[card.id]
        if (!p) newCards++
        else if (isDueForReview(p)) due++
      }
      setStats({ due, new: newCards, total: cards.length })
    } catch (e) {
      console.error(e)
    }
  }

  const slot = getSessionSlot()
  const canDoMorning = !sessionDone.morning
  const canDoEvening = !sessionDone.evening
  const sessionAvailable = slot === 'morning' ? canDoMorning : canDoEvening
  const nextSlotLabel = slot === 'morning' ? 'morning' : 'evening'

  const firstName = user?.displayName?.split(' ')[0] || 'there'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading notes…</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hallo, {firstName}! 👋</h1>
        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Session card */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-6">
        <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-1">
          {nextSlotLabel} session
        </p>
        <h2 className="text-xl font-semibold mb-1">
          {sessionAvailable
            ? `${stats.due + Math.min(stats.new, 10)} cards ready`
            : 'Session complete ✓'}
        </h2>
        <p className="text-indigo-200 text-sm mb-4">
          {sessionAvailable
            ? `${stats.due} due for review · ${stats.new} new`
            : 'Come back for your next session later.'}
        </p>
        {sessionAvailable && (
          <Link
            to="/flashcards"
            className="inline-block bg-white text-indigo-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Start Flashcards →
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total words" value={stats.total} icon="📚" />
        <StatCard label="Due today" value={stats.due} icon="⏰" />
        <StatCard label="New cards" value={stats.new} icon="✨" />
      </div>

      {/* Grammar of the day */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Grammar of the Day</h3>
          <Link to="/grammar" className="text-sm text-indigo-600 hover:text-indigo-700">
            Practice →
          </Link>
        </div>
        {grammarTopics.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-1">Today's topic</p>
            <p className="font-medium text-gray-900">
              {grammarTopics[new Date().getDate() % grammarTopics.length]?.title}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No grammar topics loaded.</p>
        )}
      </div>

      {/* Sessions today */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Today's sessions</h3>
        <div className="flex gap-4">
          <SessionBadge label="Morning" done={sessionDone.morning} />
          <SessionBadge label="Evening" done={sessionDone.evening} />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function SessionBadge({ label, done }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
      done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      <span>{done ? '✓' : '○'}</span>
      {label}
    </div>
  )
}
