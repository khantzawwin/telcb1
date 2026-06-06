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
  const [mode, setMode] = useState('explain') // 'explain' | 'exercise'
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [grammarDone, setGrammarDone] = useState(false)
  const [exercisesDone, setExercisesDone] = useState(false)

  const todayKey = getTodayKey()

  useEffect(() => {
    if (!user || !grammarTopics.length) return
    loadState()
  }, [user, grammarTopics])

  const loadState = async () => {
    const ref = doc(db, 'users', user.uid, 'grammar', todayKey)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const data = snap.data()
      setTopicIndex(data.topicIndex ?? todayTopicIndex())
      setGrammarDone(data.done || false)
    } else {
      setTopicIndex(todayTopicIndex())
    }
  }

  const todayTopicIndex = () => {
    const dayNum = Math.floor(Date.now() / 86400000)
    return dayNum % (grammarTopics.length || 1)
  }

  if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Loading…</div>
  if (!grammarTopics.length) return <div className="p-8 text-gray-500">No grammar topics found in notes.</div>

  const topic = grammarTopics[topicIndex]
  const exercises = getExercisesForTopic(topic.id) || getExercisesForTopic(matchTopicId(topic.id))
  const hasExercises = exercises && exercises.length > 0

  const handleSelectAnswer = (questionId, answer) => {
    if (checked) return
    setAnswers(a => ({ ...a, [questionId]: answer }))
  }

  const handleCheck = async () => {
    setChecked(true)
    if (!exercises) return
    const correct = exercises.filter(ex => answers[ex.id] === ex.answer).length
    await setDoc(doc(db, 'users', user.uid, 'grammar', todayKey), {
      topicIndex,
      done: true,
      correct,
      total: exercises.length,
      completedAt: new Date().toISOString(),
    }, { merge: true })
    setGrammarDone(true)
    setExercisesDone(true)
  }

  const score = exercises
    ? exercises.filter(ex => answers[ex.id] === ex.answer).length
    : 0

  const switchTopic = (delta) => {
    setTopicIndex(i => (i + delta + grammarTopics.length) % grammarTopics.length)
    setMode('explain')
    setAnswers({})
    setChecked(false)
    setExercisesDone(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
            Grammar of the Day
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            L{topic.lesson} — {topic.lessonTitle}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => switchTopic(-1)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            title="Previous topic"
          >
            ←
          </button>
          <button
            onClick={() => switchTopic(1)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            title="Next topic"
          >
            →
          </button>
        </div>
      </div>

      {/* Topic counter */}
      <div className="flex gap-1 mb-6">
        {grammarTopics.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i === topicIndex ? 'bg-indigo-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setMode('explain')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'explain' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Explanation
        </button>
        {hasExercises && (
          <button
            onClick={() => setMode('exercise')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'exercise' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Exercises
            {grammarDone && <span className="ml-2 text-green-600">✓</span>}
          </button>
        )}
      </div>

      {mode === 'explain' && (
        <ExplanationView topic={topic} />
      )}

      {mode === 'exercise' && exercises && (
        <ExerciseView
          exercises={exercises}
          answers={answers}
          checked={checked}
          onSelect={handleSelectAnswer}
          onCheck={handleCheck}
          score={score}
          done={exercisesDone}
        />
      )}
    </div>
  )
}

function ExplanationView({ topic }) {
  const lines = topic.body.split('\n')
  return (
    <div className="prose prose-gray max-w-none">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-3" />
        if (line.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-4 border-indigo-200 pl-4 my-2 text-gray-700 italic text-sm">
              {line.slice(2)}
            </blockquote>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-gray-900 mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>
        }
        if (line.startsWith('|')) {
          return <TableLine key={i} line={line} />
        }
        return (
          <p key={i} className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        )
      })}
    </div>
  )
}

function TableLine({ line }) {
  if (line.match(/^\|[-\s|]+\|$/)) return null
  const cells = line.split('|').filter(Boolean).map(c => c.trim())
  return (
    <div className="flex gap-2 my-0.5 text-sm">
      {cells.map((c, i) => (
        <span key={i} className="flex-1 px-2 py-1 bg-gray-50 rounded border-b border-gray-100 text-gray-700" dangerouslySetInnerHTML={{ __html: renderInline(c) }} />
      ))}
    </div>
  )
}

function ExerciseView({ exercises, answers, checked, onSelect, onCheck, score, done }) {
  return (
    <div className="space-y-6">
      {exercises.map((ex, i) => (
        <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500 mb-1">Question {i + 1}</p>
          <p className="text-base text-gray-900 mb-4">{ex.question}</p>

          <div className="grid grid-cols-2 gap-2">
            {ex.options.map(opt => {
              const selected = answers[ex.id] === opt
              const isCorrect = opt === ex.answer
              let cls = 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              if (selected && !checked) cls = 'border-indigo-500 bg-indigo-50 text-indigo-700'
              if (checked && isCorrect) cls = 'border-green-500 bg-green-50 text-green-700'
              if (checked && selected && !isCorrect) cls = 'border-red-400 bg-red-50 text-red-700 line-through'

              return (
                <button
                  key={opt}
                  onClick={() => onSelect(ex.id, opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${cls}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {checked && (
            <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg px-3 py-2">
              💡 {ex.explanation}
            </p>
          )}
        </div>
      ))}

      {!checked ? (
        <button
          onClick={onCheck}
          disabled={Object.keys(answers).length < exercises.length}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check answers
        </button>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl mb-2">{score === exercises.length ? '🎉' : '📖'}</div>
          <p className="font-semibold text-gray-900">
            {score}/{exercises.length} correct
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {score === exercises.length ? 'Perfect!' : 'Review the explanations above.'}
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
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs">$1</code>')
}
