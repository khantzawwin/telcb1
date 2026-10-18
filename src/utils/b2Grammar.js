// The B2 grammar list. Each topic is its own page with a reference part and a
// drill; finishing the drill sets sessions/{today}.{sessionKey}.completed.
// Add new B2 topics here (and a route in App.jsx).
export const B2_TOPICS = [
  {
    id: 'vergangenheit',
    title: 'Die 3 Vergangenheitsformen',
    subtitle: 'Perfekt · Präteritum · Plusquamperfekt',
    sessionKey: 'b2_vergangenheit',
  },
  {
    id: 'konjunktiv',
    title: 'Konjunktiv II',
    subtitle: 'würde + Infinitiv · Wünsche · irreale Bedingungen',
    sessionKey: 'b2_konjunktiv',
  },
  {
    id: 'umzu',
    title: 'um … zu',
    subtitle: 'Ziel & Zweck · damit · ohne … zu · statt … zu',
    sessionKey: 'b2_umzu',
  },
  {
    id: 'adjektive',
    title: 'Adjektivendungen',
    subtitle: 'Alle Fälle · bestimmter, unbestimmter & kein Artikel',
    sessionKey: 'b2_adjektive',
  },
  {
    id: 'verben',
    title: 'Unregelmäßige Verben',
    subtitle: 'Nach Vokalwechsel gruppiert (ei – ie – ie …)',
    sessionKey: 'b2_verben',
  },
].map(t => ({ ...t, to: `/grammar/b2/${t.id}` }))

export const b2Topic = id => B2_TOPICS.find(t => t.id === id)
