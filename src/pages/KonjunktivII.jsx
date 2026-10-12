import { BackToGrammar, ReferenceSection, PracticeHeading } from '../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../components/LearnBlocks'

const SESSION_SIZE = 12

// Konjunktiv II of sein, haben and the modal verbs: [stem, ending] per person
const VERBS = ['sein', 'haben', 'können', 'müssen', 'dürfen', 'wollen', 'sollen']
const PERSONS = ['ich', 'du', 'er, es, sie, man', 'wir', 'ihr', 'sie, Sie']
const FORMS = {
  sein:   [['wär', 'e'], ['wär', '(e)st*'], ['wär', 'e'], ['wär', 'en'], ['wär', '(e)t*'], ['wär', 'en']],
  haben:  [['hätt', 'e'], ['hätt', 'est'], ['hätt', 'e'], ['hätt', 'en'], ['hätt', 'et'], ['hätt', 'en']],
  können: [['könnt', 'e'], ['könnt', 'est'], ['könnt', 'e'], ['könnt', 'en'], ['könnt', 'et'], ['könnt', 'en']],
  müssen: [['müsst', 'e'], ['müsst', 'est'], ['müsst', 'e'], ['müsst', 'en'], ['müsst', 'et'], ['müsst', 'en']],
  dürfen: [['dürft', 'e'], ['dürft', 'est'], ['dürft', 'e'], ['dürft', 'en'], ['dürft', 'et'], ['dürft', 'en']],
  wollen: [['wollt', 'e'], ['wollt', 'est'], ['wollt', 'e'], ['wollt', 'en'], ['wollt', 'et'], ['wollt', 'en']],
  sollen: [['sollt', 'e'], ['sollt', 'est'], ['sollt', 'e'], ['sollt', 'en'], ['sollt', 'et'], ['sollt', 'en']],
}

export default function KonjunktivII() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar#konjunktiv" label="Konjunktiv II & Bedingungen" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Konjunktiv II: Wünsche & Bitten</h1>
      <p className="text-base text-gray-500 mb-8">Die speziellen Formen von sein, haben und den Modalverben</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Die Formen: sein, haben & Modalverben" defaultOpen>
          <FormsTable />
        </ReferenceSection>
        <ReferenceSection title="Wünsche ausdrücken — wann und wie?" defaultOpen>
          <WishesGuide />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="konjunktiv"
        perfectText="Perfect — wäre, hätte, könnte … all correct!"
      />
    </div>
  )
}

// ─── Learn: the forms table ───────────────────────────────────────────────────

function FormsTable() {
  return (
    <div className="space-y-6">
      <SectionCard title="1. Spezielle Konjunktivform bei sein, haben und den Modalverben">
        <MiniTable
          head={['', ...VERBS]}
          rows={PERSONS.map((p, i) => [
            p,
            ...VERBS.map(v => {
              const [stem, ending] = FORMS[v][i]
              return <span key={v}>{stem}<span className="text-indigo-600 font-semibold">{ending}</span></span>
            }),
          ])}
        />
        <p className="text-sm text-gray-500 mt-3">
          * Das <em>e</em> kann in der 2. Person Singular und Plural entfallen: <em>du wärest</em> oder <em>du wärst</em>, <em>ihr wäret</em> oder <em>ihr wärt</em>.
        </p>
      </SectionCard>

      <SectionCard title="How the forms are built" formula="Präteritum + Umlaut (a, o, u → ä, ö, ü)">
        <MiniTable
          head={['Infinitiv', 'Präteritum (real past)', 'Konjunktiv II (wish / polite)']}
          rows={[
            ['sein', 'war', 'wäre'],
            ['haben', 'hatte', 'hätte'],
            ['können', 'konnte', 'könnte'],
            ['müssen', 'musste', 'müsste'],
            ['dürfen', 'durfte', 'dürfte'],
            ['wollen', 'wollte', 'wollte (no umlaut)'],
            ['sollen', 'sollte', 'sollte (no umlaut)'],
          ]}
        />
        <ul className="text-base text-gray-700 space-y-1.5 mt-4 list-disc pl-5">
          <li>Endings for every verb: <strong>-e, -est, -e, -en, -et, -en</strong>. ich and er/sie/es are always the same.</li>
          <li>
            ⚠️ <strong>wollen</strong> and <strong>sollen</strong> get <strong>no umlaut</strong>, so their Konjunktiv II looks exactly like the
            Präteritum (<em>ich sollte</em>). The context tells you which one is meant.
          </li>
          <li>Watch the dots: <em>ich konnte</em> = I could (past, real) · <em>ich könnte</em> = I could (possible, hypothetical).</li>
        </ul>
      </SectionCard>
    </div>
  )
}

// ─── Learn: wishes ────────────────────────────────────────────────────────────

function WishesGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          The Konjunktiv II talks about things that are <strong>not real</strong> (yet): wishes, dreams and polite requests.
          With <em>sein</em>, <em>haben</em> and the modal verbs, use these special forms. For most other verbs use
          <strong> würde + Infinitiv</strong> (<em>Ich würde gern reisen</em>).
        </p>
      </div>

      <SectionCard num="1" title="Polite wishes — ordering, asking for something" formula="Ich hätte gern … / Ich wäre gern …">
        <Ex de="Ich hätte gern einen Kaffee, bitte." en="I'd like a coffee, please." />
        <Ex de="Ich wäre jetzt gern am Strand." en="I'd love to be at the beach now." />
        <Ex de="Wir hätten gern ein Zimmer mit Balkon." en="We would like a room with a balcony." />
      </SectionCard>

      <SectionCard num="2" title="Unreal wishes — if only …!" formula="Wenn … doch / nur + … + Konjunktiv II!">
        <p className="text-base text-gray-700 mb-3">
          The verb goes to the <strong>end</strong>. Without <em>wenn</em>, the verb comes <strong>first</strong>. Both mean the same.
        </p>
        <Ex de="Wenn ich doch mehr Zeit hätte!" en="If only I had more time!" />
        <Ex de="Hätte ich doch mehr Zeit!" en="If only I had more time! (without wenn — verb first)" />
        <Ex de="Wenn er nur hier wäre!" en="If only he were here!" />
        <Ex de="Wenn ich doch besser Deutsch sprechen könnte!" en="If only I could speak German better!" />
      </SectionCard>

      <SectionCard num="3" title="Ich wünschte, …" formula="Ich wünschte, + Hauptsatz im Konjunktiv II">
        <Ex de="Ich wünschte, ich wäre schon mit der Prüfung fertig." en="I wish I were already done with the exam." />
        <Ex de="Ich wünschte, wir könnten zusammen in den Urlaub fahren." en="I wish we could go on holiday together." />
      </SectionCard>

      <SectionCard num="4" title="Wishes about the past — too late!" formula="hätte / wäre + Partizip II">
        <Ex de="Wenn ich doch mehr gelernt hätte!" en="If only I had studied more!" />
        <Ex de="Wäre ich doch früher aufgestanden!" en="If only I had got up earlier!" />
      </SectionCard>

      <SectionCard num="5" title="Polite requests & advice" formula="Könnten Sie …? · Dürfte ich …? · Du solltest …">
        <Ex de="Könnten Sie mir bitte helfen?" en="Could you help me, please?" />
        <Ex de="Dürfte ich kurz das Fenster öffnen?" en="May I open the window for a moment?" />
        <Ex de="Hättest du morgen Zeit?" en="Would you have time tomorrow?" />
        <Ex de="Du solltest mehr schlafen." en="You should sleep more. (advice)" />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const EXERCISES = [
  { id: 'k2_01', usage: 'Höflicher Wunsch · haben, ich', question: 'Ich ___ gern einen Kaffee, bitte.', options: ['hätte', 'hatte', 'habe', 'hättest'], answer: 'hätte', explanation: '„Ich hätte gern …" = I would like … — the polite way to order or ask for something. haben → hätte (Präteritum hatte + Umlaut).' },
  { id: 'k2_02', usage: 'Irrealer Wunsch · haben, ich', question: 'Wenn ich doch nur mehr Zeit ___!', options: ['hätte', 'hatte', 'hätten', 'habe'], answer: 'hätte', explanation: 'Unreal wish with „wenn … doch nur": the Konjunktiv II verb goes to the end. ich → hätte.' },
  { id: 'k2_03', usage: 'Wunsch · sein, ich', question: 'Ich ___ jetzt gern am Strand.', options: ['wäre', 'war', 'bin', 'wären'], answer: 'wäre', explanation: '„Ich wäre gern …" = I would like to be … sein → wäre. „war" is the real past.' },
  { id: 'k2_04', usage: 'Irrealer Wunsch · sein, du', question: '___ du doch nur hier!', options: ['Wärst', 'Warst', 'Wäre', 'Bist'], answer: 'Wärst', explanation: 'Wish without „wenn": the verb comes first. du → wärst (or wärest — both correct).' },
  { id: 'k2_05', usage: 'Wunsch Vergangenheit · haben, wir', question: 'Wenn wir doch nur früher gebucht ___!', options: ['hätten', 'hatten', 'hätte', 'haben'], answer: 'hätten', explanation: 'Wish about the past: hätte/wäre + Partizip II. wir → hätten … gebucht.' },
  { id: 'k2_06', usage: 'Höfliche Bitte · können, Sie', question: '___ Sie mir bitte helfen?', options: ['Könnten', 'Konnten', 'Können', 'Könntest'], answer: 'Könnten', explanation: '„Könnten Sie …?" is more polite than „Können Sie …?". Sie → könnten.' },
  { id: 'k2_07', usage: 'Höfliche Bitte · dürfen, ich', question: '___ ich kurz das Fenster öffnen?', options: ['Dürfte', 'Durfte', 'Darf', 'Dürften'], answer: 'Dürfte', explanation: '„Dürfte ich …?" = May I …? (very polite). ich → dürfte. „durfte" is the real past.' },
  { id: 'k2_08', usage: 'Ratschlag · sollen, du', question: 'Du ___ mehr schlafen.', options: ['solltest', 'sölltest', 'sollst', 'sollte'], answer: 'solltest', explanation: 'Advice: du solltest … ⚠️ sollen has NO umlaut in Konjunktiv II — „sölltest" does not exist.' },
  { id: 'k2_09', usage: 'Ich wünschte … · können, ich', question: 'Ich wünschte, ich ___ Klavier spielen.', options: ['könnte', 'konnte', 'kann', 'könntest'], answer: 'könnte', explanation: '„Ich wünschte, …" + Konjunktiv II. ich → könnte (hypothetical), not konnte (real past).' },
  { id: 'k2_10', usage: 'Irrealer Wunsch · haben, ihr', question: 'Wenn ihr doch mehr Geduld ___!', options: ['hättet', 'hattet', 'hättest', 'habt'], answer: 'hättet', explanation: 'ihr → hättet (ending -et). „hättest" is the du form.' },
  { id: 'k2_11', usage: 'Sanfter Wunsch · wollen, ich', question: 'Eigentlich ___ ich heute früh schlafen gehen.', options: ['wollte', 'wöllte', 'will', 'wolltest'], answer: 'wollte', explanation: 'wollen has NO umlaut: Konjunktiv II = wollte (same as Präteritum). „wöllte" does not exist.' },
  { id: 'k2_12', usage: 'Empfehlung · müssen, man', question: 'Man ___ mehr Sport machen.', options: ['müsste', 'musste', 'muss', 'müssten'], answer: 'müsste', explanation: '„Man müsste …" = one really ought to … man → müsste (like er/sie/es).' },
  { id: 'k2_13', usage: 'Irrealer Wunsch · müssen, ich', question: 'Wenn ich doch nicht so viel arbeiten ___!', options: ['müsste', 'musste', 'muss', 'müssten'], answer: 'müsste', explanation: 'Wish: „Wenn ich doch nicht … müsste!" — verb at the end. ich → müsste.' },
  { id: 'k2_14', usage: 'Höfliche Frage · haben, ihr', question: '___ ihr morgen Zeit für uns?', options: ['Hättet', 'Hattet', 'Habt', 'Hättest'], answer: 'Hättet', explanation: '„Hättet ihr …?" = Would you have …? (friendly, polite). ihr → hättet.' },
  { id: 'k2_15', usage: 'Wunsch · sein, er', question: 'Mein Bruder ___ gern Arzt.', options: ['wäre', 'war', 'ist', 'wären'], answer: 'wäre', explanation: '„Er wäre gern Arzt" = he would like to be a doctor (but isn\'t). er → wäre.' },
  { id: 'k2_16', usage: 'Wunsch · haben, sie (Plural)', question: 'Meine Eltern ___ gern ein Haus am See.', options: ['hätten', 'hatten', 'hätte', 'haben'], answer: 'hätten', explanation: 'sie (they) → hätten. „Sie hätten gern …" = they would like …' },
  { id: 'k2_17', usage: 'Höfliche Bitte · dürfen, ich', question: '___ ich Sie etwas fragen?', options: ['Dürfte', 'Durfte', 'Dürftest', 'Darf'], answer: 'Dürfte', explanation: '„Dürfte ich Sie etwas fragen?" = May I ask you something? ich → dürfte.' },
  { id: 'k2_18', usage: 'Ratschlag · müssen, du', question: 'Du ___ wirklich mal Urlaub machen.', options: ['müsstest', 'musstest', 'musst', 'müsstet'], answer: 'müsstest', explanation: 'Strong advice: du müsstest … (you really ought to …). du → -est.' },
  { id: 'k2_19', usage: 'Irrealer Wunsch · sein, du', question: 'Wenn du doch nur pünktlich ___!', options: ['wärst', 'warst', 'wäre', 'bist'], answer: 'wärst', explanation: '„Wenn du doch nur … wärst!" — verb at the end. du → wärst / wärest.' },
  { id: 'k2_20', usage: 'Höfliche Bitte · können, Sie', question: '___ Sie das bitte wiederholen?', options: ['Könnten', 'Können', 'Konnten', 'Könnte'], answer: 'Könnten', explanation: 'Polite request: Könnten Sie …? Sie → könnten.' },
  { id: 'k2_21', usage: 'Ratschlag · sollen, ihr', question: 'Ihr ___ mehr Wasser trinken.', options: ['solltet', 'sölltet', 'sollt', 'solltest'], answer: 'solltet', explanation: 'ihr → solltet. ⚠️ No umlaut with sollen.' },
  { id: 'k2_22', usage: 'Irrealer Wunsch · dürfen, wir', question: 'Wenn wir doch länger bleiben ___!', options: ['dürften', 'durften', 'dürfen', 'dürftet'], answer: 'dürften', explanation: 'wir → dürften (verb at the end of the wenn-wish). „durften" is the real past.' },
  { id: 'k2_23', usage: 'Irrealer Wunsch · sein, ich', question: 'Wenn ich doch ein Vogel ___!', options: ['wäre', 'war', 'bin', 'wären'], answer: 'wäre', explanation: 'Dream wish: ich → wäre. Konjunktiv II = not real.' },
  { id: 'k2_24', usage: 'Wunsch Vergangenheit · sein, ich', question: '___ ich doch früher aufgestanden!', options: ['Wäre', 'War', 'Hätte', 'Bin'], answer: 'Wäre', explanation: 'Past wish without wenn: verb first. aufstehen takes sein in the Perfekt → wäre … aufgestanden.' },
]
