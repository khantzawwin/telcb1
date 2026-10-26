import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Zeitpraepositionen() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Temporale Präpositionen</h1>
      <p className="text-base text-gray-500 mb-8">um · am · im · bei · seit · vor · während · innerhalb …</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Wann? um · am · im · bei" defaultOpen>
          <Wann />
        </ReferenceSection>
        <ReferenceSection title="Vorher, nachher, wie lange?">
          <Dauer />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_zeit"
        perfectText="Perfekt — immer zur richtigen Zeit!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function Wann() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Uhrzeit, Tag, Monat, Jahr">
        <MiniTable
          head={['Präposition', 'Wofür?', 'Beispiel']}
          rows={[
            ['um + Akk.', 'Uhrzeit', <><strong>Um</strong> 8 Uhr beginnt der Unterricht.</>],
            ['am (an + Dat.)', 'Tag, Datum, Tageszeit, Wochenende', <><strong>Am</strong> Dienstag · <strong>am</strong> 1. Mai · <strong>am</strong> Morgen · <strong>am</strong> Wochenende</>],
            ['im (in + Dat.)', 'Monat, Jahreszeit, Jahrhundert', <><strong>Im</strong> Dezember · <strong>im</strong> Sommer · <strong>im</strong> 20. Jahrhundert</>],
            ['in der', 'die Nacht, die Woche', <><strong>In der</strong> Nacht · <strong>in der</strong> nächsten Woche</>],
            ['bei + Dat.', 'Aktivität, Situation', <><strong>Beim</strong> Essen · <strong>bei</strong> diesem Wetter</>],
          ]}
        />
      </SectionCard>

      <SectionCard num="2" title="Jahreszahlen — ohne Präposition" formula="2026 · im Jahr 2026">
        <Ex de="2026 ist ein spannendes Jahr." en="Year on its own: no preposition (✗ in 2026)." />
        <Ex de="Im Jahr 2026 habe ich in Stuttgart gewohnt." en="With „Jahr“: im Jahr 2026." />
      </SectionCard>

      <SectionCard num="3" title="Ungefähr & genau" formula="gegen + Akk. · um + Akk.">
        <Ex de="Ich komme gegen 20 Uhr." en="gegen = around, roughly (not exactly)." />
        <Ex de="Der Zug fährt um 20:14 Uhr ab." en="um = exactly at." />
      </SectionCard>
    </div>
  )
}

function Dauer() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Vorher & nachher" formula="vor · nach · seit · ab (+ Dat.)">
        <MiniTable
          head={['Präposition', 'Bedeutung', 'Beispiel']}
          rows={[
            ['vor + Dat.', 'before / … ago', <><strong>Vor</strong> dem Essen · <strong>vor</strong> zwei Jahren</>],
            ['nach + Dat.', 'after', <><strong>Nach</strong> dem Unterricht gehe ich nach Hause.</>],
            ['seit + Dat.', 'since / for (until now)', <>Ich wohne <strong>seit</strong> drei Jahren hier.</>],
            ['ab + Dat.', 'from … on (future)', <><strong>Ab</strong> nächstem Montag arbeite ich Vollzeit.</>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          ⚠️ <em>seit</em> = it started in the past and is still going on (verb in the present).
          <em> vor</em> = a point in the past (verb in the past).
        </p>
      </SectionCard>

      <SectionCard num="2" title="Zeitraum">
        <MiniTable
          head={['Präposition', 'Bedeutung', 'Beispiel']}
          rows={[
            ['von … bis', 'from … to', <><strong>Von</strong> 9 <strong>bis</strong> 18 Uhr geöffnet.</>],
            ['zwischen + Dat.', 'between', <><strong>Zwischen</strong> Weihnachten und Neujahr</>],
            ['für + Akk.', 'for (planned length)', <>Ich fahre <strong>für</strong> zwei Wochen weg.</>],
            ['während + Gen.', 'during', <><strong>Während</strong> des Urlaubs habe ich viel gelesen.</>],
            ['innerhalb + Gen.', 'within', <><strong>Innerhalb</strong> einer Woche antworten</>],
            ['bis + Akk.', 'until / by', <><strong>Bis</strong> Freitag muss ich fertig sein.</>],
          ]}
        />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const NONE = '— (keine)'

const EXERCISES = [
  { id: 'z1', usage: 'Uhrzeit', question: '___ 8 Uhr beginnt der Unterricht.', options: ['Um', 'Am', 'Im', 'In'], answer: 'Um', explanation: 'Clock time → um + Akk.' },
  { id: 'z2', usage: 'Wochentag', question: '___ Dienstag fahre ich zum Arzt.', options: ['Am', 'Im', 'Um', 'In'], answer: 'Am', explanation: 'Days → am (an + dem).' },
  { id: 'z3', usage: 'Monat', question: '___ Dezember habe ich Geburtstag.', options: ['Im', 'Am', 'Um', 'Bei'], answer: 'Im', explanation: 'Months → im (in + dem).' },
  { id: 'z4', usage: 'Tageszeit', question: '___ Morgen trinke ich Kaffee.', options: ['Am', 'Im', 'Um', 'In'], answer: 'Am', explanation: 'Times of day → am Morgen, am Abend …' },
  { id: 'z5', usage: 'Tageszeit: Ausnahme', question: '___ Nacht schlafe ich schlecht.', options: ['In der', 'Am', 'Im', 'Bei der'], answer: 'In der', explanation: 'Exception: die Nacht → in der Nacht.' },
  { id: 'z6', usage: 'Aktivität', question: '___ Essen schaue ich YouTube.', options: ['Beim', 'Am', 'Im', 'Um'], answer: 'Beim', explanation: 'During an activity → bei + Dat.: beim Essen.' },
  { id: 'z7', usage: 'Jahrhundert', question: '___ 20. Jahrhundert gab es zwei Weltkriege.', options: ['Im', 'Am', 'Um', 'Bei'], answer: 'Im', explanation: 'Centuries → im.' },
  { id: 'z8', usage: 'Jahreszahl', question: '___ 2026 ist ein spannendes Jahr.', options: [NONE, 'In', 'Im', 'Am'], answer: NONE, explanation: 'A year on its own has no preposition. With „Jahr“: im Jahr 2026.' },
  { id: 'z9', usage: 'Jahreszahl', question: '___ Jahr 2020 bin ich nach Deutschland gekommen.', options: ['Im', 'In', 'Am', NONE], answer: 'Im', explanation: 'im Jahr + year.' },
  { id: 'z10', usage: 'seit', question: 'Ich wohne ___ drei Jahren in Stuttgart.', options: ['seit', 'vor', 'für', 'ab'], answer: 'seit', explanation: 'Started in the past, still true → seit + Dat. (verb in the present).' },
  { id: 'z11', usage: 'vor', question: '___ zwei Jahren bin ich nach Deutschland gekommen.', options: ['Vor', 'Seit', 'Für', 'Nach'], answer: 'Vor', explanation: 'A finished point in the past → vor + Dat. (= ago).' },
  { id: 'z12', usage: 'während', question: '___ des Urlaubs habe ich viel gelesen.', options: ['Während', 'Seit', 'Bei', 'Innerhalb'], answer: 'Während', explanation: 'während + Gen. = during.' },
  { id: 'z13', usage: 'ab', question: '___ nächstem Montag gilt der neue Fahrplan.', options: ['Ab', 'Seit', 'Vor', 'Um'], answer: 'Ab', explanation: 'From a point in the future on → ab + Dat.' },
  { id: 'z14', usage: 'gegen', question: 'Ich komme ___ 20 Uhr, vielleicht etwas später.', options: ['gegen', 'um', 'am', 'seit'], answer: 'gegen', explanation: 'Approximately → gegen + Akk.' },
  { id: 'z15', usage: 'für', question: 'Ich fahre ___ zwei Wochen in den Urlaub.', options: ['für', 'seit', 'vor', 'während'], answer: 'für', explanation: 'Planned length of time → für + Akk.' },
  { id: 'z16', usage: 'innerhalb', question: 'Bitte antworten Sie ___ einer Woche.', options: ['innerhalb', 'seit', 'während', 'um'], answer: 'innerhalb', explanation: 'innerhalb + Gen. = within.' },
  { id: 'z17', usage: 'Wochenende', question: '___ Wochenende besuche ich meine Eltern.', options: ['Am', 'Im', 'In', 'Um'], answer: 'Am', explanation: 'das Wochenende → am Wochenende.' },
  { id: 'z18', usage: 'Jahreszeit', question: '___ Sommer fahren wir ans Meer.', options: ['Im', 'Am', 'Um', 'Bei'], answer: 'Im', explanation: 'Seasons → im Sommer, im Winter …' },
  { id: 'z19', usage: 'zwischen', question: '___ Weihnachten und Neujahr ist das Büro geschlossen.', options: ['Zwischen', 'Von', 'Seit', 'Während'], answer: 'Zwischen', explanation: 'zwischen … und … = between.' },
  { id: 'z20', usage: 'Datum', question: 'Wir treffen uns ___ 1. Mai.', options: ['am', 'im', 'um', 'in'], answer: 'am', explanation: 'Dates → am + ordinal number.' },
  { id: 'z21', usage: 'von … bis', question: 'Das Geschäft ist ___ 9 bis 18 Uhr geöffnet.', options: ['von', 'seit', 'ab', 'um'], answer: 'von', explanation: 'von … bis = from … to.' },
  { id: 'z22', usage: 'bei', question: '___ diesem Wetter bleibe ich zu Hause.', options: ['Bei', 'Mit', 'In', 'Am'], answer: 'Bei', explanation: 'Situation / condition → bei + Dat.' },
]
