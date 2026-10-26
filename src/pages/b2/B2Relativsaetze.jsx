import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Relativsaetze() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Relativsätze</h1>
      <p className="text-base text-gray-500 mb-8">der · den · dem · dessen / deren · mit Präposition · wo & was</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Relativpronomen & die 2 Fragen" defaultOpen>
          <Basis />
        </ReferenceSection>
        <ReferenceSection title="Genitiv: dessen & deren">
          <Genitiv />
        </ReferenceSection>
        <ReferenceSection title="Präposition · wo · was">
          <Extras />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_relativ"
        perfectText="Perfekt — der Satz, dessen Pronomen stimmt!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function Basis() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Die Relativpronomen">
        <MiniTable
          head={['', 'maskulin', 'feminin', 'neutral', 'Plural']}
          rows={[
            ['Nominativ', 'der', 'die', 'das', 'die'],
            ['Akkusativ', <strong>den</strong>, 'die', 'das', 'die'],
            ['Dativ', 'dem', 'der', 'dem', <strong>denen</strong>],
            ['Genitiv', <strong>dessen</strong>, <strong>deren</strong>, <strong>dessen</strong>, <strong>deren</strong>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">Like the article, except the bold forms: <em>denen, dessen, deren</em>.</p>
      </SectionCard>

      <SectionCard num="2" title="Zwei Fragen" formula="Genus ← Nomen davor · Kasus ← Rolle im Relativsatz">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          ① Which noun does it refer to? → <strong>gender & number</strong>.
          ② What job does it do <strong>in the relative clause</strong>? → <strong>case</strong>. The verb goes to the end.
        </p>
        <MiniTable
          head={['Kasus', 'Das ist der Mann, …']}
          rows={[
            ['Nominativ', <>…, <strong>der</strong> reich ist. <span className="text-gray-400">(er ist reich)</span></>],
            ['Akkusativ', <>…, <strong>den</strong> ich mag. <span className="text-gray-400">(ich mag ihn)</span></>],
            ['Dativ', <>…, <strong>dem</strong> viele Menschen gratulieren. <span className="text-gray-400">(gratulieren + Dat.)</span></>],
            ['Präposition', <>…, für <strong>den</strong> ich mich interessiere. <span className="text-gray-400">(sich interessieren für + Akk.)</span></>],
            ['Genitiv', <>…, <strong>dessen</strong> Frau Ärztin ist. <span className="text-gray-400">(seine Frau)</span></>],
          ]}
        />
      </SectionCard>
    </div>
  )
}

function Genitiv() {
  return (
    <div className="space-y-6">
      <SectionCard title="dessen / deren = whose" formula="dessen (der / das) · deren (die / Plural) + Nomen ohne Artikel">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          Choose by the <strong>owner</strong> (the noun before), not the thing owned.
          Replace <em>sein / ihr</em>: <em>Die Sprache ist schwer. <strong>Ihre</strong> Grammatik …</em> → <em><strong>deren</strong> Grammatik</em>.
        </p>
        <Ex de="Das ist die Sprache, deren Grammatik schwer ist." en="That's the language whose grammar is hard. (die Sprache → deren)" />
        <Ex de="Das ist das Land, dessen Leute freundlich sind." en="That's the country whose people are friendly. (das Land → dessen)" />
        <Ex de="Ich lebe in einer Wohnung, deren Küche weiß ist." en="I live in a flat whose kitchen is white." />
        <Ex de="Das sind die Lehrerinnen, deren Getränk immer Wasser ist." en="Those are the teachers whose drink is always water. (Plural → deren)" />
        <p className="text-sm text-gray-500 mt-2">
          ⚠️ <em>Die Bewerberin, <strong>deren</strong> Lebenslauf gut ist</em>: der Lebenslauf is masculine,
          but the owner (die Bewerberin) decides → deren.
        </p>
      </SectionCard>
    </div>
  )
}

function Extras() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Mit Präposition" formula="Präposition + Relativpronomen">
        <Ex de="Die Stadt, in der ich wohne, ist klein." en="The preposition comes first; it decides the case (in + Dat. → der)." />
        <Ex de="Die Kinder, mit denen ich spiele, sind laut." en="mit + Dat., Plural → denen." />
      </SectionCard>
      <SectionCard num="2" title="wo & was">
        <Ex de="Stuttgart ist die Stadt, wo ich geboren bin." en="wo for places (= in der)." />
        <Ex de="Das ist alles, was ich weiß." en="was after alles, nichts, etwas, das, viel(es) and superlatives (das Beste, was …)." />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const OWNER = 'Genitiv: the owner decides. der / das → dessen · die / Plural → deren.'

const EXERCISES = [
  { id: 's1', usage: 'Nominativ', question: 'Das ist der Mann, ___ reich ist.', options: ['der', 'den', 'dem', 'dessen'], answer: 'der', explanation: 'der Mann is the subject of „ist“ → Nominativ: der.' },
  { id: 's2', usage: 'Akkusativ', question: 'Das ist der Mann, ___ ich mag.', options: ['den', 'der', 'dem', 'dessen'], answer: 'den', explanation: 'ich is the subject; mögen + Akk. → den.' },
  { id: 's3', usage: 'Dativ', question: 'Das ist der Mann, ___ viele Menschen gratulieren.', options: ['dem', 'den', 'der', 'denen'], answer: 'dem', explanation: 'gratulieren + Dativ → dem.' },
  { id: 's4', usage: 'Präposition', question: 'Das ist der Mann, für ___ ich mich interessiere.', options: ['den', 'dem', 'der', 'dessen'], answer: 'den', explanation: 'sich interessieren für + Akk. → für den.' },
  { id: 's5', usage: 'Genitiv', question: 'Das ist der Mann, ___ Frau Ärztin ist.', options: ['dessen', 'deren', 'dem', 'der'], answer: 'dessen', explanation: `${OWNER} (seine Frau)` },
  { id: 's6', usage: 'Genitiv', question: 'Das ist die Sprache, ___ Grammatik schwer ist.', options: ['deren', 'dessen', 'der', 'die'], answer: 'deren', explanation: `${OWNER} (ihre Grammatik)` },
  { id: 's7', usage: 'Genitiv', question: 'Das ist das Land, ___ Leute freundlich sind.', options: ['dessen', 'deren', 'das', 'dem'], answer: 'dessen', explanation: `${OWNER} das Land → dessen.` },
  { id: 's8', usage: 'Dativ Plural', question: 'Das sind die Lehrerinnen, ___ die Klasse zuhört.', options: ['denen', 'deren', 'die', 'den'], answer: 'denen', explanation: 'zuhören + Dativ, Plural → denen.' },
  { id: 's9', usage: 'Genitiv Plural', question: 'Das sind die Lehrerinnen, ___ Getränk immer Wasser ist.', options: ['deren', 'denen', 'dessen', 'die'], answer: 'deren', explanation: `${OWNER} Plural → deren.` },
  { id: 's10', usage: 'Genitiv', question: 'Ich lebe in einer Wohnung, ___ Küche weiß ist.', options: ['deren', 'dessen', 'der', 'die'], answer: 'deren', explanation: `${OWNER} die Wohnung → deren.` },
  { id: 's11', usage: 'Genitiv', question: 'Ich lebe in einem Haus, ___ Garten groß ist.', options: ['dessen', 'deren', 'dem', 'das'], answer: 'dessen', explanation: `${OWNER} das Haus → dessen.` },
  { id: 's12', usage: 'Dativ', question: 'Die Kollegin, ___ ich oft helfe, ist neu.', options: ['der', 'die', 'denen', 'deren'], answer: 'der', explanation: 'helfen + Dativ, feminin → der.' },
  { id: 's13', usage: 'Akkusativ', question: 'Das Buch, ___ ich gerade lese, ist spannend.', options: ['das', 'dem', 'dessen', 'der'], answer: 'das', explanation: 'lesen + Akk., neutral → das.' },
  { id: 's14', usage: 'Präposition', question: 'Die Stadt, in ___ ich wohne, ist klein.', options: ['der', 'die', 'dem', 'deren'], answer: 'der', explanation: 'in + Dativ (wo?), feminin → in der.' },
  { id: 's15', usage: 'Präposition', question: 'Die Firma, bei ___ ich arbeite, sucht neue Mitarbeiter.', options: ['der', 'die', 'dem', 'denen'], answer: 'der', explanation: 'bei + Dativ, feminin → bei der.' },
  { id: 's16', usage: 'Präposition', question: 'Die Kinder, mit ___ ich spiele, sind laut.', options: ['denen', 'deren', 'den', 'die'], answer: 'denen', explanation: 'mit + Dativ, Plural → mit denen.' },
  { id: 's17', usage: 'was', question: 'Das ist alles, ___ ich weiß.', options: ['was', 'das', 'wo', 'dass'], answer: 'was', explanation: 'After alles, nichts, etwas → was.' },
  { id: 's18', usage: 'wo', question: 'Stuttgart ist die Stadt, ___ ich geboren bin.', options: ['wo', 'was', 'die', 'wem'], answer: 'wo', explanation: 'For places → wo (= in der).' },
  { id: 's19', usage: 'Genitiv', question: 'Der Bewerber, ___ Unterlagen vollständig sind, bekommt eine Einladung.', options: ['dessen', 'deren', 'der', 'denen'], answer: 'dessen', explanation: `${OWNER} der Bewerber → dessen (even though Unterlagen is plural).` },
  { id: 's20', usage: 'Genitiv: Falle', question: 'Die Bewerberin, ___ Lebenslauf sehr gut ist, bekommt die Stelle.', options: ['deren', 'dessen', 'der', 'die'], answer: 'deren', explanation: `${OWNER} die Bewerberin → deren (der Lebenslauf doesn't matter).` },
  { id: 's21', usage: 'Nominativ Plural', question: 'Das sind die Lehrerinnen, ___ die Schüler gut kennen.', options: ['die', 'denen', 'deren', 'den'], answer: 'die', explanation: 'Plural, Nominativ or Akkusativ → die. (Both readings work: they know the students / the students know them.)' },
  { id: 's22', usage: 'Präposition', question: 'Das ist das Projekt, an ___ wir gerade arbeiten.', options: ['dem', 'das', 'den', 'dessen'], answer: 'dem', explanation: 'arbeiten an + Dativ, neutral → an dem.' },
]
