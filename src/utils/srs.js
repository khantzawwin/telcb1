// SM-2 spaced repetition algorithm
// rating: 0=Again, 1=Hard, 2=Good, 3=Easy

export function calculateNextReview(card, rating) {
  let { interval = 1, repetitions = 0, easeFactor = 2.5 } = card

  if (rating === 0) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 3
    else interval = Math.round(interval * easeFactor)

    repetitions += 1
    // Adjust ease factor
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
  return new Date().toISOString().slice(0, 10)
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

  // Prioritise due reviews, then fill with new cards
  const selected = [...due]
  const remaining = maxCards - selected.length
  if (remaining > 0) {
    selected.push(...newCards.slice(0, remaining))
  }

  return selected.slice(0, maxCards).sort(() => Math.random() - 0.5)
}
