import { useNotes } from '../contexts/NotesContext'
import { findExercises } from '../utils/grammarExercises'
import ListRow from './ListRow'

// "From your notes" rows on Writing/Speaking for notes topics that aren't grammar
export default function NotesTopicLinks({ topicIds }) {
  const { grammarTopics } = useNotes()
  const topics = topicIds.map(id => grammarTopics.find(t => t.id === id)).filter(Boolean)
  if (!topics.length) return null

  return (
    <div className="mt-12">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">From your notes</p>
      <div className="space-y-2">
        {topics.map(t => {
          const exercises = findExercises(t.id)
          return (
            <ListRow
              key={t.id}
              to={`/grammar/topic/${t.id}`}
              title={t.title}
              tag={exercises ? `${exercises.length} questions` : 'Read only'}
            />
          )
        })}
      </div>
    </div>
  )
}
