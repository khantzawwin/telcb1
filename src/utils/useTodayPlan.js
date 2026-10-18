import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { useLevel } from '../contexts/LevelContext'
import { useReviewStats } from './useReviewStats'
import { useGrammarToday } from './useGrammarToday'
import { THEMES, groupTopics } from './grammarThemes'
import { B2_TOPICS } from './b2Grammar'

// Today's checklist on Home, and "Up next" after finishing a task.
// Each level has its own plan. Grammar of the Day and the drill rotate by day number.
export function useTodayPlan() {
  const { user } = useAuth()
  const { level } = useLevel()
  const { cards, grammarTopics, loading } = useNotes()
  const review = useReviewStats(user, cards, level)
  const { sessionDone, topicDone } = useGrammarToday(user)

  const day = Math.floor(Date.now() / 86400000)
  const ready = Math.min(review.stats.due + review.stats.new, 20)

  const flashcards = {
    key: 'flashcards',
    title: `${level} Flashcards`,
    detail: review.sessionAvailable ? `${ready || 20} cards · ${review.slot}` : `${review.slot} review done`,
    to: '/vocabulary/review',
    done: !review.sessionAvailable,
  }

  let tasks
  if (level === 'B2') {
    const grammar = B2_TOPICS[day % B2_TOPICS.length]
    // Irregular verbs every day as a second drill, unless it's already today's topic
    const verbs = B2_TOPICS.find(t => t.id === 'verben')
    tasks = [
      flashcards,
      { key: 'drill', title: 'Grammar of the Day', detail: grammar.title, to: grammar.to, done: sessionDone(grammar.sessionKey) },
      grammar.id !== 'verben' && {
        key: 'verben', title: 'Unregelmäßige Verben', detail: '20 forms', to: verbs.to, done: sessionDone(verbs.sessionKey),
      },
    ].filter(Boolean)
  } else {
    const themedTopics = groupTopics(grammarTopics).flatMap(t => t.items)
    const topic = themedTopics[day % (themedTopics.length || 1)]
    const drills = THEMES.filter(t => t.drill)
    const drill = drills[day % drills.length]
    tasks = [
      flashcards,
      topic && {
        key: 'grammar',
        title: 'Grammar of the Day',
        detail: topic.title,
        to: `/grammar/topic/${topic.id}`,
        done: topicDone(topic.id),
      },
      { key: 'drill', title: 'Drill', detail: drill.title, to: drill.drill.to, done: sessionDone(drill.drill.sessionKey) },
      { key: 'writing', title: 'Writing', detail: "Today's email task", to: '/writing', done: sessionDone('writing') },
      { key: 'speaking', title: 'Speaking', detail: 'Teil 2 + Teil 3', to: '/sprechen', done: sessionDone('sprechen') },
    ].filter(Boolean)
  }

  return {
    tasks,
    review,
    loading: loading || (cards.length > 0 && review.loading),
    // First unfinished task other than the one just completed
    nextAfter: key => tasks.find(t => !t.done && t.key !== key) || null,
  }
}
