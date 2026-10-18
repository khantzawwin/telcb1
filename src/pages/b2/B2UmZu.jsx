import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2UmZu() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">um … zu</h1>
      <p className="text-base text-gray-500 mb-8">Ziel & Zweck ausdrücken · damit · ohne … zu · statt … zu</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="um … zu + Infinitiv" defaultOpen>
          <UmZu />
        </ReferenceSection>
        <ReferenceSection title="um … zu oder damit?">
          <Damit />
        </ReferenceSection>
        <ReferenceSection title="ohne … zu · statt … zu · zu ohne um">
          <Others />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_umzu"
        perfectText="Perfekt — um … zu sitzt!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function UmZu() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 sm:p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          <strong>um … zu</strong> says <strong>why / what for</strong> (Wozu?) — the goal of an action.
          It has <strong>no subject</strong>: both parts are about the same person.
        </p>
      </div>

      <SectionCard num="1" title="Die Form" formula="…, um + … + zu + Infinitiv">
        <Ex de="Ich lerne Deutsch, um in Deutschland zu arbeiten." en="I'm learning German (in order) to work in Germany." />
        <Ex de="Sie spart Geld, um eine Reise zu machen." en="She is saving money to go on a trip." />
        <p className="text-sm text-gray-500 mt-2">Wozu lernst du Deutsch? – <em>Um in Deutschland zu arbeiten.</em></p>
      </SectionCard>

      <SectionCard num="2" title="Am Satzanfang" formula="Um … zu …, Verb + Subjekt …">
        <Ex de="Um fit zu bleiben, gehe ich jeden Tag joggen." en="To stay fit, I go jogging every day." />
        <p className="text-sm text-gray-500 mt-2">The whole um-part is position 1, so the verb comes next.</p>
      </SectionCard>

      <SectionCard num="3" title="Trennbare Verben & Modalverben">
        <MiniTable
          head={['Verb', 'um … zu']}
          rows={[
            ['einkaufen', <>um <strong>einzukaufen</strong></>],
            ['aufstehen', <>um früh <strong>aufzustehen</strong></>],
            ['anrufen', <>um dich <strong>anzurufen</strong></>],
            ['können', <>um besser arbeiten <strong>zu können</strong></>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          Separable verbs: <strong>zu</strong> goes between prefix and verb, written as one word.
          Don't use <em>wollen / möchten</em> in the um-part — the goal is already in „um".
        </p>
      </SectionCard>
    </div>
  )
}

function Damit() {
  return (
    <div className="space-y-6">
      <SectionCard title="Same subject → um … zu · different subject → damit" formula="damit + Subjekt … Verb (Ende)">
        <MiniTable
          head={['', 'Beispiel']}
          rows={[
            ['ich → ich', <>Ich lerne viel, <strong>um</strong> die Prüfung <strong>zu bestehen</strong>.</>],
            ['ich → du', <>Ich erkläre es noch einmal, <strong>damit</strong> du es <strong>verstehst</strong>.</>],
            ['sie → die Kinder', <>Sie spart, <strong>damit</strong> ihre Kinder studieren <strong>können</strong>.</>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          damit also works with the same subject (<em>Ich lerne viel, damit ich die Prüfung bestehe.</em>),
          but um … zu is shorter and sounds better.
        </p>
      </SectionCard>
    </div>
  )
}

function Others() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="ohne … zu — without doing" formula="…, ohne … zu + Infinitiv">
        <Ex de="Er ist gegangen, ohne sich zu verabschieden." en="He left without saying goodbye." />
        <Ex de="Sie hat den Vertrag unterschrieben, ohne ihn zu lesen." en="She signed the contract without reading it." />
      </SectionCard>
      <SectionCard num="2" title="(an)statt … zu — instead of doing" formula="…, statt … zu + Infinitiv">
        <Ex de="Statt zu lernen, hat er ferngesehen." en="Instead of studying, he watched TV." />
        <Ex de="Nimm doch das Fahrrad, anstatt mit dem Auto zu fahren." en="Take the bike instead of driving." />
      </SectionCard>
      <SectionCard num="3" title="zu + Infinitiv — no um!" formula="Lust haben / vorhaben / Es ist wichtig, … zu …">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          After many verbs, nouns and adjectives, use only <strong>zu</strong>. That isn't a goal, so no „um".
        </p>
        <Ex de="Ich habe keine Lust, ins Kino zu gehen." en="✗ … um ins Kino zu gehen" />
        <Ex de="Es ist wichtig, regelmäßig Sport zu treiben." en="It's important to do sport regularly." />
        <Ex de="Ich habe vor, nächstes Jahr nach Wien zu ziehen." en="I plan to move to Vienna next year." />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const SAME = 'Same subject in both parts → um … zu.'
const DIFF = 'Different subject in the second part → damit + subject, verb at the end.'

const EXERCISES = [
  { id: 'u1', usage: 'um … zu oder damit?', question: 'Ich lerne Deutsch, ___ in Deutschland zu studieren.', options: ['um', 'damit', 'dass', 'ohne'], answer: 'um', explanation: SAME },
  { id: 'u2', usage: 'um … zu oder damit?', question: 'Ich spreche langsam, ___ mich alle verstehen.', options: ['damit', 'um', 'ohne', 'statt'], answer: 'damit', explanation: `${DIFF} (ich → alle)` },
  { id: 'u3', usage: 'ohne … zu', question: 'Er ist gegangen, ___ sich zu verabschieden.', options: ['ohne', 'um', 'damit', 'dass'], answer: 'ohne', explanation: 'ohne … zu = without doing something.' },
  { id: 'u4', usage: 'statt … zu', question: '___ zu lernen, hat sie den ganzen Abend ferngesehen.', options: ['Statt', 'Um', 'Damit', 'Dass'], answer: 'Statt', explanation: '(an)statt … zu = instead of doing something.' },
  { id: 'u5', usage: 'Infinitiv am Ende', question: 'Ich stehe früh auf, um den Bus nicht zu ___.', options: ['verpassen', 'verpasse', 'verpasst', 'verpassten'], answer: 'verpassen', explanation: 'um … zu + Infinitiv at the end.' },
  { id: 'u6', usage: 'Trennbares Verb', question: 'Wir fahren in die Stadt, um ___.', options: ['einzukaufen', 'zu einkaufen', 'einkaufen zu', 'einkaufen'], answer: 'einzukaufen', explanation: 'Separable verb: ein + zu + kaufen → einzukaufen.' },
  { id: 'u7', usage: 'Satzanfang', question: 'Um fit zu bleiben, ___ ich jeden Tag joggen.', options: ['gehe', 'gehen', 'zu gehen', 'geht'], answer: 'gehe', explanation: 'The um-part is position 1 → verb (gehe) comes next, then the subject.' },
  { id: 'u8', usage: 'um … zu oder damit?', question: 'Sie spart Geld, ___ ihre Kinder studieren können.', options: ['damit', 'um', 'ohne', 'statt'], answer: 'damit', explanation: `${DIFF} (sie → ihre Kinder)` },
  { id: 'u9', usage: 'Trennbares Verb', question: 'Ich gehe zur Post, um ein Paket ___.', options: ['abzuholen', 'zu abholen', 'abholen', 'abzuholt'], answer: 'abzuholen', explanation: 'abholen → abzuholen.' },
  { id: 'u10', usage: 'zu ohne um', question: 'Er hat keine Lust, ins Kino ___.', options: ['zu gehen', 'um zu gehen', 'gehen', 'zu geht'], answer: 'zu gehen', explanation: 'Lust haben + zu + Infinitiv. Not a goal → no um.' },
  { id: 'u11', usage: 'zu ohne um', question: 'Es ist wichtig, regelmäßig Sport ___.', options: ['zu treiben', 'um zu treiben', 'treiben', 'getrieben'], answer: 'zu treiben', explanation: 'Es ist wichtig, … zu + Infinitiv. No um.' },
  { id: 'u12', usage: 'ohne … zu', question: 'Er nahm das Geld, ___ zu fragen.', options: ['ohne', 'um', 'damit', 'dass'], answer: 'ohne', explanation: 'ohne zu fragen = without asking.' },
  { id: 'u13', usage: 'um … zu oder damit?', question: 'Ich mache einen Deutschkurs, ___ meine Chancen auf dem Arbeitsmarkt zu verbessern.', options: ['um', 'damit', 'statt', 'ohne'], answer: 'um', explanation: `${SAME} Goal: better chances.` },
  { id: 'u14', usage: 'um … zu oder damit?', question: 'Der Lehrer erklärt die Regel noch einmal, ___ die Schüler sie besser verstehen.', options: ['damit', 'um', 'ohne', 'statt'], answer: 'damit', explanation: `${DIFF} (der Lehrer → die Schüler)` },
  { id: 'u15', usage: 'Wozu?', question: '„Wozu brauchst du das Auto?" – „___ zur Arbeit zu fahren."', options: ['Um', 'Damit', 'Ohne', 'Statt'], answer: 'Um', explanation: 'Wozu? asks for a goal → Um … zu …' },
  { id: 'u16', usage: 'Trennbares Verb', question: 'Ich nehme ein Taxi, um pünktlich ___.', options: ['anzukommen', 'zu ankommen', 'ankommen', 'anzukommt'], answer: 'anzukommen', explanation: 'ankommen → anzukommen.' },
  { id: 'u17', usage: 'Modalverb', question: 'Sie arbeitet viel, um sich eine Wohnung leisten zu ___.', options: ['können', 'könnte', 'gekonnt', 'kann'], answer: 'können', explanation: 'Modal verb last, in the infinitive: … leisten zu können.' },
  { id: 'u18', usage: 'statt … zu', question: '___ mit dem Auto zu fahren, nehme ich das Fahrrad.', options: ['Statt', 'Um', 'Damit', 'Dass'], answer: 'Statt', explanation: 'statt … zu = instead of. At the start → verb (nehme) next.' },
  { id: 'u19', usage: 'um … zu oder damit?', question: 'Mein Chef hat mir geholfen, ___ ich die Stelle bekomme.', options: ['damit', 'um', 'ohne', 'statt'], answer: 'damit', explanation: `${DIFF} (mein Chef → ich)` },
  { id: 'u20', usage: 'zu ohne um', question: 'Ich habe vor, nächstes Jahr nach Wien ___.', options: ['zu ziehen', 'um zu ziehen', 'ziehen', 'gezogen'], answer: 'zu ziehen', explanation: 'vorhaben + zu + Infinitiv. No um.' },
]
