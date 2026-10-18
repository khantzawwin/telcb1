import { useState } from 'react'
import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { shuffle } from '../../components/ChoiceDrill'
import { SectionCard } from '../../components/LearnBlocks'

// Adjective endings: 4 cases × m/f/n/pl × 3 article types.
const CASES = ['Nom', 'Akk', 'Dat', 'Gen']
const CASE_NAMES = { Nom: 'Nominativ', Akk: 'Akkusativ', Dat: 'Dativ', Gen: 'Genitiv' }
const GENDERS = ['m', 'f', 'n', 'pl']
const GENDER_NAMES = { m: 'maskulin', f: 'feminin', n: 'neutral', pl: 'Plural' }

const TYPES = {
  def: {
    label: 'Bestimmter Artikel',
    short: 'der / die / das',
    also: 'Same after dieser, jeder, welcher, alle (Plural).',
    articles: {
      Nom: ['der', 'die', 'das', 'die'],
      Akk: ['den', 'die', 'das', 'die'],
      Dat: ['dem', 'der', 'dem', 'den'],
      Gen: ['des', 'der', 'des', 'der'],
    },
    endings: {
      Nom: ['e', 'e', 'e', 'en'],
      Akk: ['en', 'e', 'e', 'en'],
      Dat: ['en', 'en', 'en', 'en'],
      Gen: ['en', 'en', 'en', 'en'],
    },
  },
  indef: {
    label: 'Unbestimmter Artikel',
    short: 'ein / eine / kein / mein …',
    also: 'Same after kein and mein, dein, sein, ihr, unser, euer. Plural: keine / meine.',
    articles: {
      Nom: ['ein', 'eine', 'ein', 'keine'],
      Akk: ['einen', 'eine', 'ein', 'keine'],
      Dat: ['einem', 'einer', 'einem', 'keinen'],
      Gen: ['eines', 'einer', 'eines', 'keiner'],
    },
    endings: {
      Nom: ['er', 'e', 'es', 'en'],
      Akk: ['en', 'e', 'es', 'en'],
      Dat: ['en', 'en', 'en', 'en'],
      Gen: ['en', 'en', 'en', 'en'],
    },
  },
  none: {
    label: 'Ohne Artikel',
    short: 'kalter Kaffee, frische Milch …',
    also: 'Also after numbers (zwei neue Bücher), viele, einige, mehrere, wenige.',
    articles: null,
    endings: {
      Nom: ['er', 'e', 'es', 'e'],
      Akk: ['en', 'e', 'es', 'e'],
      Dat: ['em', 'er', 'em', 'en'],
      Gen: ['en', 'er', 'en', 'er'],
    },
  },
}

// Example nouns per case for the tables
const EXAMPLES = {
  withArticle: {
    adj: 'nett',
    nouns: {
      m: { Nom: 'Mann', Akk: 'Mann', Dat: 'Mann', Gen: 'Mannes' },
      f: { Nom: 'Frau', Akk: 'Frau', Dat: 'Frau', Gen: 'Frau' },
      n: { Nom: 'Kind', Akk: 'Kind', Dat: 'Kind', Gen: 'Kindes' },
      pl: { Nom: 'Kinder', Akk: 'Kinder', Dat: 'Kindern', Gen: 'Kinder' },
    },
  },
  none: {
    adj: 'gut',
    nouns: {
      m: { Nom: 'Wein', Akk: 'Wein', Dat: 'Wein', Gen: 'Weins' },
      f: { Nom: 'Milch', Akk: 'Milch', Dat: 'Milch', Gen: 'Milch' },
      n: { Nom: 'Wasser', Akk: 'Wasser', Dat: 'Wasser', Gen: 'Wassers' },
      pl: { Nom: 'Freunde', Akk: 'Freunde', Dat: 'Freunden', Gen: 'Freunde' },
    },
  },
}

// -e = weak, -en = weak, -er/-es/-em = shows gender/case like der/das/dem
const ENDING_STYLE = {
  e: 'text-gray-900',
  en: 'text-indigo-700',
  er: 'text-amber-700',
  es: 'text-amber-700',
  em: 'text-amber-700',
}

export default function B2Adjektive() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Adjektivendungen</h1>
      <p className="text-base text-gray-500 mb-8">Alle Fälle · maskulin, feminin, neutral, Plural · mit und ohne Artikel</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Die Tabellen" defaultOpen>
          <Tables />
        </ReferenceSection>
        <ReferenceSection title="Die Regeln in 4 Sätzen">
          <Rules />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={makeSession}
        sessionKey="b2_adjektive"
        perfectText="Perfekt — alle Endungen richtig!"
      />
    </div>
  )
}

// ─── Reference: tables ────────────────────────────────────────────────────────

const VIEWS = [
  { id: 'all', label: 'Alle' },
  { id: 'def', label: 'der' },
  { id: 'indef', label: 'ein' },
  { id: 'none', label: 'ohne' },
]

function Tables() {
  const [view, setView] = useState('all')
  const shown = view === 'all' ? ['def', 'indef', 'none'] : [view]

  return (
    <div className="space-y-5">
      <div role="group" aria-label="Article type" className="flex p-1 bg-gray-200/70 rounded-xl">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={`flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
              view === v.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        <span className="font-bold text-gray-900">-e</span> ·{' '}
        <span className="font-bold text-indigo-700">-en</span> ·{' '}
        <span className="font-bold text-amber-700">-er / -es / -em</span> = the adjective shows the gender, because the article doesn't.
      </p>

      {shown.map(t => <TypeTable key={t} typeId={t} withExamples={view !== 'all'} />)}
    </div>
  )
}

function TypeTable({ typeId, withExamples }) {
  const type = TYPES[typeId]
  const ex = typeId === 'none' ? EXAMPLES.none : EXAMPLES.withArticle

  return (
    <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900">{type.label}</h3>
        <p className="text-sm text-gray-500">{type.short}</p>
      </div>

      <table className="w-full text-sm border-collapse table-fixed">
        <thead>
          <tr>
            <th className="w-[19%] sm:w-[16%] px-1 py-2 text-left text-xs font-semibold text-gray-500" />
            {GENDERS.map(g => (
              <th key={g} className="px-1 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span className="sm:hidden">{g === 'pl' ? 'Pl.' : g}</span>
                <span className="hidden sm:inline">{GENDER_NAMES[g]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CASES.map(c => (
            <tr key={c} className="border-t border-gray-100">
              <th scope="row" className="px-1 py-2.5 text-left text-sm font-semibold text-gray-700">{c}.</th>
              {GENDERS.map((g, gi) => {
                const ending = type.endings[c][gi]
                return (
                  <td key={g} className="px-1 py-2 text-center align-top">
                    <span className="block text-xs text-gray-500 leading-tight">
                      {type.articles ? type.articles[c][gi] : '—'}
                    </span>
                    <span className={`block text-lg font-bold leading-tight ${ENDING_STYLE[ending]}`}>-{ending}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {withExamples && (
        <div className="mt-5 space-y-3">
          {CASES.map(c => (
            <div key={c}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{CASE_NAMES[c]}</p>
              <p className="text-base text-gray-800 leading-relaxed">
                {GENDERS.map((g, gi) => {
                  const ending = type.endings[c][gi]
                  const art = type.articles ? type.articles[c][gi] + ' ' : ''
                  return (
                    <span key={g}>
                      {gi > 0 && <span className="text-gray-300"> · </span>}
                      {art}{ex.adj}<span className={`font-bold ${ENDING_STYLE[ending]}`}>{ending}</span> {ex.nouns[g][c]}
                    </span>
                  )
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">{type.also}</p>
    </div>
  )
}

function Rules() {
  return (
    <div className="space-y-4">
      <SectionCard num="1" title="Dativ, Genitiv and Plural with an article → always -en">
        <p className="text-base text-gray-700">mit dem neu<b>en</b> Auto · wegen des schlecht<b>en</b> Wetters · keine neu<b>en</b> Bücher</p>
      </SectionCard>
      <SectionCard num="2" title="der / die / das → -e in 5 places, otherwise -en">
        <p className="text-base text-gray-700">
          Nominativ singular (der/die/das) and Akkusativ die/das: der neu<b>e</b> Tisch · die neu<b>e</b> Lampe · das neu<b>e</b> Buch.
          Akkusativ masculine changes: de<b>n</b> neu<b>en</b> Tisch.
        </p>
      </SectionCard>
      <SectionCard num="3" title="ein / kein / mein → like der, except 3 places">
        <p className="text-base text-gray-700">
          Where „ein" has no ending (Nom. m, Nom. n, Akk. n) the adjective shows the gender:
          ein neu<b>er</b> Tisch (der) · ein neu<b>es</b> Buch (das).
        </p>
      </SectionCard>
      <SectionCard num="4" title="No article → the adjective takes the article's ending">
        <p className="text-base text-gray-700">
          de<b>r</b> → kalt<b>er</b> Kaffee · di<b>e</b> → frisch<b>e</b> Milch · da<b>s</b> → kalt<b>es</b> Wasser · de<b>m</b> → mit kalt<b>em</b> Wasser.
          Only exception: Genitiv m/n → -en (trotz schlecht<b>en</b> Wetters), because the noun already has -s.
        </p>
      </SectionCard>
    </div>
  )
}

// ─── Practice: generated questions ────────────────────────────────────────────

const ENDING_OPTIONS = ['e', 'en', 'er', 'es', 'em']

// Countable nouns: [word, genitive singular, plural, dative plural]
const NOUNS = {
  m: [['Tisch', 'Tisches', 'Tische', 'Tischen'], ['Computer', 'Computers', 'Computer', 'Computern'], ['Schrank', 'Schrankes', 'Schränke', 'Schränken'], ['Mantel', 'Mantels', 'Mäntel', 'Mänteln']],
  f: [['Tasche', 'Tasche', 'Taschen', 'Taschen'], ['Lampe', 'Lampe', 'Lampen', 'Lampen'], ['Jacke', 'Jacke', 'Jacken', 'Jacken'], ['Uhr', 'Uhr', 'Uhren', 'Uhren']],
  n: [['Auto', 'Autos', 'Autos', 'Autos'], ['Buch', 'Buches', 'Bücher', 'Büchern'], ['Fahrrad', 'Fahrrads', 'Fahrräder', 'Fahrrädern'], ['Handy', 'Handys', 'Handys', 'Handys']],
}
const ADJS = ['neu', 'alt', 'klein', 'groß', 'schön', 'modern', 'billig', 'rot']

// Uncountable nouns for "no article" singular: [word, genitive, adjectives]
const MASS = {
  m: [['Kaffee', 'Kaffees', ['heiß', 'stark', 'kalt']], ['Wein', 'Weins', ['rot', 'gut', 'billig']], ['Käse', 'Käses', ['frisch', 'alt', 'französisch']]],
  f: [['Milch', 'Milch', ['frisch', 'kalt', 'warm']], ['Butter', 'Butter', ['frisch', 'gut', 'irisch']], ['Schokolade', 'Schokolade', ['weiß', 'gut', 'heiß']]],
  n: [['Wasser', 'Wassers', ['kalt', 'warm', 'frisch']], ['Brot', 'Brotes', ['frisch', 'alt', 'warm']], ['Bier', 'Biers', ['kalt', 'gut', 'deutsch']]],
}

const FRAMES = {
  Nom: np => `Hier ${np.plural ? 'sind' : 'ist'} ${np.text}.`,
  Akk: np => `Ich brauche ${np.text}.`,
  Dat: np => `Ich bin zufrieden mit ${np.text}.`,
  Gen: np => `Der Preis ${np.text} ist hoch.`,
}

// ein-words: article endings per case and gender
const EIN_ENDINGS = { Nom: ['', 'e', '', 'e'], Akk: ['en', 'e', '', 'e'], Dat: ['em', 'er', 'em', 'en'], Gen: ['es', 'er', 'es', 'er'] }

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function makeQuestion(i) {
  const typeId = pick(['def', 'indef', 'none'])
  const c = pick(['Nom', 'Akk', 'Akk', 'Dat', 'Dat', 'Gen'])
  const gi = Math.floor(Math.random() * 4)
  const g = GENDERS[gi]
  const type = TYPES[typeId]
  const ending = type.endings[c][gi]

  let article = ''
  let adj
  let noun
  if (typeId === 'none' && g !== 'pl') {
    const [word, gen, adjs] = pick(MASS[g])
    adj = pick(adjs)
    noun = c === 'Gen' ? gen : word
  } else {
    // Plural questions use a plural form of any noun
    const [word, gen, pl, plDat] = pick(NOUNS[g === 'pl' ? pick(['m', 'f', 'n']) : g])
    adj = pick(ADJS)
    noun = g === 'pl' ? (c === 'Dat' ? plDat : pl) : c === 'Gen' ? gen : word
    if (typeId === 'def') article = type.articles[c][gi]
    if (typeId === 'indef') {
      // kein only in Nom/Akk, where it sounds natural ("Ich brauche keinen neuen Tisch")
      const bases = c === 'Nom' || c === 'Akk' ? ['ein', 'ein', 'kein', 'mein'] : ['ein', 'ein', 'mein']
      const base = g === 'pl' ? (c === 'Nom' || c === 'Akk' ? pick(['kein', 'mein']) : 'mein') : pick(bases)
      article = base + EIN_ENDINGS[c][gi]
    }
  }

  const text = `${article ? article + ' ' : ''}${adj}___ ${noun}`
  const full = `${article ? article + ' ' : ''}${adj}${ending} ${noun}`
  return {
    id: `adj_${typeId}_${c}_${g}_${i}`,
    usage: `${CASE_NAMES[c]} · ${GENDER_NAMES[g]} · ${typeId === 'def' ? 'der/die/das' : typeId === 'indef' ? 'ein/kein/mein' : 'ohne Artikel'}`,
    question: FRAMES[c]({ text, plural: g === 'pl' }),
    options: ENDING_OPTIONS,
    fixedOrder: true,
    answer: ending,
    explanation: `${full} — ${explain(typeId, c, g, ending)}`,
  }
}

function explain(typeId, c, g, ending) {
  if (typeId === 'none') {
    if (c === 'Gen' && (g === 'm' || g === 'n')) return 'No article, Genitiv m/n → -en (the noun already ends in -s).'
    return `No article → the adjective takes the article's ending (${TYPES.def.articles[c][GENDERS.indexOf(g)]} → -${ending}).`
  }
  if (c === 'Dat' || c === 'Gen' || g === 'pl') return 'With an article, Dativ, Genitiv and Plural are always -en.'
  if (typeId === 'indef' && (ending === 'er' || ending === 'es')) {
    return `„ein" has no ending here, so the adjective shows the gender (${ending === 'er' ? 'der' : 'das'} → -${ending}).`
  }
  if (ending === 'en') return 'Akkusativ masculine → -en (den / einen).'
  return 'Nominativ singular and Akkusativ feminine/neuter → -e.'
}

function makeSession() {
  const seen = new Set()
  const out = []
  let i = 0
  while (out.length < 20 && i < 200) {
    const q = makeQuestion(i++)
    if (seen.has(q.question)) continue
    seen.add(q.question)
    out.push(q)
  }
  return shuffle(out)
}
