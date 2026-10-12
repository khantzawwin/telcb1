import { useAuth } from '../contexts/AuthContext'
import { useNotes } from '../contexts/NotesContext'
import { useReviewStats } from './useReviewStats'
import { useGrammarToday } from './useGrammarToday'
import { THEMES, groupTopics } from './grammarThemes'

// Today's checklist on Home, and "Up next" after finishing a task.
// Grammar of the Day and the drill rotate by day number.
export function useTodayPlan() {
  const { user } = useAuth()
  const { cards, grammarTopics, loading } = useNotes()
  const review = useReviewStats(user, cards)
  const { sessionDone, topicDone } = useGrammarToday(user)

  const day = Math.floor(Date.now() / 86400000)
  const themedTopics = groupTopics(grammarTopics).flatMap(t => t.items)
  const topic = themedTopics[day % (themedTopics.length || 1)]
  const drills = THEMES.filter(t => t.drill)
  const drill = drills[day % drills.length]
  const ready = Math.min(review.stats.due + review.stats.new, 20)

  const tasks = [
    {
      key: 'flashcards',
      title: 'Flashcards',
      detail: review.sessionAvailable ? `${ready} cards · ${review.slot}` : `${review.slot} review done`,
      to: '/vocabulary/review',
      done: !review.sessionAvailable,
    },
    topic && {
      key: 'grammar',
      title: 'Grammar of the Day',
      detail: topic.title,
      to: `/grammar/topic/${topic.id}`,
      done: topicDone(topic.id),
    },
    {
      key: 'drill',
      title: 'Drill',
      detail: drill.title,
      to: drill.drill.to,
      done: sessionDone(drill.drill.sessionKey),
    },
    {
      key: 'writing',
      title: 'Writing',
      detail: "Today's email task",
      to: '/writing',
      done: sessionDone('writing'),
    },
    {
      key: 'speaking',
      title: 'Speaking',
      detail: 'Teil 2 + Teil 3',
      to: '/sprechen',
      done: sessionDone('sprechen'),
    },
  ].filter(Boolean)

  return {
    tasks,
    review,
    loading: loading || (cards.length > 0 && review.loading),
    // First unfinished task other than the one just completed
    nextAfter: key => tasks.find(t => !t.done && t.key !== key) || null,
  }
}
