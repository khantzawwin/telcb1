import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, startAt, endAt, getDocs } from 'firebase/firestore'
import { documentId } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useTodayPlan } from '../utils/useTodayPlan'

export default function Dashboard() {
  const { user } = useAuth()
  const { tasks, review, loading } = useTodayPlan()
  const { stats } = review
  const firstName = user?.displayName?.split(' ')[0] || 'there'
  const doneCount = tasks.filter(t => t.done).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Hallo, {firstName}!</h1>
        <p className="text-base text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Today — one tap into each task */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-gray-900">Today</h2>
          <span className={`text-sm font-semibold ${doneCount === tasks.length ? 'text-green-700' : 'text-gray-500'}`}>
            {doneCount} / {tasks.length} done
          </span>
        </div>
        <ul className="divide-y divide-gray-100">
          {tasks.map(task => (
            <li key={task.key}>
              <Link
                to={task.to}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    task.done ? 'bg-green-100 text-green-700' : 'border-2 border-gray-300'
                  }`}
                  aria-label={task.done ? 'Done' : 'Not done yet'}
                >
                  {task.done && '✓'}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-base font-semibold ${task.done ? 'text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                  <span className="block text-sm text-gray-500 truncate">{task.detail}</span>
                </span>
                <span className={`text-sm font-semibold flex-shrink-0 ${task.done ? 'text-gray-500' : 'text-indigo-600'}`}>
                  {task.done ? 'Again' : 'Start'} ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Words" value={stats.total} />
        <StatCard label="Due" value={stats.due} />
        <StatCard label="New" value={stats.new} />
      </div>

      {/* Activity heatmap */}
      <ActivityHeatmap uid={user.uid} />
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3.5 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
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
            (data.werden?.completed     ? 1 : 0) +
            (data.vergangenheit?.completed ? 1 : 0) +
            (data.konjunktiv?.completed ? 1 : 0) +
            (data.writing?.completed    ? 1 : 0) +
            (data.sprechen?.completed   ? 1 : 0)
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
          <p className="text-xs text-gray-500">
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
                <div key={wi} className="w-3 text-[10px] text-gray-500 leading-none overflow-visible whitespace-nowrap">
                  {monthLabels[wi] || ''}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {/* Day-of-week labels */}
              <div className="flex flex-col gap-1 mr-1">
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="w-4 h-3 flex items-center">
                    <span className="text-[10px] text-gray-500 leading-none">{label}</span>
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
              <span className="text-[10px] text-gray-500">Less</span>
              {['bg-gray-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600'].map(c => (
                <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-gray-500">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Inline SVG icons ─────────────────────────────────────────────────────────
