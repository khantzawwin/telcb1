// 10 questions per grammar topic.
// Topic keys are the slugified section titles from notes.md.

export const exercises = {

  // ── Lektion 1 ────────────────────────────────────────────────────────────
  als_vs__wenn____when__in_german: [
    {
      id: 'aw_1',
      question: '_____ ich klein war, hatte ich einen Hund.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: '"Als" — single, one-time period in the past ("when I was little"). Use als for past events that happened once.',
    },
    {
      id: 'aw_2',
      question: 'Immer _____ es regnete, blieben wir als Kinder zu Hause.',
      options: ['als', 'wenn'],
      answer: 'wenn',
      explanation: '"Wenn" — "immer wenn" signals a repeated/habitual past event. Every time it rained → wenn.',
    },
    {
      id: 'aw_3',
      question: '_____ er die Nachricht hörte, wurde er sehr traurig.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: '"Als" — a specific single moment in the past (he heard the news once). One-time past event → als.',
    },
    {
      id: 'aw_4',
      question: '_____ ich krank bin, trinke ich viel Tee.',
      options: ['Als', 'Wenn'],
      answer: 'Wenn',
      explanation: '"Wenn" — a present habit/general truth. Whenever I am sick (now/regularly) → wenn.',
    },
    {
      id: 'aw_5',
      question: '_____ du kommst, gehen wir zusammen essen.',
      options: ['Als', 'Wenn'],
      answer: 'Wenn',
      explanation: '"Wenn" — a future event. The event has not happened yet → wenn.',
    },
    {
      id: 'aw_6',
      question: '_____ wir Kinder waren, hatten wir keinen Computer.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: '"Als" — a single past period ("when we were children"). A defined time in the past → als.',
    },
    {
      id: 'aw_7',
      question: 'Jedes Mal _____ ich dieses Lied höre, denke ich an sie.',
      options: ['als', 'wenn'],
      answer: 'wenn',
      explanation: '"Wenn" — "jedes Mal wenn" signals repetition. Every single time (present, repeated) → wenn.',
    },
    {
      id: 'aw_8',
      question: '_____ ich zum ersten Mal Ski gefahren bin, hatte ich große Angst.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: '"Als" — "zum ersten Mal" (for the first time) describes a unique, unrepeatable past event → als.',
    },
    {
      id: 'aw_9',
      question: '_____ sie in Berlin wohnte, besuchte sie oft das Museum.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: '"Als" — a single past period (the time she lived in Berlin). Even with repeated visits inside, the overall period is once → als.',
    },
    {
      id: 'aw_10',
      question: '_____ ich mehr Zeit hätte, würde ich mehr lesen.',
      options: ['Als', 'Wenn'],
      answer: 'Wenn',
      explanation: '"Wenn" — a hypothetical / conditional (Konjunktiv II: hätte/würde). Conditionals always use wenn.',
    },
  ],

  // ── Lektion 2 ────────────────────────────────────────────────────────────
  kausale_konnektoren__deshalb___deswegen___darum___daher: [
    {
      id: 'kk_1',
      question: 'Er ist müde. _____ geht er früh ins Bett.',
      options: ['Deshalb', 'Weil', 'Obwohl', 'Wenn'],
      answer: 'Deshalb',
      explanation: '"Deshalb" starts a new main clause meaning "that\'s why". Verb comes directly after it (position 2): Deshalb geht er…',
    },
    {
      id: 'kk_2',
      question: 'Sie war krank. _____ ist sie nicht gekommen.',
      options: ['Deswegen', 'Da', 'Als', 'Aber'],
      answer: 'Deswegen',
      explanation: '"Deswegen" = therefore. Like deshalb, it takes position 1 in the new main clause → verb in position 2.',
    },
    {
      id: 'kk_3',
      question: 'Das Konzert war ausverkauft. _____ konnten wir keine Karten kaufen.',
      options: ['Darum', 'Weil', 'Wenn', 'Denn'],
      answer: 'Darum',
      explanation: '"Darum" = that\'s why / for that reason. All four (deshalb/deswegen/darum/daher) are interchangeable here.',
    },
    {
      id: 'kk_4',
      question: 'Es regnet. _____ nehme ich einen Regenschirm mit.',
      options: ['Daher', 'Da', 'Obwohl', 'Als'],
      answer: 'Daher',
      explanation: '"Daher" is slightly more formal but means the same as deshalb. Introduces a main clause → verb second.',
    },
    {
      id: 'kk_5',
      question: 'Ich bin müde, weil ich nicht geschlafen _____.',
      options: ['habe', 'hat', 'haben', 'hatte'],
      answer: 'habe',
      explanation: '"Weil" is a subordinating conjunction → verb goes to the END. "ich … habe" (not "habe ich").',
    },
    {
      id: 'kk_6',
      question: 'Ich vertraue dir. _____ sage ich dir alles.',
      options: ['Deshalb', 'Weil', 'Damit', 'Dass'],
      answer: 'Deshalb',
      explanation: '"Deshalb" introduces a consequence as a new main clause. Compare: "weil" would create a subordinate clause with verb-final order.',
    },
    {
      id: 'kk_7',
      question: 'Das Wetter war schön. _____ gingen wir spazieren.',
      options: ['Deswegen', 'Obwohl', 'Wenn', 'Als'],
      answer: 'Deswegen',
      explanation: '"Deswegen" = therefore. The nice weather caused them to go for a walk → result/consequence.',
    },
    {
      id: 'kk_8',
      question: 'Sie hat die Stelle bekommen, _____ sie sehr gut Deutsch spricht.',
      options: ['weil', 'deshalb', 'daher', 'darum'],
      answer: 'weil',
      explanation: '"Weil" introduces a reason inside a subordinate clause (verb at end). Deshalb/daher/darum start new main clauses, not embedded ones.',
    },
    {
      id: 'kk_9',
      question: 'Er kommt nicht zur Party. _____ bin ich sehr enttäuscht.',
      options: ['Daher', 'Da', 'Weil', 'Obwohl'],
      answer: 'Daher',
      explanation: '"Daher" states the consequence (I am disappointed because of that). Starts a new main clause with verb-second word order.',
    },
    {
      id: 'kk_10',
      question: 'Gute Freundschaften brauchen Zeit. _____ muss man sie pflegen.',
      options: ['Deshalb', 'Weil', 'Wenn', 'Dass'],
      answer: 'Deshalb',
      explanation: '"Deshalb" = that\'s why. The logical consequence of friendship needing time is that you must nurture it.',
    },
  ],

  adjektiv___nomen__adjektivische_substantive_: [
    {
      id: 'as_1',
      question: 'Das ist _____ Bekannter von mir.  (male, indefinite, Nominativ)',
      options: ['ein', 'eine', 'einer', 'einem'],
      answer: 'ein',
      explanation: 'Nominative masculine with indefinite article: ein Bekannter. The adjective-noun takes a strong -er ending because the article has no gender signal.',
    },
    {
      id: 'as_2',
      question: 'Ich habe _____ Bekannten getroffen.  (male, indefinite, Akkusativ)',
      options: ['einen', 'ein', 'einer', 'einem'],
      answer: 'einen',
      explanation: 'Accusative masculine indefinite: einen Bekannten. Weak ending -en after einen.',
    },
    {
      id: 'as_3',
      question: 'Ich helfe _____ Bekannten.  (female, indefinite, Dativ)',
      options: ['einer', 'eine', 'einem', 'einen'],
      answer: 'einer',
      explanation: 'Dative feminine indefinite: einer Bekannten. Article einer, noun ending -en.',
    },
    {
      id: 'as_4',
      question: '_____ Jugendliche braucht Unterstützung.  (male, definite, Nominativ)',
      options: ['Der', 'Die', 'Das', 'Den'],
      answer: 'Der',
      explanation: 'Nominative masculine definite: der Jugendliche. Der Jugendliche = the (male) teenager.',
    },
    {
      id: 'as_5',
      question: 'Er sprach mit _____ Deutschen.  (male, definite, Dativ)',
      options: ['dem', 'den', 'der', 'des'],
      answer: 'dem',
      explanation: 'Dative masculine definite: mit dem Deutschen. Preposition "mit" takes Dativ → dem.',
    },
    {
      id: 'as_6',
      question: 'Das ist die Wohnung _____ Deutschen.  (female, definite, Genitiv)',
      options: ['der', 'dem', 'den', 'des'],
      answer: 'der',
      explanation: 'Genitive feminine definite: der Deutschen. "Die Wohnung der Deutschen" = the (female) German\'s apartment.',
    },
    {
      id: 'as_7',
      question: 'Sie ist _____ Angestellte bei Siemens.  (female, indefinite, Nominativ)',
      options: ['eine', 'ein', 'einer', 'einem'],
      answer: 'eine',
      explanation: 'Nominative feminine indefinite: eine Angestellte. Female employee → eine Angestellte.',
    },
    {
      id: 'as_8',
      question: 'Wir haben viele _____ eingeladen.  (Bekannte, plural, no article, Akkusativ)',
      options: ['Bekannte', 'Bekannten', 'Bekannter', 'Bekanntem'],
      answer: 'Bekannte',
      explanation: 'Plural with no article → strong ending. Accusative plural = Bekannte (same as nominative plural).',
    },
    {
      id: 'as_9',
      question: 'Er ist _____ Erwachsener, kein Kind mehr.  (male, indefinite, Nominativ)',
      options: ['ein', 'eine', 'einer', 'einem'],
      answer: 'ein',
      explanation: 'Nominative masculine indefinite: ein Erwachsener. Like Bekannter, takes -er ending with indefinite article.',
    },
    {
      id: 'as_10',
      question: 'Der Arzt kümmert sich um _____ Kranken.  (male, definite, Akkusativ)',
      options: ['den', 'dem', 'der', 'des'],
      answer: 'den',
      explanation: 'Accusative masculine definite: den Kranken. The doctor looks after the (male) sick person → den.',
    },
  ],

  // ── Lektion 13 ───────────────────────────────────────────────────────────
  zweiteilige_konnektoren____weder____noch___sowohl____als_auch___nicht_nur____sondern_auch: [
    {
      id: 'zk_1',
      question: 'Der Fuchs ist _____ langsam _____ dumm.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: '"Weder … noch" = neither … nor. Both qualities are excluded. The fox is neither slow NOR stupid.',
    },
    {
      id: 'zk_2',
      question: 'Elefanten sind _____ intelligent _____ einfühlsam.',
      options: ['sowohl / als auch', 'weder / noch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: '"Sowohl … als auch" = both … and. Both qualities are confirmed. Elephants are BOTH intelligent AND empathetic.',
    },
    {
      id: 'zk_3',
      question: 'Delfine sind _____ klug — _____ sehr sozial.',
      options: ['nicht nur / sondern auch', 'weder / noch', 'sowohl / als auch', 'entweder / oder'],
      answer: 'nicht nur / sondern auch',
      explanation: '"Nicht nur … sondern auch" = not only … but also. The second quality (very social) is presented as a bonus/addition.',
    },
    {
      id: 'zk_4',
      question: 'Sie spricht _____ Deutsch _____ Englisch.',
      options: ['sowohl / als auch', 'weder / noch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: '"Sowohl … als auch" includes both. She speaks BOTH German AND English — both languages confirmed.',
    },
    {
      id: 'zk_5',
      question: 'Er hat _____ Zeit _____ Lust, ins Kino zu gehen.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: '"Weder … noch" excludes both. He has NEITHER time NOR desire. Both are negated.',
    },
    {
      id: 'zk_6',
      question: 'Das Projekt war _____ teuer — _____ zeitaufwändig.',
      options: ['sowohl / als auch', 'nicht nur / sondern auch', 'weder / noch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: '"Sowohl … als auch" = both expensive AND time-consuming. Two equal qualities confirmed.',
    },
    {
      id: 'zk_7',
      question: 'Sie hat _____ eine Ausbildung gemacht _____ studiert.',
      options: ['sowohl / als auch', 'weder / noch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: '"Sowohl … als auch" — she did BOTH: completed training AND studied at university. Both actions confirmed.',
    },
    {
      id: 'zk_8',
      question: 'Er ist _____ pünktlich _____ zuverlässig.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: '"Weder … noch" = neither punctual NOR reliable. Both negative qualities are negated/excluded.',
    },
    {
      id: 'zk_9',
      question: 'Das Buch ist _____ informativ — _____ macht es richtig Spaß.',
      options: ['nicht nur / sondern auch', 'weder / noch', 'sowohl / als auch', 'entweder / oder'],
      answer: 'nicht nur / sondern auch',
      explanation: '"Nicht nur … sondern auch" — the book is not only informative (expected), but ALSO fun (bonus/surprise).',
    },
    {
      id: 'zk_10',
      question: 'Sie hat _____ Erfahrung _____ eine Ausbildung für diesen Job.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: '"Weder … noch" — she lacks BOTH experience AND formal training. Both are absent/negated.',
    },
  ],
}

export function getExercisesForTopic(topicId) {
  return exercises[topicId] || null
}

export function matchTopicId(topicId) {
  if (!topicId) return null
  if (exercises[topicId]) return topicId
  const keys = Object.keys(exercises)
  // Try progressively shorter prefix matches
  for (let len = 15; len >= 8; len--) {
    const match = keys.find(k => topicId.startsWith(k.slice(0, len)) || k.startsWith(topicId.slice(0, len)))
    if (match) return match
  }
  return null
}
