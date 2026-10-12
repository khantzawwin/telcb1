import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getTodayKey, getSessionSlot, isDueForReview } from './srs'

// Flashcard review status for today: due/new/total counts and which
// sessions (morning/evening) are already done.
export function useReviewStats(user, cards) {
  const [sessionDone, setSessionDone] = useState({ morning: false, evening: false })
  const [stats, setStats] = useState({ due: 0, new: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !cards.length) return
    let cancelled = false
    async function load() {
      try {
        const [progressDoc, sessionDoc] = await Promise.all([
          getDoc(doc(db, 'users', user.uid, 'meta', 'cardProgress')),
          getDoc(doc(db, 'users', user.uid, 'sessions', getTodayKey())),
        ])
        if (cancelled) return
        const progressMap = progressDoc.exists() ? progressDoc.data() : {}
        const sessionData = sessionDoc.exists() ? sessionDoc.data() : {}

        setSessionDone({
          morning: sessionData.morning?.completed || false,
          evening: sessionData.evening?.completed || false,
        })

        let due = 0, newCards = 0
        for (const card of cards) {
          const p = progressMap[card.id]
          if (!p) newCards++
          else if (isDueForReview(p)) due++
        }
        setStats({ due, new: newCards, total: cards.length })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user, cards])

  const slot = getSessionSlot()
  const sessionAvailable = slot === 'morning' ? !sessionDone.morning : !sessionDone.evening
  return { stats, sessionDone, slot, sessionAvailable, loading }
}
