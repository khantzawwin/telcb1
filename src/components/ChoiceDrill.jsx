import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNavGuard } from '../contexts/NavGuardContext'
import { getTodayKey } from '../utils/srs'
import UpNext from './UpNext'

// One-question-at-a-time multiple-choice drill with mistake review.
// Questions: { id, usage, question (with ___), options, answer, explanation }.
// On finish it sets sessions/{today}.{sessionKey}.completed.

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildSession(exercises, size) {
  return shuffle(exercises)
    .slice(0, size)
    .map(q => ({ ...q, options: shuffle(q.options) }))
}

function reshuffle(exercises) {
  return shuffle(exercises).map(q => ({ ...q, options: shuffle(q.options) }))
}

export default function ChoiceDrill({ makeSession, sessionKey, perfectText = 'Perfect — every answer correct!' }) {
  const { user } = useAuth()
  const { setGuard } = useNavGuard()
  const [questions, setQuestions] = useState(makeSession)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [mistakes, setMistakes] = useState([])
  const [isReview, setIsReview] = useState(false)

  useEffect(() => {
    if (done && user) {
      setDoc(
        doc(db, 'users', user.uid, 'sessions', getTodayKey()),
        { [sessionKey]: { completed: true, completedAt: new Date().toISOString() } },
        { merge: true }
      ).catch(() => {})
    }
  }, [done, user, sessionKey])

  useEffect(() => {
    const inProgress = !done && (index > 0 || selected !== null)
    setGuard(inProgress ? 'Leaving this page will reset your current exercise session. Are you sure?' : null)
    return () => setGuard(null)
  }, [done, index, selected, setGuard])

  const q = questions[index]
  const isCorrect = selected === q?.answer
  const answered = selected !== null

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
    if (opt === q.answer) setScore(s => s + 1)
    else setMistakes(m => m.some(x => x.id === q.id) ? m : [...m, q])
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) setDone(true)
    else { setIndex(i => i + 1); setSelected(null) }
  }

  const handleRestart = () => {
    setQuestions(makeSession())
    setIndex(0); setSelected(null); setScore(0); setMistakes([]); setIsReview(false); setDone(false)
  }

  const handleReviewMistakes = () => {
    setQuestions(reshuffle(mistakes))
    setIndex(0); setSelected(null); setScore(0); setMistakes([]); setIsReview(true); setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const missed = mistakes.length
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
        {isReview && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">Review round</p>
        )}
        <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-green-600' : 'text-amber-500'}`}>
          {score}/{questions.length}
        </div>
        <p className="text-gray-500 mb-1">{pct}% correct</p>
        <p className="text-sm text-gray-500 mb-8">
          {missed === 0 ? perfectText :
           pct >= 70 ? `You missed ${missed}. Drill them now while they're fresh.` :
           `${missed} to review. Repetition is how these forms stick.`}
        </p>

        {missed > 0 && (
          <button
            onClick={handleReviewMistakes}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all mb-3 sm:mb-0 sm:mr-3"
          >
            Review {missed} mistake{missed > 1 ? 's' : ''} →
          </button>
        )}
        <button
          onClick={handleRestart}
          className={`w-full sm:w-auto px-8 py-3 font-semibold rounded-2xl transition-all ${
            missed > 0 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          New session
        </button>
        <UpNext current="drill" className="mt-6 text-left" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span>
          {isReview && <span className="font-semibold text-indigo-500">Review · </span>}
          Question {index + 1} of {questions.length}
        </span>
        <span>{score} correct</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-400 rounded-full transition-all duration-300" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{q.usage}</span>
        </div>
        <div className="px-6 pt-6 pb-5">
          <p className="text-lg text-gray-900 font-medium leading-relaxed mb-6">
            {q.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[3rem] mx-1 border-b-2 text-center font-bold ${
                    answered
                      ? isCorrect ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400'
                      : 'border-gray-400 text-transparent'
                  }`}>
                    {answered ? selected : '___'}
                  </span>
                )}
              </span>
            ))}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {q.options.map(opt => {
              let style = 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              if (answered) {
                if (opt === q.answer) style = 'bg-green-50 text-green-700 border border-green-300 font-semibold'
                else if (opt === selected) style = 'bg-red-50 text-red-600 border border-red-300'
                else style = 'bg-gray-50 text-gray-500 border border-gray-100'
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                  className={`py-3 rounded-2xl text-base font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? 'Correct' : `Correct answer: ${q.answer}`}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          <button
            onClick={answered ? handleNext : undefined}
            disabled={!answered}
            className={`w-full py-3.5 rounded-2xl text-base font-semibold transition-all ${
              answered ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {index + 1 >= questions.length ? 'See results' : 'Next question'}
          </button>
        </div>
      </div>
    </div>
  )
}
