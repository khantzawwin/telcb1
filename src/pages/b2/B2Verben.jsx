import { useSearchParams } from 'react-router-dom'
import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { shuffle } from '../../components/ChoiceDrill'
import { VERB_GROUPS, IRREGULAR_VERBS } from '../../data/irregularVerbs'
import { VerbGroups, makeSession as makeFormQuestions } from '../Vergangenheit'

const SESSION_SIZE = 20

// Irregular verbs grouped by how they change (ei – ie – ie, ie – o – o …).
// Pick a group to learn and drill just that group, or "Alle" to mix them.
// The chosen group is in the URL (?gruppe=ei-ie-ie) so it survives a reload.
export default function B2Verben() {
  const [params, setParams] = useSearchParams()
  const groupId = VERB_GROUPS.some(g => g.id === params.get('gruppe')) ? params.get('gruppe') : 'all'
  const group = VERB_GROUPS.find(g => g.id === groupId)

  const choose = id => setParams(id === 'all' ? {} : { gruppe: id }, { replace: true })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Unregelmäßige Verben</h1>
      <p className="text-base text-gray-500 mb-6">
        {IRREGULAR_VERBS.length} Verben in {VERB_GROUPS.length} Gruppen · Infinitiv – Präteritum – Partizip II
      </p>

      <div role="group" aria-label="Verb group" className="flex flex-wrap gap-2 mb-8">
        <Chip active={groupId === 'all'} onClick={() => choose('all')}>Alle</Chip>
        {VERB_GROUPS.map(g => (
          <Chip key={g.id} active={groupId === g.id} onClick={() => choose(g.id)}>
            {g.id === 'sonstige' ? 'Sonstige' : g.label}
            <span className="ml-1.5 text-xs opacity-70">{g.verbs.length}</span>
          </Chip>
        ))}
      </div>

      <div className="space-y-4 mb-10">
        <ReferenceSection
          key={groupId}
          title={group ? `${group.label} · ${group.example}` : 'Alle Gruppen'}
          defaultOpen={!!group}
        >
          <VerbGroups groups={group ? [group] : VERB_GROUPS} />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        key={groupId}
        makeSession={() => makeDrill(group)}
        sessionKey="b2_verben"
        upNextKey="verben"
        perfectText="Perfekt — alle Formen richtig!"
      />
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] px-4 rounded-full text-sm font-semibold border transition-colors ${
        active
          ? 'bg-indigo-600 border-indigo-600 text-white'
          : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-700'
      }`}
    >
      {children}
    </button>
  )
}

// One group: its forms, each verb about twice. All groups: forms plus
// "which group?" questions, so the patterns themselves get practised.
function makeDrill(group) {
  if (group) {
    const verbs = IRREGULAR_VERBS.filter(v => v.group === group.label)
    const size = Math.min(SESSION_SIZE, verbs.length * 2)
    return makeFormQuestions(shuffle([...verbs, ...verbs]), size)
  }
  return shuffle([...makeFormQuestions(IRREGULAR_VERBS, 14), ...groupQuestions(6)])
}

// Pattern groups only: "Sonstige" has no shared pattern to recognise
const PATTERN_GROUPS = VERB_GROUPS.filter(g => g.id !== 'sonstige')

function groupQuestions(n) {
  const verbs = shuffle(IRREGULAR_VERBS.filter(v => PATTERN_GROUPS.some(g => g.label === v.group))).slice(0, n)
  return verbs.map((v, i) => {
    const others = shuffle(PATTERN_GROUPS.filter(g => g.label !== v.group)).slice(0, 3).map(g => g.label)
    return {
      id: `grp_${v.inf}_${i}`,
      usage: 'Welche Gruppe?',
      question: `${v.inf} – ${v.prat} – ${v.part}: ___`,
      options: shuffle([v.group, ...others]),
      answer: v.group,
      explanation: `${v.inf} – ${v.prat} – ${v.both ? 'ist/hat' : v.aux} ${v.part} (${v.en}) belongs to „${v.group}".`,
    }
  })
}
