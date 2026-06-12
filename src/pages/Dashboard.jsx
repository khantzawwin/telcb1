import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, collection, query, orderBy, startAt, endAt, getDocs } from 'firebase/firestore'
import { documentId } from 'firebase/firestore'
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
  const todayTopic = grammarTopics[Math.floor(Date.now() / 86400000) % (grammarTopics.length || 1)]

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Hallo, {firstName}!</h1>
        <p className="text-base text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Session CTA */}
      <div className="bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white mb-6">
        <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1.5 capitalize">
          {slot} session
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          {sessionAvailable
            ? `${Math.min(stats.due + stats.new, 20)} cards ready`
            : 'Session complete ✓'}
        </h2>
        <p className="text-indigo-200 text-base mb-5">
          {sessionAvailable
            ? `${stats.due} due for review · ${stats.new} new`
            : 'Great work! Come back for your next session.'}
        </p>
        {sessionAvailable && (
          <Link
            to="/flashcards"
            className="inline-block bg-white text-indigo-700 font-semibold text-base px-6 py-3 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all"
          >
            Start Flashcards →
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} icon={<BookIcon />} iconBg="bg-indigo-100" iconColor="text-indigo-600" />
        <StatCard label="Due today" value={stats.due} icon={<ClockIcon />} iconBg="bg-amber-100" iconColor="text-amber-600" />
        <StatCard label="New" value={stats.new} icon={<SparkleIcon />} iconBg="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Grammar + Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Grammar of the Day</p>
            <Link to="/grammar" className="text-sm text-indigo-600 font-medium">Practice →</Link>
          </div>
          {todayTopic ? (
            <p className="font-semibold text-gray-900 text-base leading-snug">{todayTopic.title}</p>
          ) : (
            <p className="text-base text-gray-400">No grammar topics yet.</p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Today's Sessions</p>
          <div className="flex gap-3">
            <SessionBadge label="Morning" done={sessionDone.morning} />
            <SessionBadge label="Evening" done={sessionDone.evening} />
          </div>
        </div>
      </div>

      {/* Activity heatmap */}
      <ActivityHeatmap uid={user.uid} />
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 text-center">
      <div className={`w-10 h-10 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
        <span className={`w-5 h-5 ${iconColor}`}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function SessionBadge({ label, done }) {
  return (
    <div className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-base font-medium ${
      done ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      <span className="text-lg">{done ? '✓' : '○'}</span>
      {label}
    </div>
  )
}

// ── Activity Heatmap ─────────────────────────────────────────────────────────

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ActivityHeatmap({ uid }) {
  const [activityMap, setActivityMap] = useState({})
  const [heatLoading, setHeatLoading] = useState(true)

  // Build the 91-day grid anchored to today (local date, not UTC)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the Monday at or before (today - 90 days)
  const windowStart = new Date(today)
  windowStart.setDate(today.getDate() - 90)
  const dow = windowStart.getDay() // 0=Sun
  const toMon = dow === 0 ? 6 : dow - 1
  windowStart.setDate(windowStart.getDate() - toMon)

  // Build weeks array: each week = array of 7 Date objects
  const weeks = []
  const cursor = new Date(windowStart)
  while (cursor <= today) {
    const week = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Use local date strings so Firestore keys (also local) match correctly
  const fromStr = localDateStr(windowStart)
  const toStr = localDateStr(today)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const snap = await getDocs(
          query(
            collection(db, 'users', uid, 'sessions'),
            orderBy(documentId()),
            startAt(fromStr),
            endAt(toStr)
          )
        )
        if (cancelled) return
        const map = {}
        snap.forEach(d => {
          const data = d.data()
          map[d.id] = (
            (data.morning?.completed    ? 1 : 0) +
            (data.evening?.completed    ? 1 : 0) +
            (data.verben?.completed     ? 1 : 0) +
            (data.connectors?.completed ? 1 : 0) +
            (data.writing?.completed    ? 1 : 0)
          )
        })
        setActivityMap(map)
      } catch {
        // silently ignore — heatmap is decorative
      } finally {
        if (!cancelled) setHeatLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [uid, fromStr, toStr])

  // Month labels: detect when month changes across weeks
  const monthLabels = weeks.map((week, wi) => {
    const firstDay = week[0]
    const prevWeekFirst = wi > 0 ? weeks[wi - 1][0] : null
    if (!prevWeekFirst || firstDay.getMonth() !== prevWeekFirst.getMonth()) {
      return firstDay.toLocaleDateString('en-GB', { month: 'short' })
    }
    return null
  })

  const DAY_LABELS = ['M', '', 'W', '', 'F', '', 'S']

  function cellColor(dateStr) {
    if (dateStr > toStr) return 'bg-transparent'
    const count = activityMap[dateStr] || 0
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-indigo-200'
    if (count <= 4) return 'bg-indigo-400'
    return 'bg-indigo-600'
  }

  function cellTitle(day, dateStr) {
    if (dateStr > toStr) return ''
    const count = activityMap[dateStr] || 0
    const label = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    return count === 0 ? `${label}: no activity` : `${label}: ${count}/5 activities completed`
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Study Activity</p>
        {!heatLoading && (
          <p className="text-xs text-gray-400">
            {Object.values(activityMap).reduce((a, b) => a + b, 0)} activities · last 3 months
          </p>
        )}
      </div>

      {heatLoading ? (
        <div className="flex gap-1">
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="w-3 h-3 rounded-sm bg-gray-100 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-0">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 ml-5">
              {weeks.map((_, wi) => (
                <div key={wi} className="w-3 text-[10px] text-gray-400 leading-none overflow-visible whitespace-nowrap">
                  {monthLabels[wi] || ''}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-1 mr-1">
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="w-4 h-3 flex items-center">
                    <span className="text-[10px] text-gray-400 leading-none">{label}</span>
                  </div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => {
                    const dateStr = localDateStr(day)
                    const isFuture = dateStr > toStr
                    return (
                      <div
                        key={di}
                        title={cellTitle(day, dateStr)}
                        className={`w-3 h-3 rounded-sm transition-colors ${
                          isFuture ? 'bg-transparent' : cellColor(dateStr)
                        } ${!isFuture ? 'cursor-default' : ''}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 ml-5">
              <span className="text-[10px] text-gray-400">Less</span>
              {['bg-gray-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-gray-400">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function BookIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}
