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
  const [mode, setMode] = useState('explain')
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [grammarDone, setGrammarDone] = useState(false)
  const todayKey = getTodayKey()

  useEffect(() => {
    if (!user || !grammarTopics.length) return
    loadState()
  }, [user, grammarTopics])

  const loadState = async () => {
    const snap = await getDoc(doc(db, 'users', user.uid, 'grammar', todayKey))
    const idx = Math.floor(Date.now() / 86400000) % grammarTopics.length
    if (snap.exists()) {
      setTopicIndex(snap.data().topicIndex ?? idx)
      setGrammarDone(snap.data().done || false)
    } else {
      setTopicIndex(idx)
    }
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
  const hasExercises = !!exercises?.length
  const score = exercises ? exercises.filter(ex => answers[ex.id] === ex.answer).length : 0

  const switchTopic = (delta) => {
    setTopicIndex(i => (i + delta + grammarTopics.length) % grammarTopics.length)
    setMode('explain')
    setAnswers({})
    setChecked(false)
  }

  const handleCheck = async () => {
    setChecked(true)
    const correct = exercises.filter(ex => answers[ex.id] === ex.answer).length
    await setDoc(doc(db, 'users', user.uid, 'grammar', todayKey), {
      topicIndex, done: true, correct, total: exercises.length,
      completedAt: new Date().toISOString(),
    }, { merge: true })
    setGrammarDone(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">
            Grammar of the Day
          </p>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{topic.title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">L{topic.lesson} — {topic.lessonTitle}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0 mt-1">
          <button onClick={() => switchTopic(-1)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 text-sm">←</button>
          <button onClick={() => switchTopic(1)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100 text-sm">→</button>
        </div>
      </div>

      {/* Topic progress dots */}
      <div className="flex gap-1 mb-5 overflow-hidden">
        {grammarTopics.map((_, i) => (
          <button
            key={i}
            onClick={() => { setTopicIndex(i); setMode('explain'); setAnswers({}); setChecked(false) }}
            className={`h-1 flex-1 rounded-full transition-colors ${i === topicIndex ? 'bg-indigo-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-full sm:w-fit">
        <button
          onClick={() => setMode('explain')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'explain' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Explanation
        </button>
        {hasExercises && (
          <button
            onClick={() => setMode('exercise')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'exercise' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Exercises {grammarDone && <span className="text-green-500">✓</span>}
          </button>
        )}
      </div>

      {mode === 'explain' && <ExplanationView topic={topic} onStartExercises={hasExercises ? () => setMode('exercise') : null} />}
      {mode === 'exercise' && exercises && (
        <ExerciseView
          exercises={exercises}
          answers={answers}
          checked={checked}
          onSelect={(id, val) => { if (!checked) setAnswers(a => ({ ...a, [id]: val })) }}
          onCheck={handleCheck}
          score={score}
        />
      )}
    </div>
  )
}

function ExplanationView({ topic, onStartExercises }) {
  const lines = topic.body.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />
        if (line.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-3 border-l-4 border-indigo-200 pl-3 my-2 text-gray-700 text-sm italic leading-relaxed">
              {line.slice(2)}
            </blockquote>
          )
        }
        if (line.startsWith('|')) return <TableRow key={i} line={line} />
        if (line.startsWith('#')) return null
        return (
          <p key={i} className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        )
      })}
      {onStartExercises && (
        <div className="pt-6">
          <button
            onClick={onStartExercises}
            className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl active:bg-indigo-700 transition-colors"
          >
            Practice Exercises →
          </button>
        </div>
      )}
    </div>
  )
}

function TableRow({ line }) {
  if (line.match(/^\|[-:\s|]+\|$/)) return null
  const cells = line.split('|').filter(Boolean).map(c => c.trim())
  return (
    <div className="flex gap-1.5 text-xs my-0.5">
      {cells.map((c, i) => (
        <span key={i} className="flex-1 px-2 py-1.5 bg-gray-50 rounded text-gray-700"
          dangerouslySetInnerHTML={{ __html: renderInline(c) }} />
      ))}
    </div>
  )
}

function ExerciseView({ exercises, answers, checked, onSelect, onCheck, score }) {
  const allAnswered = exercises.every(ex => answers[ex.id] !== undefined)
  return (
    <div className="space-y-4">
      {exercises.map((ex, i) => (
        <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs text-gray-400 font-medium mb-1.5">Question {i + 1}</p>
          <p className="text-sm sm:text-base text-gray-900 font-medium mb-4 leading-relaxed">{ex.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ex.options.map(opt => {
              const selected = answers[ex.id] === opt
              const isCorrect = opt === ex.answer
              let cls = 'border-gray-200 text-gray-700 bg-white active:bg-gray-50'
              if (selected && !checked) cls = 'border-indigo-500 bg-indigo-50 text-indigo-700'
              if (checked && isCorrect) cls = 'border-green-500 bg-green-50 text-green-700'
              if (checked && selected && !isCorrect) cls = 'border-red-400 bg-red-50 text-red-600 line-through'
              return (
                <button
                  key={opt}
                  onClick={() => onSelect(ex.id, opt)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors text-left ${cls}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {checked && (
            <div className="mt-3 flex gap-2 items-start bg-gray-50 rounded-lg px-3 py-2.5">
              <span className="text-sm">💡</span>
              <p className="text-xs text-gray-600 leading-relaxed">{ex.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {!checked ? (
        <button
          onClick={onCheck}
          disabled={!allAnswered}
          className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl active:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-3">{score === exercises.length ? '🎉' : '📖'}</div>
          <p className="font-bold text-gray-900 text-lg">{score}/{exercises.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {score === exercises.length ? 'Perfect score!' : 'Review the explanations above.'}
          </p>
        </div>
      )}
    </div>
  )
}

function renderInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
}
