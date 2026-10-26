import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2IndirekteRede() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Indirekte Rede</h1>
      <p className="text-base text-gray-500 mb-8">Konjunktiv I · er sagt, er sei … · Fragen · Bitten & Befehle</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Konjunktiv I: die Formen" defaultOpen>
          <Formen />
        </ReferenceSection>
        <ReferenceSection title="Ersatzform: Konjunktiv II / würde">
          <Ersatz />
        </ReferenceSection>
        <ReferenceSection title="Vergangenheit & Zukunft">
          <Zeiten />
        </ReferenceSection>
        <ReferenceSection title="Satztypen: Aussage · Frage · Imperativ">
          <Satztypen />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_indirekt"
        perfectText="Perfekt — er sagt, du seist ein Profi!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function Formen() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 sm:p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          <strong>Indirekte Rede</strong> reports what someone else said, without quotation marks.
          News, reports and formal texts use the <strong>Konjunktiv I</strong>. It shows: <em>this is what they said, not what I claim.</em>
        </p>
      </div>

      <SectionCard num="1" title="Die Form" formula="Verbstamm + e · est · e · en · et · en">
        <Ex de="Asli: „Ich habe Hunger.“ → Asli sagt, sie habe Hunger." en="Asli says she is hungry." />
        <Ex de="Yefrem: „Ich lerne zehn Sprachen.“ → Yefrem sagt, er lerne zehn Sprachen." en="Yefrem says he is learning ten languages." />
        <p className="text-sm text-gray-500 mt-2">
          Most used: <strong>er / sie / es</strong>, ending <strong>-e</strong>: er habe, er lerne, er komme, er gehe.
          Change the pronoun too: <em>ich → er/sie</em>, <em>mein → sein/ihr</em>.
        </p>
      </SectionCard>

      <SectionCard num="2" title="sein — Ausnahme">
        <MiniTable
          head={['Person', 'sein', 'haben', 'werden']}
          rows={[
            ['ich', 'sei', <span className="text-gray-400">habe → hätte</span>, <span className="text-gray-400">werde → würde</span>],
            ['du', 'sei(e)st', 'habest', 'werdest'],
            ['er / sie / es', <strong>sei</strong>, <strong>habe</strong>, <strong>werde</strong>],
            ['wir', <strong>seien</strong>, <span className="text-gray-400">haben → hätten</span>, <span className="text-gray-400">werden → würden</span>],
            ['ihr', 'seiet', 'habet', 'werdet'],
            ['sie / Sie', <strong>seien</strong>, <span className="text-gray-400">haben → hätten</span>, <span className="text-gray-400">werden → würden</span>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">sein has its own forms in every person, so it never needs a replacement.</p>
      </SectionCard>

      <SectionCard num="3" title="Modalverben" formula="er müsse · könne · wolle · solle · dürfe · möge">
        <MiniTable
          head={['Infinitiv', 'er / sie / es', 'Beispiel']}
          rows={[
            ['können', 'könne', 'Er sagt, er könne nicht kommen.'],
            ['müssen', 'müsse', 'Sie sagt, sie müsse arbeiten.'],
            ['wollen', 'wolle', 'Elena sagt, sie wolle heute ausschlafen.'],
            ['sollen', 'solle', 'Er sagt, ich solle warten.'],
            ['dürfen', 'dürfe', 'Sie sagt, man dürfe hier nicht rauchen.'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">No umlaut change: <em>können → könne</em> (Konjunktiv I), but <em>könnte</em> is Konjunktiv II.</p>
      </SectionCard>
    </div>
  )
}

function Ersatz() {
  return (
    <div className="space-y-6">
      <SectionCard title="Same as the normal present? → use Konjunktiv II" formula="Konj. I = Indikativ → Konj. II · sonst würde + Inf.">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          For <strong>ich, wir, sie (pl.)</strong> the Konjunktiv I usually looks like the normal present
          (<em>wir haben</em>). Then nobody can see it's indirect speech, so use the <strong>Konjunktiv II</strong>.
          If that also looks like a normal past form, use <strong>würde + Infinitiv</strong>.
        </p>
        <MiniTable
          head={['Direkt', 'Konj. I', 'Indirekte Rede']}
          rows={[
            ['„Wir haben Hunger.“', <span className="text-gray-400">sie haben ✗</span>, <>Sie sagen, sie <strong>hätten</strong> Hunger.</>],
            ['„Wir können kommen.“', <span className="text-gray-400">sie können ✗</span>, <>Sie sagen, sie <strong>könnten</strong> kommen.</>],
            ['„Wir lernen Deutsch.“', <span className="text-gray-400">sie lernen ✗ / lernten ✗</span>, <>Sie sagen, sie <strong>würden</strong> Deutsch <strong>lernen</strong>.</>],
            ['„Wir sind müde.“', <strong>sie seien ✓</strong>, <>Sie sagen, sie <strong>seien</strong> müde.</>],
          ]}
        />
      </SectionCard>
    </div>
  )
}

function Zeiten() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Vergangenheit" formula="habe / sei + Partizip II">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          Konjunktiv I has only one past form. Perfekt, Präteritum and Plusquamperfekt all become <strong>habe/sei + Partizip II</strong>.
        </p>
        <MiniTable
          head={['Direkt', 'Indirekte Rede']}
          rows={[
            ['„Ich habe gestern aufgeräumt.“', <>Sie sagt, sie <strong>habe</strong> gestern <strong>aufgeräumt</strong>.</>],
            ['„Ich bin gefahren.“', <>Sie sagt, sie <strong>sei gefahren</strong>.</>],
            ['„Ich hatte Kopfschmerzen.“', <>Sie sagt, sie <strong>habe</strong> Kopfschmerzen <strong>gehabt</strong>.</>],
            ['„Ich war müde.“', <>Sie sagt, sie <strong>sei</strong> müde <strong>gewesen</strong>.</>],
          ]}
        />
      </SectionCard>
      <SectionCard num="2" title="Zukunft" formula="werde + Infinitiv">
        <Ex de="Kiril: „Ich werde nächste Woche aktiv sein.“ → Kiril sagt, er werde nächste Woche aktiv sein." en="Kiril says he will be active next week." />
      </SectionCard>
    </div>
  )
}

function Satztypen() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Aussage — mit oder ohne dass" formula="…, dass + … Verb (Ende) · …, Verb (Pos. 2) …">
        <Ex de="Asli sagt, dass sie einen Mercedes kaufen wolle." en="with dass → verb at the end" />
        <Ex de="Asli sagt, sie wolle einen Mercedes kaufen." en="without dass → verb in position 2" />
      </SectionCard>
      <SectionCard num="2" title="Fragen" formula="W-Wort … Verb (Ende) · ob … Verb (Ende)">
        <Ex de="„Warum geht Noor?“ → Asli fragt, warum Noor gehe." en="W-question: keep the question word." />
        <Ex de="„Ist Waseem krank?“ → Asli fragt, ob Waseem krank sei." en="Yes/no question → ob." />
      </SectionCard>
      <SectionCard num="3" title="Imperativ — Bitten & Befehle" formula="sollen (Konj. I / II) + Infinitiv">
        <Ex de="„Kauf mir ein Eis!“ → Das Kind sagt, die Mutter solle ihm ein Eis kaufen." en="One person → solle." />
        <Ex de="„Macht die Hausaufgaben!“ → Sie sagt, wir sollten die Hausaufgaben machen." en="wir / sie: sollen = Indikativ → sollten." />
        <p className="text-sm text-gray-500 mt-2">Verbs for commands: <em>auffordern, befehlen, bitten</em>. Polite requests can also use <em>möge</em>.</p>
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const K1 = 'Indirect speech → Konjunktiv I. er/sie/es: stem + e.'
const ERSATZ = 'Konjunktiv I looks like the normal present here, so use Konjunktiv II.'
const PAST = 'Past in indirect speech: habe / sei + Partizip II.'

const EXERCISES = [
  { id: 'r1', usage: 'sein', question: 'Asli: „Ich bin müde.“ → Asli sagt, sie ___ müde.', options: ['sei', 'ist', 'wäre', 'seien'], answer: 'sei', explanation: 'sein → er/sie sei.' },
  { id: 'r2', usage: 'haben', question: 'Tom: „Ich habe Hunger.“ → Tom sagt, er ___ Hunger.', options: ['habe', 'hat', 'hätten', 'haben'], answer: 'habe', explanation: K1 },
  { id: 'r3', usage: 'Ersatzform', question: 'Die Kinder: „Wir haben Hunger.“ → Die Kinder sagen, sie ___ Hunger.', options: ['hätten', 'haben', 'habe', 'hatten'], answer: 'hätten', explanation: `sie haben = normal present. ${ERSATZ}` },
  { id: 'r4', usage: 'Modalverb', question: 'Kant: „Ich kann gut schwimmen.“ → Kant sagt, er ___ gut schwimmen.', options: ['könne', 'kann', 'konnte', 'können'], answer: 'könne', explanation: 'können → er könne (no umlaut change; könnte is Konjunktiv II).' },
  { id: 'r5', usage: 'Modalverb', question: 'Elena: „Ich will heute ausschlafen.“ → Elena sagt, sie ___ heute ausschlafen.', options: ['wolle', 'will', 'wollte', 'wollen'], answer: 'wolle', explanation: 'wollen → sie wolle.' },
  { id: 'r6', usage: 'Zukunft', question: 'Kiril: „Ich werde nächste Woche aktiv sein.“ → Kiril sagt, er ___ nächste Woche aktiv sein.', options: ['werde', 'wird', 'würde', 'wurde'], answer: 'werde', explanation: 'Future → werde + Infinitiv.' },
  { id: 'r7', usage: 'Vergangenheit', question: 'Asli: „Ich habe gestern aufgeräumt.“ → Asli sagt, sie ___ gestern aufgeräumt.', options: ['habe', 'sei', 'hätte', 'hat'], answer: 'habe', explanation: `${PAST} aufräumen → haben.` },
  { id: 'r8', usage: 'Vergangenheit', question: 'Asli: „Ich bin nach Berlin gefahren.“ → Asli sagt, sie ___ nach Berlin gefahren.', options: ['sei', 'habe', 'ist', 'wäre'], answer: 'sei', explanation: `${PAST} fahren → sein.` },
  { id: 'r9', usage: 'Vergangenheit', question: 'Asli: „Ich war müde.“ → Asli sagt, sie sei müde ___.', options: ['gewesen', 'geworden', 'war', 'sein'], answer: 'gewesen', explanation: `${PAST} war → sei … gewesen.` },
  { id: 'r10', usage: 'W-Frage', question: 'Asli: „Warum geht Noor?“ → Asli fragt, warum Noor ___.', options: ['gehe', 'gehen', 'ging', 'gegangen'], answer: 'gehe', explanation: 'Keep the question word, verb at the end, Konjunktiv I: gehe.' },
  { id: 'r11', usage: 'Ja/Nein-Frage', question: 'Asli: „Ist Waseem krank?“ → Asli fragt, ___ Waseem krank sei.', options: ['ob', 'dass', 'wenn', 'was'], answer: 'ob', explanation: 'Yes/no question → ob.' },
  { id: 'r12', usage: 'Imperativ', question: 'Lehrerin: „Macht die Hausaufgaben!“ → Sie sagt, wir ___ die Hausaufgaben machen.', options: ['sollten', 'sollen', 'müssen', 'würden'], answer: 'sollten', explanation: `Command → sollen. wir sollen = normal present → sollten.` },
  { id: 'r13', usage: 'Imperativ', question: 'Das Kind: „Kauf mir ein Eis!“ → Das Kind sagt, die Mutter ___ ihm ein Eis kaufen.', options: ['solle', 'soll', 'sollen', 'sollten'], answer: 'solle', explanation: 'Command → sollen. die Mutter (er/sie) → solle.' },
  { id: 'r14', usage: 'mit dass', question: 'Yefrem: „Ich lerne zehn Sprachen.“ → Yefrem sagt, dass er zehn Sprachen ___.', options: ['lerne', 'lernen', 'gelernt', 'lernte'], answer: 'lerne', explanation: `${K1} With dass the verb goes to the end.` },
  { id: 'r15', usage: 'Fragen', question: 'Tom: „Was hast du gesagt?“ → Tom fragt Anna, was sie gesagt ___.', options: ['habe', 'sei', 'hat', 'haben'], answer: 'habe', explanation: `${PAST} sagen → haben.` },
  { id: 'r16', usage: 'Ja/Nein-Frage', question: 'Er: „Willst du tanzen?“ → Er fragt sie, ___ sie tanzen wolle.', options: ['ob', 'dass', 'wenn', 'wie'], answer: 'ob', explanation: 'Yes/no question → ob.' },
  { id: 'r17', usage: 'W-Frage', question: 'Sie: „Wie alt bist du?“ → Sie fragt ihn, wie alt er ___.', options: ['sei', 'ist', 'wäre', 'seien'], answer: 'sei', explanation: 'sein → er sei.' },
  { id: 'r18', usage: 'Nachrichten', question: 'Der Minister: „Die Krise wird bald vorbei sein.“ → Der Minister sagte, die Krise ___ bald vorbei sein.', options: ['werde', 'wird', 'wurde', 'würden'], answer: 'werde', explanation: 'News reports use Konjunktiv I. Future → werde + Infinitiv.' },
  { id: 'r19', usage: 'Imperativ', question: 'Mutter: „Mach dir keine Sorgen!“ → Sie sagt, ich ___ mir keine Sorgen machen.', options: ['solle', 'soll', 'sollen', 'sollst'], answer: 'solle', explanation: 'Command → sollen. ich solle (different from the normal ich soll).' },
  { id: 'r20', usage: 'Ersatzform', question: 'Er: „Die Kinder spielen draußen.“ → Er sagt, die Kinder ___ draußen.', options: ['würden spielen', 'spiele', 'gespielt', 'spielt'], answer: 'würden spielen', explanation: 'sie spielen = present, sie spielten = Präteritum → both unclear, so würde + Infinitiv.' },
  { id: 'r21', usage: 'Pronomen', question: 'Anna: „Ich liebe meine Arbeit.“ → Anna sagt, sie liebe ___ Arbeit.', options: ['ihre', 'meine', 'seine', 'deine'], answer: 'ihre', explanation: 'Change the possessive too: meine (Anna) → ihre.' },
  { id: 'r22', usage: 'sein: Plural', question: 'Denys + Kirill: „Wir sind aktiv.“ → Sie sagen, sie ___ aktiv.', options: ['seien', 'sind', 'sei', 'wären'], answer: 'seien', explanation: 'sein has its own Konjunktiv I forms in every person: sie seien.' },
]
