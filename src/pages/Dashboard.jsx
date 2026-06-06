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
  const [sessionDone, setSessionDone] = useState({ morning: false, evening: false })
  const [stats, setStats] = useState({ due: 0, new: 0, total: 0 })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!user || !cards.length) return
    loadProgress()
  }, [user, cards])

  const loadProgress = async () => {
    try {
      const [progressDoc, sessionDoc] = await Promise.all([
        getDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress')),
        getDoc(doc(db, 'users', user.uid, 'sessions', getTodayKey())),
      ])
      const progressMap = progressDoc.exists() ? progressDoc.data() : {}
      const sessionData = sessionDoc.exists() ? sessionDoc.data() : {}

      setSessionDone({
        morning: sessionData.morning?.completed || false,
        evening: sessionData.evening?.completed || false,
      })

      let due = 0, newCards = 0
      for (const card of cards) {
        const p = progressMap[card.id]
        if (!p) newCards++
        else if (isDueForReview(p)) due++
      }
      setStats({ due, new: newCards, total: cards.length })
    } finally {
      setLoadingData(false)
    }
  }

  const slot = getSessionSlot()
  const sessionAvailable = slot === 'morning' ? !sessionDone.morning : !sessionDone.evening
  const firstName = user?.displayName?.split(' ')[0] || 'there'
  const todayTopic = grammarTopics[new Date().getDate() % (grammarTopics.length || 1)]

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hallo, {firstName}! 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Session CTA */}
      <div className="bg-indigo-600 rounded-2xl p-5 sm:p-6 text-white mb-5">
        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1 capitalize">
          {slot} session
        </p>
        <h2 className="text-lg sm:text-xl font-bold mb-1">
          {sessionAvailable
            ? `${Math.min(stats.due + stats.new, 20)} cards ready`
            : 'Session complete ✓'}
        </h2>
        <p className="text-indigo-200 text-sm mb-4">
          {sessionAvailable
            ? `${stats.due} due for review · ${stats.new} new`
            : 'Great work! Come back for your next session.'}
        </p>
        {sessionAvailable && (
          <Link
            to="/flashcards"
            className="inline-block bg-white text-indigo-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all"
          >
            Start Flashcards →
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total" value={stats.total} icon="📚" />
        <StatCard label="Due today" value={stats.due} icon="⏰" />
        <StatCard label="New" value={stats.new} icon="✨" />
      </div>

      {/* Grammar of the day */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grammar of the Day</p>
          <Link to="/grammar" className="text-xs text-indigo-600 font-medium">Practice →</Link>
        </div>
        {todayTopic ? (
          <p className="font-semibold text-gray-900 text-sm">{todayTopic.title}</p>
        ) : (
          <p className="text-sm text-gray-400">No grammar topics yet.</p>
        )}
      </div>

      {/* Session status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Today's sessions</p>
        <div className="flex gap-3">
          <SessionBadge label="Morning" done={sessionDone.morning} />
          <SessionBadge label="Evening" done={sessionDone.evening} />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  )
}

function SessionBadge({ label, done }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
      done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      <span className="text-base">{done ? '✓' : '○'}</span>
      {label}
    </div>
  )
}
