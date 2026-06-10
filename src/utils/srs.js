// SM-2 spaced repetition algorithm
// rating: 0=Again, 1=Hard, 2=Good, 3=Easy

export function calculateNextReview(card, rating) {
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card

  if (rating === 0) {
    // Again — reset to start; ease factor drops slightly
    repetitions = 0
    interval = 1
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else {
    if (rating === 3) {
      // Easy — accelerated: skip the slow learning phase
      if (repetitions === 0) interval = 4
      else if (repetitions === 1) interval = 8
      else interval = Math.round(interval * easeFactor * 1.3)
    } else if (rating === 2) {
      // Good — standard SM-2
      if (repetitions === 0) interval = 1
      else if (repetitions === 1) interval = 4
      else interval = Math.round(interval * easeFactor)
    } else {
      // Hard — conservative; interval barely grows
      if (repetitions === 0) interval = 1
      else if (repetitions === 1) interval = 2
      else interval = Math.max(interval + 1, Math.round(interval * Math.max(1.2, easeFactor - 0.15)))
    }
    repetitions += 1
    easeFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02)
    )
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)
  nextReview.setHours(0, 0, 0, 0)

  return {
    interval,
    repetitions,
    easeFactor,
    nextReview: nextReview.toISOString(),
    lastReviewed: new Date().toISOString(),
    status: repetitions === 0 ? 'new' : interval <= 3 ? 'learning' : 'review',
  }
}

export function isDueForReview(card) {
  if (!card.nextReview) return true
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return new Date(card.nextReview) <= now
}

export function getSessionSlot() {
  const hour = new Date().getHours()
  return hour < 14 ? 'morning' : 'evening'
}

export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function selectSessionCards(allCards, progressMap, maxCards = 20) {
  const due = []
  const newCards = []

  for (const card of allCards) {
    const progress = progressMap[card.id]
    if (!progress) {
      newCards.push(card)
    } else if (isDueForReview(progress)) {
      due.push({ ...card, ...progress })
    }
  }

  // Always guarantee up to 5 new cards; fill remaining slots with due reviews
  const guaranteedNew = Math.min(5, newCards.length)
  const dueSlots = Math.min(due.length, maxCards - guaranteedNew)
  const selected = [
    ...due.slice(0, dueSlots),
    ...newCards.slice(0, maxCards - dueSlots),
  ]

  return selected.sort(() => Math.random() - 0.5)
}
