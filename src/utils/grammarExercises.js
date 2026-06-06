// Hand-crafted exercises for each grammar topic in the notes.
// Topic IDs match the slugified grammar section titles.

export const exercises = {
  als_vs__wenn____when__in_german: [
    {
      id: 'alswenn_1',
      question: '_____ ich klein war, hatte ich einen Hund.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: 'Single past event → Als',
    },
    {
      id: 'alswenn_2',
      question: '_____ ich krank bin, trinke ich Tee.',
      options: ['Als', 'Wenn'],
      answer: 'Wenn',
      explanation: 'Present habit → Wenn',
    },
    {
      id: 'alswenn_3',
      question: 'Immer _____ es regnete, blieben wir als Kinder zu Hause.',
      options: ['als', 'wenn'],
      answer: 'wenn',
      explanation: 'Repeated past event (immer) → wenn',
    },
    {
      id: 'alswenn_4',
      question: '_____ er die Nachricht hörte, wurde er traurig.',
      options: ['Als', 'Wenn'],
      answer: 'Als',
      explanation: 'Single past event → Als',
    },
    {
      id: 'alswenn_5',
      question: '_____ du kommst, gehen wir spazieren.',
      options: ['Als', 'Wenn'],
      answer: 'Wenn',
      explanation: 'Future event → Wenn',
    },
  ],

  kausale_konnektoren__deshalb___deswegen___darum___daher: [
    {
      id: 'kausal_1',
      question: 'Ich vertraue ihr. _____ erzähle ich ihr alles.',
      options: ['Deshalb', 'Weil', 'Aber', 'Oder'],
      answer: 'Deshalb',
      explanation: 'deshalb/deswegen/darum/daher all mean "therefore" and introduce a new main clause.',
    },
    {
      id: 'kausal_2',
      question: 'Er hat gelogen. _____ bin ich enttäuscht.',
      options: ['Darum', 'Damit', 'Denn', 'Obwohl'],
      answer: 'Darum',
      explanation: 'darum = that\'s why, introduces a main clause (verb in position 2).',
    },
    {
      id: 'kausal_3',
      question: 'Ich bin müde, weil ich nicht geschlafen _____.',
      options: ['habe', 'hat', 'haben', 'bin'],
      answer: 'habe',
      explanation: 'weil sends the verb to the end of the clause.',
    },
    {
      id: 'kausal_4',
      question: 'Sie ist krank. _____ kommt sie nicht.',
      options: ['Daher', 'Weil', 'Wenn', 'Obwohl'],
      answer: 'Daher',
      explanation: 'daher is slightly more formal, same meaning as deshalb.',
    },
    {
      id: 'kausal_5',
      question: 'Gute Freundschaften brauchen Zeit. _____ muss man sie pflegen.',
      options: ['Deshalb', 'Weil', 'Als', 'Wenn'],
      answer: 'Deshalb',
      explanation: 'deshalb = therefore, introduces main clause with verb-second word order.',
    },
  ],

  adjektiv___nomen__adjektivische_substantive_: [
    {
      id: 'adjsub_1',
      question: 'Das ist _____ Bekannter von mir. (male, indefinite)',
      options: ['ein', 'eine', 'einer', 'eines'],
      answer: 'ein',
      explanation: 'Nominative masculine indefinite: ein Bekannter.',
    },
    {
      id: 'adjsub_2',
      question: 'Ich habe _____ Bekannten getroffen. (male, indefinite)',
      options: ['einen', 'ein', 'einer', 'einem'],
      answer: 'einen',
      explanation: 'Accusative masculine indefinite: einen Bekannten.',
    },
    {
      id: 'adjsub_3',
      question: 'Ich helfe _____ Bekannten. (female, indefinite)',
      options: ['einer', 'eine', 'einem', 'einen'],
      answer: 'einer',
      explanation: 'Dative feminine indefinite: einer Bekannten.',
    },
    {
      id: 'adjsub_4',
      question: 'Der _____ Jugendliche braucht Unterstützung.',
      options: ['junge', 'jungen', 'junger', 'junges'],
      answer: 'junge',
      explanation: 'Nominative masculine definite article → weak ending -e.',
    },
    {
      id: 'adjsub_5',
      question: 'Sie sprach mit _____ Deutschen. (male, definite)',
      options: ['dem', 'den', 'der', 'des'],
      answer: 'dem',
      explanation: 'Dative masculine definite: mit dem Deutschen.',
    },
  ],

  zweiteilige_konnektoren____weder____noch___sowohl____als_auch___nicht_nur____sondern_auch: [
    {
      id: 'zweiteil_1',
      question: 'Der Fuchs ist _____ langsam _____ dumm.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: 'weder … noch = neither … nor (both excluded).',
    },
    {
      id: 'zweiteil_2',
      question: 'Elefanten sind _____ intelligent _____ einfühlsam.',
      options: ['sowohl / als auch', 'weder / noch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: 'sowohl … als auch = both … and (both included).',
    },
    {
      id: 'zweiteil_3',
      question: 'Delfine sind _____ klug, _____ sehr sozial.',
      options: ['nicht nur / sondern auch', 'weder / noch', 'sowohl / als auch', 'entweder / oder'],
      answer: 'nicht nur / sondern auch',
      explanation: 'nicht nur … sondern auch = not only … but also (addition/bonus).',
    },
    {
      id: 'zweiteil_4',
      question: 'Sie spricht _____ Deutsch _____ Englisch.',
      options: ['sowohl / als auch', 'weder / noch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'sowohl / als auch',
      explanation: 'sowohl … als auch = both … and. Both languages included.',
    },
    {
      id: 'zweiteil_5',
      question: 'Sie hat _____ Erfahrung _____ eine Ausbildung.',
      options: ['weder / noch', 'sowohl / als auch', 'nicht nur / sondern auch', 'entweder / oder'],
      answer: 'weder / noch',
      explanation: 'weder … noch = neither … nor. Both are negated/excluded.',
    },
  ],
}

// Fallback exercises when a grammar topic has no custom exercises
export function getExercisesForTopic(topicId) {
  return exercises[topicId] || null
}

// Find the best matching topic ID from available exercises
export function matchTopicId(topicId) {
  if (exercises[topicId]) return topicId
  // Fuzzy match — find closest key
  const keys = Object.keys(exercises)
  return keys.find(k => topicId.includes(k.slice(0, 10))) || null
}
