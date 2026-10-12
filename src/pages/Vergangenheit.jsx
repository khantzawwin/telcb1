import { BackToGrammar, ReferenceSection, PracticeHeading } from '../components/DrillLayout'
import ChoiceDrill, { shuffle } from '../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../components/LearnBlocks'
import { VERB_GROUPS, IRREGULAR_VERBS } from '../data/irregularVerbs'

const SESSION_SIZE = 20

export default function Vergangenheit() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar#vergangenheit" label="Zeitformen der Vergangenheit" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Die Vergangenheit</h1>
      <p className="text-base text-gray-500 mb-8">
        Perfekt, Präteritum & Plusquamperfekt · Partizip II · {IRREGULAR_VERBS.length} unregelmäßige Verben
      </p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Die 3 Vergangenheitsformen — wann benutze ich was?" defaultOpen>
          <TensesGuide />
        </ReferenceSection>
        <ReferenceSection title="Partizip II bilden">
          <PartizipGuide />
        </ReferenceSection>
        <ReferenceSection title={`Unregelmäßige Verben nach Gruppen (${IRREGULAR_VERBS.length})`}>
          <VerbGroups />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={makeSession}
        sessionKey="vergangenheit"
        perfectText="Perfect — every form correct!"
      />
    </div>
  )
}

// ─── Learn: the three past tenses ─────────────────────────────────────────────

function TensesGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          German has three past tenses. They mostly don't differ in <em>meaning</em> but in <em>where</em> you use them:
          <strong> Perfekt</strong> when speaking (and in emails), <strong>Präteritum</strong> when writing stories and reports,
          and <strong>Plusquamperfekt</strong> for something that happened <em>before</em> another past event.
        </p>
      </div>

      <SectionCard title="One sentence, three tenses">
        <MiniTable
          head={['Zeitform', 'Beispiel']}
          rows={[
            ['Präsens', 'Ich gehe ins Kino.'],
            ['Perfekt', 'Ich bin ins Kino gegangen.'],
            ['Präteritum', 'Ich ging ins Kino.'],
            ['Plusquamperfekt', 'Ich war ins Kino gegangen.'],
          ]}
        />
      </SectionCard>

      <SectionCard num="1" title="Perfekt — spoken past" formula="haben / sein (Präsens) + Partizip II">
        <ul className="text-base text-gray-700 space-y-1.5 mb-4 list-disc pl-5">
          <li>Everyday conversation: what you did yesterday, last week, on holiday.</li>
          <li>Informal and semi-formal emails and letters, so also in <strong>TELC Schreiben</strong>.</li>
          <li>The Partizip II goes to the <strong>end</strong> of the sentence.</li>
          <li>
            <strong>sein</strong> for movement from A to B (gehen, fahren, fliegen), change of state (aufwachen, sterben, werden)
            and for sein, bleiben, passieren. <strong>haben</strong> for everything else.
          </li>
        </ul>
        <Ex de="Ich habe gestern lange gearbeitet." en="I worked late yesterday." />
        <Ex de="Wir sind im Sommer nach Spanien geflogen." en="We flew to Spain in the summer." />
        <Ex de="Hast du schon gegessen?" en="Have you eaten yet?" />
        <Ex de="Sie ist zu Hause geblieben, weil sie krank war." en="She stayed at home because she was ill." />
      </SectionCard>

      <SectionCard num="2" title="Präteritum — written past" formula="Verb in Präteritum form (ging, kam, machte)">
        <ul className="text-base text-gray-700 space-y-1.5 mb-4 list-disc pl-5">
          <li>Written texts: stories, novels, fairy tales, newspaper reports, CVs.</li>
          <li>
            In <strong>speech too</strong> for: sein (war), haben (hatte), werden (wurde), the modal verbs (konnte, musste, wollte,
            durfte, sollte) and <em>es gab</em>. „Ich war krank" sounds more natural than „Ich bin krank gewesen".
          </li>
          <li>Regular verbs: stem + <strong>-te</strong> (machen → machte). Irregular verbs change the vowel (see the groups below).</li>
        </ul>
        <Ex de="Gestern war ich müde und hatte keine Lust auf Sport." en="Yesterday I was tired and didn't feel like doing sport." />
        <Ex de="Ich musste lange auf den Bus warten." en="I had to wait a long time for the bus." />
        <Ex de="Es war einmal ein König, der drei Töchter hatte." en="Once upon a time there was a king who had three daughters." />
        <Ex de="Der Zug kam mit 20 Minuten Verspätung in Berlin an." en="The train arrived in Berlin 20 minutes late. (news style)" />
      </SectionCard>

      <SectionCard num="3" title="Plusquamperfekt — the past before the past" formula="hatte / war (Präteritum) + Partizip II">
        <ul className="text-base text-gray-700 space-y-1.5 mb-4 list-disc pl-5">
          <li>Something was <strong>already finished</strong> before another past event happened.</li>
          <li>
            Typical with <strong>nachdem</strong> (Plusquamperfekt in the nachdem clause, Präteritum/Perfekt in the main clause),
            <strong> bevor</strong>, <strong>schon</strong> and <strong>als</strong>.
          </li>
          <li>Same haben/sein rule as the Perfekt, just with hatte/war.</li>
        </ul>
        <Ex de="Nachdem ich gegessen hatte, ging ich spazieren." en="After I had eaten, I went for a walk." />
        <Ex de="Als wir am Bahnhof ankamen, war der Zug schon abgefahren." en="When we arrived at the station, the train had already left." />
        <Ex de="Ich hatte die Prüfung gut vorbereitet, deshalb war ich ruhig." en="I had prepared well for the exam, so I was calm." />
      </SectionCard>
    </div>
  )
}

// ─── Learn: building the Partizip II ──────────────────────────────────────────

function PartizipGuide() {
  return (
    <div className="space-y-6">
      <SectionCard title="Regular verbs" formula="ge- + Stamm + -(e)t">
        <MiniTable
          head={['Infinitiv', 'Partizip II']}
          rows={[
            ['machen', 'gemacht'],
            ['kaufen', 'gekauft'],
            ['arbeiten', 'gearbeitet (-et after -t / -d)'],
          ]}
        />
      </SectionCard>
      <SectionCard title="Irregular verbs" formula="ge- + Stamm (often new vowel) + -en">
        <MiniTable
          head={['Infinitiv', 'Partizip II']}
          rows={[
            ['schreiben', 'geschrieben'],
            ['trinken', 'getrunken'],
            ['bringen', 'gebracht (mixed: vowel change + -t)'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">The vowel follows a pattern; see the verb groups below.</p>
      </SectionCard>
      <SectionCard title="Separable verbs" formula="Präfix + ge + Stamm">
        <MiniTable
          head={['Infinitiv', 'Partizip II']}
          rows={[
            ['aufmachen', 'aufgemacht'],
            ['anrufen', 'angerufen'],
            ['einkaufen', 'eingekauft'],
          ]}
        />
      </SectionCard>
      <SectionCard title="No ge-" formula="be- ver- ent- er- emp- ge- zer- miss- · -ieren">
        <MiniTable
          head={['Infinitiv', 'Partizip II']}
          rows={[
            ['bezahlen', 'bezahlt'],
            ['verstehen', 'verstanden'],
            ['empfehlen', 'empfohlen'],
            ['studieren', 'studiert'],
            ['telefonieren', 'telefoniert'],
          ]}
        />
      </SectionCard>
    </div>
  )
}

// ─── Learn: irregular verbs by vowel group ────────────────────────────────────

function VerbGroups() {
  return (
    <div className="space-y-5">
      <p className="text-base text-gray-700 leading-relaxed">
        Learn irregular verbs in groups: verbs with the same vowel change behave alike.
        Read the pattern as <strong>Infinitiv – Präteritum – Partizip II</strong>.
        <span className="text-gray-500"> „ist" = Perfekt with sein, „hat" = with haben.</span>
      </p>
      {VERB_GROUPS.map(g => (
        <div key={g.id} className="bg-white rounded-3xl shadow-sm p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h3 className="text-lg font-bold text-indigo-700">{g.label}</h3>
            <span className="text-sm text-gray-500 flex-shrink-0">{g.verbs.length} Verben</span>
          </div>
          <p className="text-sm text-gray-600 mb-1 italic">{g.example}</p>
          {g.note && <p className="text-sm text-gray-500 mb-3">{g.note}</p>}
          <div className="overflow-x-auto -mx-1 mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {['Infinitiv', 'Präteritum', 'Partizip II', 'English'].map(h => (
                    <th key={h} className={`px-3 py-2 border border-gray-200 text-left font-semibold text-gray-700 ${h === 'English' ? 'hidden sm:table-cell' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.verbs.map(([inf, prat, part, aux, en, flags = {}], i) => (
                  <tr key={inf} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 border border-gray-200 font-semibold text-gray-900 whitespace-nowrap">{inf}</td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-700">{prat}</td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-700 whitespace-nowrap">
                      <span className={aux === 'ist' ? 'text-amber-700 font-medium' : 'text-gray-500'}>
                        {flags.both ? 'ist/hat' : aux}
                      </span>{' '}
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-500 hidden sm:table-cell">{en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Practice: generated from the verb list ───────────────────────────────────
// Three question types: Partizip II, Präteritum, and haben/sein (Perfekt or
// Plusquamperfekt). Wrong options are the typical learner mistakes:
// regularised forms (gebleibt, findete), ge + infinitive (gebleiben), etc.

function makeSession() {
  const auxVerbs = IRREGULAR_VERBS.filter(v => !v.both)
  const picks = shuffle(IRREGULAR_VERBS).slice(0, SESSION_SIZE)
  return picks.map((v, i) => {
    const type = i % 5 < 2 ? 'part' : i % 5 < 4 ? 'prat' : 'aux'
    const q = type === 'aux'
      ? auxQuestion(auxVerbs[Math.floor(Math.random() * auxVerbs.length)], i)
      : type === 'part' ? partQuestion(v, i) : pratQuestion(v, i)
    return { ...q, options: shuffle(q.options) }
  })
}

function stemOf(inf) {
  return inf.replace(/e?n$/, '')
}

function regularEnding(stem) {
  return /[dt]$/.test(stem) ? 'et' : 't'
}

// Participle without an extra ge- (verstanden, begonnen, gelungen, vergessen)
function hasNoGe(v) {
  return !v.part.startsWith('ge') || (v.inf.startsWith('ge') && !v.part.startsWith('gege'))
}

function pickDistractors(correct, candidates, n = 3) {
  const out = []
  for (const c of candidates) {
    if (c && c !== correct && !out.includes(c)) out.push(c)
    if (out.length === n) break
  }
  return out
}

function summary(v) {
  return `${v.inf} – ${v.prat} – ${v.both ? 'ist/hat' : v.aux} ${v.part} (${v.group}) · ${v.en}`
}

function partQuestion(v, i) {
  const ge = hasNoGe(v) ? '' : 'ge'
  const stem = stemOf(v.inf)
  const pratBase = v.prat.replace(/te$/, '')
  const options = [v.part, ...pickDistractors(v.part, [
    ge + stem + regularEnding(stem),            // gebleibt
    hasNoGe(v) ? 'ge' + v.part : 'ge' + v.inf,  // geverstanden / gebleiben
    ge + pratBase + 'en',                       // gefanden
    ge + pratBase + 't',                        // gefandt
    ge + stem + 'en',
  ])]
  const aux = v.aux === 'ist' ? 'bin' : 'habe'
  return {
    id: `pt_${v.inf}_${i}`,
    usage: `Partizip II · ${v.inf}`,
    question: `Perfekt: Ich ${aux} ___ . (${v.inf})`,
    options,
    answer: v.part,
    explanation: summary(v),
  }
}

function pratQuestion(v, i) {
  const stem = stemOf(v.inf)
  const partCore = (hasNoGe(v) ? v.part : v.part.replace(/^ge/, '')).replace(/(en|t)$/, '')
  const options = [v.prat, ...pickDistractors(v.prat, [
    stem + (regularEnding(stem) === 'et' ? 'ete' : 'te'),  // bleibte / findete
    partCore,                                             // fund / gang
    stem,                                                 // bleib
    v.prat + 'te',
  ])]
  return {
    id: `pr_${v.inf}_${i}`,
    usage: `Präteritum · ${v.inf}`,
    question: `Präteritum: Gestern ___ ich … (${v.inf})`,
    options,
    answer: v.prat,
    explanation: summary(v),
  }
}

function auxQuestion(v, i) {
  const plusq = Math.random() < 0.4
  const answer = v.aux === 'ist' ? (plusq ? 'war' : 'bin') : (plusq ? 'hatte' : 'habe')
  return {
    id: `ax_${v.inf}_${i}`,
    usage: plusq ? 'Plusquamperfekt: hatte oder war?' : 'Perfekt: haben oder sein?',
    question: `Ich ___ ${v.part}. (${v.inf})`,
    options: plusq ? ['hatte', 'war'] : ['habe', 'bin'],
    answer,
    explanation: `${v.aux === 'ist' ? 'sein — movement, change of state, or sein/bleiben' : 'haben — no movement from A to B or change of state'}. ${summary(v)}`,
  }
}
