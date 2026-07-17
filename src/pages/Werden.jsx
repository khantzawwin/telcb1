import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNavGuard } from '../contexts/NavGuardContext'
import { getTodayKey } from '../utils/srs'

// ─── Exercise pool — every job the verb "werden" does ────────────────────────

const EXERCISES = [
  // ── Vollverb: to become / to get ──
  { id: 'wd_01', usage: 'Vollverb — werden = to become', question: 'Im Herbst ___ es abends früher dunkel.', options: ['wird', 'wurde', 'würde', 'worden'], answer: 'wird', explanation: 'As a full verb, "werden" means to become/get. Present, 3rd person singular → wird. "Es wird dunkel" = it is getting dark.' },
  { id: 'wd_02', usage: 'Vollverb Präteritum', question: 'Als er die Rechnung sah, ___ er ganz blass.', options: ['wurde', 'würde', 'wird', 'worden'], answer: 'wurde', explanation: 'Full-verb "werden" in the simple past = wurde. "Er wurde blass" = he turned pale.' },
  { id: 'wd_03', usage: 'Vollverb Perfekt (sein + geworden)', question: 'Nach dem Studium ist sie Ärztin ___.', options: ['geworden', 'worden', 'gewesen', 'wurde'], answer: 'geworden', explanation: 'Full-verb "werden" forms its Perfekt with sein + geworden: "ist … geworden". Note: geworden, NOT worden (worden is only for the passive).' },
  { id: 'wd_04', usage: 'Vollverb — werden + Adjektiv', question: 'Wenn du nicht schläfst, ___ du morgen müde sein.', options: ['wirst', 'wurdest', 'würdest', 'bist'], answer: 'wirst', explanation: '2nd person singular present of werden = wirst. Here it doubles as the future (see Futur I).' },

  // ── Futur I: werden + Infinitiv ──
  { id: 'wd_05', usage: 'Futur I (werden + Infinitiv)', question: 'Nächstes Jahr ___ ich nach Berlin ziehen.', options: ['werde', 'wurde', 'würde', 'bin'], answer: 'werde', explanation: 'Futur I = werden (conjugated) + Infinitiv at the end. ich → werde … ziehen.' },
  { id: 'wd_06', usage: 'Futur I: Vermutung (probability)', question: 'Wo ist Tom? — Er ___ wohl noch im Büro sein.', options: ['wird', 'würde', 'ist', 'wurde'], answer: 'wird', explanation: 'Futur I also expresses a present assumption, often with "wohl". "Er wird wohl … sein" = he is probably … .' },

  // ── Vorgangspassiv (process passive): werden + Partizip II ──
  { id: 'wd_07', usage: 'Vorgangspassiv Präsens', question: 'Das neue Rathaus ___ gerade gebaut.', options: ['wird', 'ist', 'wurde', 'hat'], answer: 'wird', explanation: 'Passiv Präsens = wird + Partizip II. "wird gebaut" = is being built (an ongoing process).' },
  { id: 'wd_08', usage: 'Vorgangspassiv Präteritum', question: 'Die alte Brücke ___ 1925 gebaut.', options: ['wurde', 'ist', 'war', 'wird'], answer: 'wurde', explanation: 'Passiv Präteritum = wurde + Partizip II. "wurde gebaut" = was built.' },
  { id: 'wd_09', usage: 'Passiv Präteritum (Plural)', question: 'Nach dem Sturm ___ viele Bäume gefällt.', options: ['wurden', 'wurde', 'sind', 'waren'], answer: 'wurden', explanation: 'The subject "viele Bäume" is plural → wurden (Passiv Präteritum plural).' },
  { id: 'wd_10', usage: 'Passiv Perfekt (ist … worden)', question: 'Der Vertrag ist gestern endlich unterschrieben ___.', options: ['worden', 'geworden', 'gewesen', 'wurde'], answer: 'worden', explanation: 'Passiv Perfekt = sein + Partizip II + worden. After another Partizip, "werden" becomes worden — never geworden.' },
  { id: 'wd_11', usage: 'Passiv Perfekt', question: 'Mein Auto ist letzte Woche repariert ___.', options: ['worden', 'geworden', 'wurde', 'war'], answer: 'worden', explanation: 'Same rule: passive Perfekt ends in "worden". "ist repariert worden" = has been repaired.' },
  { id: 'wd_12', usage: 'Passiv mit Modalverb', question: 'Die Rechnung muss bis Freitag bezahlt ___.', options: ['werden', 'worden', 'wurde', 'sein'], answer: 'werden', explanation: 'Passive with a modal = Modalverb + Partizip II + werden (Infinitiv). "muss … bezahlt werden" = must be paid.' },
  { id: 'wd_13', usage: 'Passiv Futur', question: 'Das Projekt ___ erst nächstes Jahr fertiggestellt werden.', options: ['wird', 'wurde', 'würde', 'ist'], answer: 'wird', explanation: 'Passiv Futur = wird + Partizip II + werden. "wird fertiggestellt werden" = will be completed.' },

  // ── Vorgangspassiv vs Zustandspassiv ──
  { id: 'wd_14', usage: 'Vorgangspassiv vs. Zustandspassiv', question: 'Vorsicht, die automatische Tür ___ gerade geöffnet — warte kurz.', options: ['wird', 'ist', 'wurde', 'war'], answer: 'wird', explanation: 'Process (something is happening now) → Vorgangspassiv with werden: "wird geöffnet". State (it is already open) would be "ist geöffnet" (sein).' },

  // ── Konjunktiv II: würde + Infinitiv ──
  { id: 'wd_15', usage: 'Konjunktiv II (würde + Infinitiv)', question: 'An deiner Stelle ___ ich sofort einen Arzt anrufen.', options: ['würde', 'wurde', 'werde', 'wird'], answer: 'würde', explanation: 'würde + Infinitiv = Konjunktiv II (would). Hypothetical advice → würde … anrufen. Note the Umlaut vs. real-past "wurde".' },
  { id: 'wd_16', usage: 'Konjunktiv II: höfliche Bitte', question: '___ Sie mir bitte kurz die Tür öffnen?', options: ['Würden', 'Wurden', 'Werden', 'Worden'], answer: 'Würden', explanation: 'A polite request uses Konjunktiv II: "Würden Sie …?" The Umlaut marks the polite/hypothetical form.' },
  { id: 'wd_17', usage: 'Konjunktiv II (hypothetisch)', question: 'Wenn ich mehr Zeit hätte, ___ ich öfter ins Kino gehen.', options: ['würde', 'wurde', 'werde', 'bin'], answer: 'würde', explanation: 'The "wenn … hätte" signals a hypothesis → würde + Infinitiv. Not the real past "wurde".' },

  // ── worden vs. geworden ──
  { id: 'wd_18', usage: 'geworden vs. worden', question: 'Dank des Videos ist sie über Nacht berühmt ___.', options: ['geworden', 'worden', 'gewesen', 'wurde'], answer: 'geworden', explanation: 'Here "werden" is a full verb (to become famous), standing alone → geworden. There is no other Partizip in front.' },
  { id: 'wd_19', usage: 'geworden vs. worden', question: 'Nach langer Diskussion ist das Problem endlich gelöst ___.', options: ['worden', 'geworden', 'wurde', 'war'], answer: 'worden', explanation: 'There is a Partizip in front ("gelöst") → this is passive → worden. Rule: Partizip before it = worden; standing alone = geworden.' },

  // ── Konjugation (present forms) ──
  { id: 'wd_20', usage: 'Konjugation Präsens (du)', question: '___ du morgen wirklich zur Party kommen?', options: ['Wirst', 'Wird', 'Werdet', 'Würdest'], answer: 'Wirst', explanation: 'Present tense: du wirst (irregular — note the vowel change e → i). Here forming Futur I.' },
  { id: 'wd_21', usage: 'Konjugation Präsens (ihr)', question: '___ ihr uns beim Umzug am Samstag helfen?', options: ['Werdet', 'Werden', 'Wird', 'Wollt'], answer: 'Werdet', explanation: 'Present tense: ihr werdet. The full set: ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie werden.' },
]

const SESSION_SIZE = 10

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildSession(exercises, size) {
  return shuffle(exercises)
    .slice(0, size)
    .map(q => ({ ...q, options: shuffle(q.options) }))
}

function reshuffle(exercises) {
  return shuffle(exercises).map(q => ({ ...q, options: shuffle(q.options) }))
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Werden() {
  const [tab, setTab] = useState('reference')

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-1.5">Verb Deep-Dive</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Das Verb <span className="text-indigo-600">werden</span></h1>
      <p className="text-base text-gray-400 mb-8">
        One verb, five jobs: full verb (to become), future, passive, probability and Konjunktiv II.
      </p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['reference', 'Learn'], ['exercise', 'Practice']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'exercise' ? <ExerciseTab /> : <ReferenceTab />}
    </div>
  )
}

// ─── Practice tab ─────────────────────────────────────────────────────────────

function ExerciseTab() {
  const { user } = useAuth()
  const { setGuard } = useNavGuard()
  const [questions, setQuestions] = useState(() => buildSession(EXERCISES, SESSION_SIZE))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [mistakes, setMistakes] = useState([])
  const [isReview, setIsReview] = useState(false)

  useEffect(() => {
    if (done && user) {
      setDoc(
        doc(db, 'users', user.uid, 'sessions', getTodayKey()),
        { werden: { completed: true, completedAt: new Date().toISOString() } },
        { merge: true }
      ).catch(() => {})
    }
  }, [done, user])

  useEffect(() => {
    const inProgress = !done && (index > 0 || selected !== null)
    setGuard(inProgress ? 'Leaving this page will reset your current exercise session. Are you sure?' : null)
    return () => setGuard(null)
  }, [done, index, selected, setGuard])

  const q = questions[index]
  const isCorrect = selected === q?.answer
  const answered = selected !== null

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
    if (opt === q.answer) setScore(s => s + 1)
    else setMistakes(m => m.some(x => x.id === q.id) ? m : [...m, q])
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) setDone(true)
    else { setIndex(i => i + 1); setSelected(null) }
  }

  const handleRestart = () => {
    setQuestions(buildSession(EXERCISES, SESSION_SIZE))
    setIndex(0); setSelected(null); setScore(0); setMistakes([]); setIsReview(false); setDone(false)
  }

  const handleReviewMistakes = () => {
    setQuestions(reshuffle(mistakes))
    setIndex(0); setSelected(null); setScore(0); setMistakes([]); setIsReview(true); setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const missed = mistakes.length
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
        {isReview && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">Review round</p>
        )}
        <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-green-600' : 'text-amber-500'}`}>
          {score}/{questions.length}
        </div>
        <p className="text-gray-500 mb-1">{pct}% correct</p>
        <p className="text-sm text-gray-400 mb-8">
          {missed === 0 ? 'Perfect — every form correct! 🎉' :
           pct >= 70 ? `You missed ${missed}. Drill them now while they're fresh.` :
           `${missed} to review. Repetition is how these forms stick.`}
        </p>

        {missed > 0 && (
          <button
            onClick={handleReviewMistakes}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all mb-3 sm:mb-0 sm:mr-3"
          >
            Review {missed} mistake{missed > 1 ? 's' : ''} →
          </button>
        )}
        <button
          onClick={handleRestart}
          className={`w-full sm:w-auto px-8 py-3 font-semibold rounded-2xl transition-all ${
            missed > 0 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          New session
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
        <span>
          {isReview && <span className="font-semibold text-indigo-500">Review · </span>}
          Question {index + 1} of {questions.length}
        </span>
        <span>{score} correct</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-400 rounded-full transition-all duration-300" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{q.usage}</span>
        </div>
        <div className="px-6 pt-6 pb-5">
          <p className="text-lg text-gray-900 font-medium leading-relaxed mb-6">
            {q.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[3rem] mx-1 border-b-2 text-center font-bold ${
                    answered
                      ? isCorrect ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400'
                      : 'border-gray-400 text-transparent'
                  }`}>
                    {answered ? selected : '___'}
                  </span>
                )}
              </span>
            ))}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {q.options.map(opt => {
              let style = 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              if (answered) {
                if (opt === q.answer) style = 'bg-green-50 text-green-700 border border-green-300 font-semibold'
                else if (opt === selected) style = 'bg-red-50 text-red-600 border border-red-300'
                else style = 'bg-gray-50 text-gray-400 border border-gray-100'
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                  className={`py-3 rounded-2xl text-base font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? 'Correct' : `Correct answer: ${q.answer}`}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          <button
            onClick={answered ? handleNext : undefined}
            disabled={!answered}
            className={`w-full py-3.5 rounded-2xl text-base font-semibold transition-all ${
              answered ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {index + 1 >= questions.length ? 'See results' : 'Next question'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Learn tab ────────────────────────────────────────────────────────────────

function ReferenceTab() {
  return (
    <div className="space-y-6">

      {/* Intro */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          <strong>werden</strong> is one of the most important verbs in German because it does several completely different
          jobs. The trick is to look at <em>what comes after it</em>: nothing extra → <em>to become</em>; an infinitive → <em>future</em>;
          a Partizip II → <em>passive</em>; and its Konjunktiv II form <strong>würde</strong> → <em>would</em>.
        </p>
      </div>

      {/* Conjugation */}
      <SectionCard title="Conjugation — the forms you need">
        <MiniTable
          head={['Person', 'Präsens', 'Präteritum', 'Konjunktiv II']}
          rows={[
            ['ich', 'werde', 'wurde', 'würde'],
            ['du', 'wirst', 'wurdest', 'würdest'],
            ['er / sie / es', 'wird', 'wurde', 'würde'],
            ['wir', 'werden', 'wurden', 'würden'],
            ['ihr', 'werdet', 'wurdet', 'würdet'],
            ['sie / Sie', 'werden', 'wurden', 'würden'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          Partizip II: <strong>geworden</strong> (full verb) · <strong>worden</strong> (passive only).
          Watch the vowels: <em>wu</em>rde = real past · w<em>ü</em>rde = hypothetical.
        </p>
      </SectionCard>

      {/* Usage 1 — Vollverb */}
      <SectionCard num="1" title="Full verb: to become / to get" formula="werden + Nomen / Adjektiv">
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          On its own, <strong>werden</strong> describes a <strong>change of state</strong> — becoming or getting something.
          It forms the Perfekt with <strong>sein + geworden</strong>.
        </p>
        <Ex de="Es wird kalt." en="It is getting cold." />
        <Ex de="Er wird nächstes Jahr Vater." en="He is becoming a father next year." />
        <Ex de="Sie ist Ärztin geworden." en="She has become a doctor. (Perfekt)" />
        <Ex de="Mir wurde plötzlich schlecht." en="I suddenly felt sick. (Präteritum)" />
      </SectionCard>

      {/* Usage 2 — Futur I */}
      <SectionCard num="2" title="Future (Futur I)" formula="werden + Infinitiv">
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          werden + an infinitive at the end of the clause expresses the <strong>future</strong>. In everyday German the present
          tense often covers the future too, so Futur I is used for emphasis, promises or predictions.
        </p>
        <Ex de="Ich werde dich morgen anrufen." en="I will call you tomorrow." />
        <Ex de="Wir werden im Sommer nach Italien fahren." en="We will go to Italy in summer." />
      </SectionCard>

      {/* Usage 3 — probability */}
      <SectionCard num="3" title="Probability / assumption" formula="werden + Infinitiv (+ wohl)">
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          The same werden + Infinitiv structure expresses a <strong>present assumption</strong> (what is probably true now),
          usually with words like <em>wohl</em>, <em>schon</em> or <em>bestimmt</em>.
        </p>
        <Ex de="Er wird wohl im Stau stehen." en="He's probably stuck in traffic." />
        <Ex de="Das wird schon stimmen." en="That'll be right / is probably correct." />
      </SectionCard>

      {/* Usage 4 — Passive */}
      <SectionCard num="4" title="Passive voice (Vorgangspassiv)" formula="werden + Partizip II">
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          werden + Partizip II makes the <strong>passive</strong> — the focus is on the action, not who does it. This is the
          biggest source of confusion because <strong>werden</strong> itself changes across the tenses, and the Perfekt uses the
          special form <strong>worden</strong>.
        </p>
        <MiniTable
          head={['Tense', 'Passive form', 'Example']}
          rows={[
            ['Präsens', 'wird + Part. II', 'Das Haus wird gebaut.'],
            ['Präteritum', 'wurde + Part. II', 'Das Haus wurde gebaut.'],
            ['Perfekt', 'ist + Part. II + worden', 'Das Haus ist gebaut worden.'],
            ['Plusquamperfekt', 'war + Part. II + worden', 'Das Haus war gebaut worden.'],
            ['Futur', 'wird + Part. II + werden', 'Das Haus wird gebaut werden.'],
            ['mit Modalverb', 'muss + Part. II + werden', 'Das Haus muss gebaut werden.'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          The agent (who does it) is added with <strong>von + Dativ</strong>: <em>Das Haus wird von der Firma gebaut.</em>
        </p>
      </SectionCard>

      {/* Usage 5 — Konjunktiv II */}
      <SectionCard num="5" title="Konjunktiv II: would (würde)" formula="würde + Infinitiv">
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          The Konjunktiv II form <strong>würde</strong> + Infinitiv means <strong>would</strong>. Use it for hypothetical
          situations, wishes and <strong>polite requests</strong>.
        </p>
        <Ex de="Ich würde dir gern helfen." en="I would gladly help you." />
        <Ex de="Würden Sie bitte einen Moment warten?" en="Would you please wait a moment?" />
        <Ex de="Wenn ich reich wäre, würde ich reisen." en="If I were rich, I would travel." />
      </SectionCard>

      {/* The five look-alikes */}
      <SectionCard title="The five look-alikes — quick reference">
        <MiniTable
          head={['Form', 'Job', 'Example']}
          rows={[
            ['wird', 'present / future / passive present', 'Er wird Arzt. · Es wird gebaut.'],
            ['wurde', 'real past (simple past / passive past)', 'Es wurde gebaut.'],
            ['würde', 'Konjunktiv II — would (hypothetical)', 'Ich würde helfen.'],
            ['worden', 'Partizip in the passive Perfekt', 'ist gebaut worden'],
            ['geworden', 'Partizip of the full verb (become)', 'ist Arzt geworden'],
          ]}
        />
      </SectionCard>

      {/* Vorgang vs Zustand */}
      <SectionCard title="Don't confuse: werden vs. sein passive">
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          <strong>werden</strong> = an <strong>action in progress</strong> (Vorgangspassiv). <strong>sein</strong> = the
          <strong> finished state</strong> (Zustandspassiv).
        </p>
        <Ex de="Das Geschäft wird um 8 Uhr geöffnet." en="The shop is (being) opened at 8. — the action" />
        <Ex de="Das Geschäft ist ab 8 Uhr geöffnet." en="The shop is open from 8. — the state" />
      </SectionCard>

    </div>
  )
}

// ─── Small presentational helpers ─────────────────────────────────────────────

function SectionCard({ num, title, formula, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        {num && (
          <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold mt-0.5">
            {num}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
          {formula && (
            <p className="mt-1 inline-block text-sm font-mono font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {formula}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function MiniTable({ head, rows }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2.5 border border-gray-200 text-left font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2.5 border border-gray-200 text-gray-700 ${ci === 0 ? 'font-semibold text-gray-900 whitespace-nowrap' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Ex({ de, en }) {
  return (
    <div className="border-l-4 border-indigo-200 pl-4 py-1 my-2">
      <p className="text-base text-gray-900 font-medium">{de}</p>
      <p className="text-sm text-gray-500">{en}</p>
    </div>
  )
}
