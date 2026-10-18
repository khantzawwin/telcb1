import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useGrammarToday } from '../../utils/useGrammarToday'
import { B2_TOPICS } from '../../utils/b2Grammar'

// B2 grammar: a short, fixed list of topics. Each opens a reference + drill page.
export default function B2Grammar() {
  const { user } = useAuth()
  const { sessionDone } = useGrammarToday(user)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">B2 Grammatik</h1>
      <p className="text-base text-gray-500 mb-8">{B2_TOPICS.length} topics · each with a reference and a drill</p>

      <ol className="space-y-3">
        {B2_TOPICS.map((t, i) => {
          const done = sessionDone(t.sessionKey)
          return (
            <li key={t.id}>
              <Link
                to={t.to}
                className="flex items-center gap-4 bg-white rounded-2xl shadow-sm px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-base font-semibold text-gray-900">{t.title}</span>
                  <span className="block text-sm text-gray-500">{t.subtitle}</span>
                </span>
                {done && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    ✓ today
                  </span>
                )}
                <span className="text-gray-400 flex-shrink-0" aria-hidden>›</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
