import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getTodayKey } from './srs'

// What was practised today: flags from the sessions doc (verben, connectors,
// werden, writing, sprechen …) and per-topic results from the grammar doc.
export function useGrammarToday(user) {
  const [today, setToday] = useState({ session: {}, topics: {} })

  useEffect(() => {
    if (!user) return
    const key = getTodayKey()
    Promise.all([
      getDoc(doc(db, 'users', user.uid, 'sessions', key)),
      getDoc(doc(db, 'users', user.uid, 'grammar', key)),
    ]).then(([sessionSnap, grammarSnap]) => {
      setToday({
        session: sessionSnap.exists() ? sessionSnap.data() : {},
        topics: grammarSnap.exists() ? grammarSnap.data().topics || {} : {},
      })
    }).catch(() => {})
  }, [user])

  return {
    sessionDone: key => !!today.session[key]?.completed,
    topicDone: topicId => !!today.topics[topicId],
  }
}
