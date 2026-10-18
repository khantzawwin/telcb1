import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Konjunktiv() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Konjunktiv II</h1>
      <p className="text-base text-gray-500 mb-8">würde + Infinitiv · Wünsche · irreale Bedingungen · Bitten · Ratschläge</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Die Formen: würde + Infinitiv & eigene Formen" defaultOpen>
          <Forms />
        </ReferenceSection>
        <ReferenceSection title="Wann benutze ich den Konjunktiv II?">
          <Uses />
        </ReferenceSection>
        <ReferenceSection title="Vergangenheit: hätte / wäre + Partizip II">
          <Past />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_konjunktiv"
        perfectText="Perfekt — Sie würden die Prüfung bestehen!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

const hl = s => <span className="text-indigo-600 font-semibold">{s}</span>

function Forms() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 sm:p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          Konjunktiv II = <strong>not real</strong>: a wish, a dream, a polite request, advice, or an „if" that isn't true.
          For most verbs use <strong>würde + Infinitiv</strong> (at the end). A few common verbs have their own short form instead.
        </p>
      </div>

      <SectionCard num="1" title="würde + Infinitiv" formula="würde … Infinitiv (Ende)">
        <MiniTable
          head={['Person', 'würde', 'Beispiel']}
          rows={[
            ['ich', <>w{hl('ürde')}</>, 'Ich würde gern reisen.'],
            ['du', <>w{hl('ürdest')}</>, 'Würdest du mir helfen?'],
            ['er / sie / es / man', <>w{hl('ürde')}</>, 'Sie würde das nie sagen.'],
            ['wir', <>w{hl('ürden')}</>, 'Wir würden lieber bleiben.'],
            ['ihr', <>w{hl('ürdet')}</>, 'Würdet ihr mitkommen?'],
            ['sie / Sie', <>w{hl('ürden')}</>, 'Würden Sie bitte warten?'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          ⚠️ <strong>würde</strong> (would) ≠ <strong>wurde</strong> (was / became, Präteritum of werden).
        </p>
      </SectionCard>

      <SectionCard num="2" title="Eigene Formen — use these, not würde" formula="Präteritum + Umlaut (+ e)">
        <MiniTable
          head={['Infinitiv', 'Präteritum', 'Konjunktiv II']}
          rows={[
            ['sein', 'war', <>{hl('wäre')} (ich wäre, du wär(e)st)</>],
            ['haben', 'hatte', <>{hl('hätte')}</>],
            ['können', 'konnte', <>{hl('könnte')}</>],
            ['müssen', 'musste', <>{hl('müsste')}</>],
            ['dürfen', 'durfte', <>{hl('dürfte')}</>],
            ['sollen / wollen', 'sollte / wollte', <>{hl('sollte / wollte')} (no umlaut)</>],
            ['es gibt', 'es gab', <>es {hl('gäbe')}</>],
            ['wissen', 'wusste', <>{hl('wüsste')}</>],
            ['kommen', 'kam', <>{hl('käme')} (or würde kommen)</>],
            ['gehen', 'ging', <>{hl('ginge')} (or würde gehen)</>],
          ]}
        />
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          Rule of thumb: <strong>sein, haben, Modalverben, es gibt, wissen</strong> → own form.
          All other verbs → <strong>würde + Infinitiv</strong>.
        </p>
      </SectionCard>
    </div>
  )
}

function Uses() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="Wünsche" formula="Wenn … doch / nur + K II !">
        <Ex de="Ich würde gern in Berlin wohnen." en="I would like to live in Berlin." />
        <Ex de="Wenn ich doch mehr Zeit hätte!" en="If only I had more time!" />
        <Ex de="Hätte ich doch mehr Zeit!" en="Same meaning: verb first, no wenn." />
        <Ex de="Ich wünschte, du wärst hier." en="I wish you were here." />
      </SectionCard>

      <SectionCard num="2" title="Irreale Bedingung (Gegenwart)" formula="Wenn + K II …, K II …">
        <Ex de="Wenn ich Zeit hätte, würde ich dich besuchen." en="If I had time, I would visit you. (I don't have time.)" />
        <Ex de="Wenn es nicht regnen würde, könnten wir grillen." en="If it weren't raining, we could have a barbecue." />
        <p className="text-sm text-gray-500 mt-2">
          Real vs. unreal: <em>Wenn ich Zeit habe, komme ich.</em> (possible) ·
          <em> Wenn ich Zeit hätte, käme ich.</em> (not the case)
        </p>
      </SectionCard>

      <SectionCard num="3" title="Höfliche Bitten" formula="Würden / Könnten / Hätten Sie …?">
        <Ex de="Würden Sie mir bitte helfen?" en="Would you help me, please?" />
        <Ex de="Könnten Sie das Fenster schließen?" en="Could you close the window?" />
        <Ex de="Hätten Sie kurz Zeit?" en="Would you have a moment?" />
        <Ex de="Wäre es möglich, den Termin zu verschieben?" en="Would it be possible to move the appointment?" />
      </SectionCard>

      <SectionCard num="4" title="Ratschläge & Vorschläge" formula="An deiner Stelle würde ich … · Du solltest …">
        <Ex de="An deiner Stelle würde ich zum Arzt gehen." en="If I were you, I would see a doctor." />
        <Ex de="Du solltest mehr schlafen." en="You should sleep more." />
        <Ex de="Es wäre besser, wenn wir früher anfangen würden." en="It would be better if we started earlier." />
      </SectionCard>

      <SectionCard num="5" title="Irrealer Vergleich" formula="als ob + … K II (Ende) · als + K II …">
        <Ex de="Er tut so, als ob er alles wüsste." en="He acts as if he knew everything." />
        <Ex de="Sie sieht aus, als wäre sie müde." en="She looks as if she were tired. (als + verb directly)" />
      </SectionCard>
    </div>
  )
}

function Past() {
  return (
    <div className="space-y-6">
      <SectionCard title="Irreal in der Vergangenheit" formula="hätte / wäre + Partizip II">
        <p className="text-base text-gray-700 mb-3 leading-relaxed">
          Something that did <strong>not</strong> happen. Choose hätte or wäre like haben/sein in the Perfekt.
        </p>
        <Ex de="Wenn ich gelernt hätte, hätte ich die Prüfung bestanden." en="If I had studied, I would have passed the exam." />
        <Ex de="Wenn du früher gekommen wärst, hättest du ihn gesehen." en="If you had come earlier, you would have seen him." />
        <Ex de="Hätte ich doch früher angefangen!" en="If only I had started earlier!" />
      </SectionCard>
      <SectionCard title="Mit Modalverb" formula="hätte + Infinitiv + Modalverb (Infinitiv)">
        <Ex de="Ich hätte früher anfangen sollen." en="I should have started earlier." />
        <Ex de="Du hättest mich anrufen können." en="You could have called me." />
        <p className="text-sm text-gray-500 mt-2">Two infinitives at the end. Not „gesollt" / „gekonnt".</p>
      </SectionCard>
      <SectionCard title="Gemischt: Vergangenheit → Gegenwart">
        <Ex de="Wenn ich mehr geschlafen hätte, wäre ich jetzt nicht so müde." en="If I had slept more, I wouldn't be so tired now." />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const OWN = 'sein, haben, Modalverben, es gibt and wissen use their own form, not würde.'

const EXERCISES = [
  { id: 'k1', usage: 'Irreale Bedingung', question: 'Wenn ich mehr Geld ___, würde ich ein Haus kaufen.', options: ['hätte', 'habe', 'hatte', 'würde'], answer: 'hätte', explanation: `Unreal now → K II. haben → hätte. ${OWN}` },
  { id: 'k2', usage: 'Ratschlag', question: 'Wenn ich du ___, würde ich den Job annehmen.', options: ['wäre', 'war', 'bin', 'würde'], answer: 'wäre', explanation: '„Wenn ich du wäre" = If I were you. sein → wäre.' },
  { id: 'k3', usage: 'würde oder wurde?', question: 'Ich ___ gern mehr reisen, aber ich habe keine Zeit.', options: ['würde', 'wurde', 'werde', 'wird'], answer: 'würde', explanation: 'A wish → würde + Infinitiv. „wurde" is Präteritum of werden.' },
  { id: 'k4', usage: 'Höfliche Bitte', question: '___ Sie mir bitte das Salz geben?', options: ['Könnten', 'Konnten', 'Könnte', 'Kannten'], answer: 'Könnten', explanation: 'Polite request: Könnten Sie …? (Sie → -en). Konnten = Präteritum.' },
  { id: 'k5', usage: 'Wunsch', question: 'Wenn ich doch nur mehr Zeit ___!', options: ['hätte', 'habe', 'hatte', 'hätten'], answer: 'hätte', explanation: 'Wish: Wenn … doch / nur + K II, verb at the end.' },
  { id: 'k6', usage: 'Wunsch (Vergangenheit)', question: '___ ich doch früher angefangen!', options: ['Hätte', 'Wäre', 'Würde', 'Hatte'], answer: 'Hätte', explanation: 'Past wish: hätte/wäre + Partizip II. anfangen → haben → hätte.' },
  { id: 'k7', usage: 'Irreal (Vergangenheit)', question: 'Wenn du früher gekommen ___, hättest du ihn getroffen.', options: ['wärst', 'hättest', 'würdest', 'warst'], answer: 'wärst', explanation: 'kommen takes sein → wärst gekommen.' },
  { id: 'k8', usage: 'Irreal (Vergangenheit)', question: 'Wenn ich gelernt hätte, ___ ich die Prüfung bestanden.', options: ['hätte', 'wäre', 'würde', 'hatte'], answer: 'hätte', explanation: 'bestehen takes haben → hätte bestanden.' },
  { id: 'k9', usage: 'Ratschlag', question: 'An deiner Stelle ___ ich zum Arzt gehen.', options: ['würde', 'wäre', 'hätte', 'werde'], answer: 'würde', explanation: 'An deiner Stelle würde ich … + Infinitiv (gehen) at the end.' },
  { id: 'k10', usage: 'Ratschlag', question: 'Du ___ weniger arbeiten.', options: ['solltest', 'solltet', 'würdest', 'hättest'], answer: 'solltest', explanation: 'Advice: du solltest … (ihr solltet).' },
  { id: 'k11', usage: 'als ob', question: 'Er tut so, als ob er alles ___.', options: ['wüsste', 'wusste', 'weißt', 'gewusst'], answer: 'wüsste', explanation: 'als ob + K II at the end. wissen → wüsste.' },
  { id: 'k12', usage: 'Vorschlag', question: 'Es ___ schön, wenn du mitkommen könntest.', options: ['wäre', 'war', 'würde', 'hätte'], answer: 'wäre', explanation: `Es wäre schön, wenn … ${OWN}` },
  { id: 'k13', usage: 'Höfliche Bitte', question: '___ Sie kurz Zeit für mich?', options: ['Hätten', 'Hatten', 'Wären', 'Würden'], answer: 'Hätten', explanation: 'Zeit haben → Hätten Sie Zeit?' },
  { id: 'k14', usage: 'Irreale Bedingung', question: 'Wenn es heute nicht so kalt ___, könnten wir schwimmen gehen.', options: ['wäre', 'würde', 'hätte', 'ist'], answer: 'wäre', explanation: 'kalt sein → wäre. Both parts in K II.' },
  { id: 'k15', usage: 'Wunsch', question: 'Ich ___ dir gern helfen, aber ich muss arbeiten.', options: ['würde', 'werde', 'hätte', 'wäre'], answer: 'würde', explanation: 'würde + Infinitiv (helfen).' },
  { id: 'k16', usage: 'Irreale Bedingung', question: 'Wenn ich Zeit hätte, ___ ich dich besuchen.', options: ['würde', 'werde', 'wäre', 'wurde'], answer: 'würde', explanation: 'besuchen has no short K II form → würde besuchen.' },
  { id: 'k17', usage: 'Modalverb (Vergangenheit)', question: 'Ich hätte früher anfangen ___.', options: ['sollen', 'gesollt', 'sollte', 'zu sollen'], answer: 'sollen', explanation: 'hätte + Infinitiv + Modalverb im Infinitiv (double infinitive).' },
  { id: 'k18', usage: 'es gibt', question: 'Wenn es mehr Parkplätze ___, käme ich mit dem Auto.', options: ['gäbe', 'gibt', 'gab', 'gegeben'], answer: 'gäbe', explanation: 'es gibt → es gäbe.' },
  { id: 'k19', usage: 'Irreal (Vergangenheit)', question: 'Wenn der Bus pünktlich ___, wäre ich nicht zu spät gekommen.', options: ['gekommen wäre', 'gekommen hätte', 'kommen würde', 'kam'], answer: 'gekommen wäre', explanation: 'Past unreal: wäre + Partizip II (kommen → sein).' },
  { id: 'k20', usage: 'Ich wünschte …', question: 'Ich wünschte, ich ___ besser Deutsch sprechen.', options: ['könnte', 'kann', 'konnte', 'können'], answer: 'könnte', explanation: 'Ich wünschte + K II. können → könnte.' },
  { id: 'k21', usage: 'Ich wünschte …', question: 'Ich wünschte, du ___ hier.', options: ['wärst', 'bist', 'warst', 'würdest'], answer: 'wärst', explanation: 'sein → du wär(e)st.' },
  { id: 'k22', usage: 'würde + Infinitiv', question: 'Würden Sie mir bitte ___?', options: ['helfen', 'geholfen', 'zu helfen', 'half'], answer: 'helfen', explanation: 'würde + Infinitiv without zu.' },
  { id: 'k23', usage: 'Gemischt', question: 'Wenn ich mehr geschlafen hätte, ___ ich jetzt nicht so müde.', options: ['wäre', 'hätte', 'würde', 'war'], answer: 'wäre', explanation: 'Past condition (hätte geschlafen) → result now (wäre müde).' },
  { id: 'k24', usage: 'als + K II', question: 'Er sieht aus, als ___ er krank.', options: ['wäre', 'war', 'würde', 'hätte'], answer: 'wäre', explanation: 'als (without ob) + verb directly: als wäre er krank.' },
  { id: 'k25', usage: 'Irreal (Vergangenheit)', question: 'Wenn sie das gewusst ___, hätte sie anders gehandelt.', options: ['hätte', 'wäre', 'würde', 'hatte'], answer: 'hätte', explanation: 'wissen takes haben → hätte gewusst.' },
  { id: 'k26', usage: 'Höfliche Empfehlung', question: 'Ich ___ Ihnen empfehlen, früh zu buchen.', options: ['würde', 'wäre', 'hätte', 'wurde'], answer: 'würde', explanation: 'Polite advice: Ich würde Ihnen empfehlen, … zu …' },
]
