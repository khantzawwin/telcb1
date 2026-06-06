import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { getExercisesForTopic, matchTopicId } from '../utils/grammarExercises'
import { getTodayKey } from '../utils/srs'

export default function Grammar() {
  const { user } = useAuth()
  const { grammarTopics, loading } = useNotes()
  const [topicIndex, setTopicIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [grammarDone, setGrammarDone] = useState(false)
  const [ruleOpen, setRuleOpen] = useState(false)
  const todayKey = getTodayKey()

  useEffect(() => {
    if (!user || !grammarTopics.length) return
    loadState()
  }, [user, grammarTopics])

  const loadState = async () => {
    const snap = await getDoc(doc(db, 'users', user.uid, 'grammar', todayKey))
    const defaultIdx = Math.floor(Date.now() / 86400000) % grammarTopics.length
    if (snap.exists()) {
      setTopicIndex(snap.data().topicIndex ?? defaultIdx)
      setGrammarDone(snap.data().done || false)
    } else {
      setTopicIndex(defaultIdx)
    }
  }

  const switchTopic = (delta) => {
    setTopicIndex(i => (i + delta + grammarTopics.length) % grammarTopics.length)
    setAnswers({})
    setChecked(false)
    setRuleOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!grammarTopics.length) {
    return <div className="p-6 text-gray-500 text-sm">No grammar topics found in notes.</div>
  }

  const topic = grammarTopics[topicIndex]
  const exercises = getExercisesForTopic(topic.id) || getExercisesForTopic(matchTopicId(topic.id))
  const allAnswered = exercises ? exercises.every(ex => answers[ex.id] !== undefined) : false
  const score = exercises ? exercises.filter(ex => answers[ex.id] === ex.answer).length : 0

  const handleCheck = async () => {
    if (!exercises) return
    setChecked(true)
    const correct = exercises.filter(ex => answers[ex.id] === ex.answer).length
    await setDoc(doc(db, 'users', user.uid, 'grammar', todayKey), {
      topicIndex, done: true, correct, total: exercises.length,
      completedAt: new Date().toISOString(),
    }, { merge: true })
    setGrammarDone(true)
  }

  const handleReset = () => {
    setAnswers({})
    setChecked(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-1.5">
            Grammar Practice
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{topic.title}</h1>
          <p className="text-sm text-gray-400 mt-1">L{topic.lesson} · {topic.lessonTitle}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0 pt-1">
          <button
            onClick={() => switchTopic(-1)}
            aria-label="Previous topic"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => switchTopic(1)}
            aria-label="Next topic"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Topic dots */}
      <div className="flex gap-1 mb-8">
        {grammarTopics.map((_, i) => (
          <button
            key={i}
            onClick={() => { setTopicIndex(i); setAnswers({}); setChecked(false); setRuleOpen(false) }}
            aria-label={`Topic ${i + 1}`}
            className={`h-2 flex-1 rounded-full transition-colors ${i === topicIndex ? 'bg-indigo-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          />
        ))}
      </div>

      {/* ── Grammar Rule (collapsible) ─────────────────── */}
      <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setRuleOpen(o => !o)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-base font-semibold text-gray-800">Grammar Rule</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${ruleOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {ruleOpen && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-5">
              <RuleContent body={topic.body} />
            </div>
          </div>
        )}
      </div>

      {/* ── Practice ────────────────────────────────────── */}
      {exercises ? (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide">
              Practice · {exercises.length} questions
            </h2>
            {grammarDone && !checked && (
              <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full">
                ✓ Completed today
              </span>
            )}
          </div>

          <div className="space-y-4">
            {exercises.map((ex, i) => (
              <QuestionCard
                key={ex.id}
                number={i + 1}
                exercise={ex}
                selected={answers[ex.id]}
                checked={checked}
                onSelect={val => {
                  if (!checked) setAnswers(a => ({ ...a, [ex.id]: val }))
                }}
              />
            ))}
          </div>

          <div className="mt-8">
            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={!allAnswered}
                className="w-full py-5 text-lg bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {allAnswered ? 'Check Answers' : `Answer all ${exercises.length} questions to continue`}
              </button>
            ) : (
              <ScoreCard score={score} total={exercises.length} onRetry={handleReset} />
            )}
          </div>
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-10 text-center">
          <p className="text-3xl mb-3">🚧</p>
          <p className="text-base font-medium text-amber-800">Exercises coming soon for this topic.</p>
          <p className="text-sm text-amber-600 mt-1.5">Read the Grammar Rule above to study.</p>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function QuestionCard({ number, exercise, selected, checked, onSelect }) {
  const isCorrect = selected === exercise.answer
  const showResult = checked && selected !== undefined

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-colors ${
      showResult
        ? isCorrect ? 'border-green-300' : 'border-red-300'
        : 'border-gray-200'
    }`}>
      {/* Question */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex gap-3 items-start">
          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 ${
            showResult
              ? isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {showResult ? (isCorrect ? '✓' : '✗') : number}
          </span>
          <p className="text-base sm:text-lg text-gray-900 font-medium leading-relaxed">{exercise.question}</p>
        </div>
      </div>

      {/* Options */}
      <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {exercise.options.map(opt => {
          const isSelected = selected === opt
          const isAnswer = opt === exercise.answer

          let cls = 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
          if (!checked && isSelected) cls = 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
          if (checked && isAnswer) cls = 'border-green-500 bg-green-50 text-green-800 font-medium'
          if (checked && isSelected && !isAnswer) cls = 'border-red-400 bg-red-50 text-red-700 line-through'

          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`px-4 py-3.5 rounded-xl text-base border transition-colors text-left active:scale-[0.98] ${cls} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation (shown after check) */}
      {checked && (
        <div className={`mx-5 mb-5 flex gap-3 items-start rounded-xl px-4 py-4 ${
          isCorrect ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <span className="text-lg flex-shrink-0 mt-0.5">{isCorrect ? '💡' : '📖'}</span>
          <div>
            {!isCorrect && (
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Correct answer: <span className="font-bold">{exercise.answer}</span>
              </p>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">{exercise.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ score, total, onRetry }) {
  const pct = Math.round((score / total) * 100)
  const isPerfect = score === total
  const isGood = pct >= 70

  return (
    <div className={`rounded-2xl border p-6 text-center ${
      isPerfect ? 'bg-green-50 border-green-200' : isGood ? 'bg-indigo-50 border-indigo-200' : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="text-5xl mb-4">{isPerfect ? '🎉' : isGood ? '💪' : '📖'}</div>
      <p className="text-4xl font-bold text-gray-900 mb-2">{score}/{total}</p>
      <p className="text-base text-gray-600 mb-5">
        {isPerfect ? 'Perfect! All correct.' : isGood ? 'Good work! Review the missed ones above.' : 'Keep studying — check the explanations above.'}
      </p>
      {/* Score bar */}
      <div className="w-full bg-white rounded-full h-3 mb-6 border border-gray-200">
        <div
          className={`h-3 rounded-full transition-all ${isPerfect ? 'bg-green-500' : isGood ? 'bg-indigo-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <button
        onClick={onRetry}
        className="text-base font-medium text-gray-600 underline underline-offset-2 hover:text-gray-800"
      >
        Try again
      </button>
    </div>
  )
}

// ── Grammar rule renderer ───────────────────────────────────────────────────

function RuleContent({ body }) {
  const lines = body.split('\n')
  const elements = []
  let tableBuffer = []

  const flushTable = () => {
    if (tableBuffer.length === 0) return
    const rows = tableBuffer.filter(r => !r.match(/^\|[-:\s|]+\|$/))
    elements.push(
      <div key={`tbl_${elements.length}`} className="my-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter(Boolean).map(c => c.trim())
              const isHeader = ri === 0
              return (
                <tr key={ri} className={isHeader ? 'bg-gray-100' : ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {cells.map((c, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-2.5 border border-gray-200 text-gray-700 ${isHeader ? 'font-semibold' : ''}`}
                      dangerouslySetInnerHTML={{ __html: renderInline(c) }}
                    />
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
    tableBuffer = []
  }

  lines.forEach((line, i) => {
    if (line.startsWith('|')) {
      tableBuffer.push(line)
      return
    }
    flushTable()

    if (!line.trim()) {
      elements.push(<div key={i} className="h-1.5" />)
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-indigo-200 pl-4 my-3 text-base text-gray-700 italic leading-relaxed">
          {line.slice(2)}
        </blockquote>
      )
    } else if (line.match(/^#+\s/)) {
      // skip markdown headings (they're visual noise inside the card)
    } else if (line.startsWith('```')) {
      // skip code fences
    } else {
      elements.push(
        <p
          key={i}
          className="text-base text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      )
    }
  })
  flushTable()

  return <div className="space-y-0.5">{elements}</div>
}

// ── Inline markdown ─────────────────────────────────────────────────────────

function renderInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/⚠️/g, '<span>⚠️</span>')
}

// ── Icons ───────────────────────────────────────────────────────────────────

function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function ChevronLeft({ className }) {
  return (
    <svg className={`w-4 h-4 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight({ className }) {
  return (
    <svg className={`w-4 h-4 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
