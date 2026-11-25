import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Passiv() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Passiv</h1>
      <p className="text-base text-gray-500 mb-8">Vorgangspassiv · alle Zeiten · mit Modalverben · Zustandspassiv</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Überblick: Vorgangspassiv in allen Zeiten" defaultOpen>
          <Overview />
        </ReferenceSection>
        <ReferenceSection title="Passiv mit Modalverben">
          <Modal />
        </ReferenceSection>
        <ReferenceSection title="Zustandspassiv: sein + Partizip II">
          <Zustand />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_passiv"
        perfectText="Perfekt — alles richtig gemacht worden!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function Overview() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 sm:p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          <strong>Vorgangspassiv</strong>: the <strong>action</strong> is important, not the person who does it
          (<em>Die Handlung und nicht die Person steht im Vordergrund</em>). Typical for processes:
          how a product is made, rules, instructions. The person can be added with <strong>von + Dativ</strong>.
        </p>
      </div>

      <MiniTable
        head={['Zeit', 'Form', 'Beispiel (Kaffee)']}
        rows={[
          ['Präsens', 'werden (Präsens) + Partizip II', 'Die Kaffeebohnen werden geerntet.'],
          ['Präteritum', 'werden (Präteritum) + Partizip II', 'Die Kaffeebohnen wurden geröstet.'],
          ['Perfekt', 'sein (Präsens) + Partizip II + worden', 'Die Kaffeebohnen sind verpackt worden.'],
          ['Plusquamperfekt', 'sein (Präteritum) + Partizip II + worden', 'Die Kaffeebohnen waren geröstet worden.'],
        ]}
      />

      <SectionCard title="Unser Kursbeispiel: Vom Kaffeestrauch in die Tasse">
        <Ex de="Der Kaffee wird in Brasilien angebaut." en="The coffee is grown in Brazil." />
        <Ex de="Die Kaffeebohnen werden geerntet und aufbereitet." en="The coffee beans are harvested and processed." />
        <Ex de="Die Kaffeebohnen wurden geröstet." en="The coffee beans were roasted." />
        <Ex de="Die Kaffeebohnen sind verpackt worden." en="The coffee beans have been packed." />
        <Ex de="Nachdem die Kaffeebohnen geröstet worden waren, wurden sie verpackt." en="After the coffee beans had been roasted, they were packed." />
      </SectionCard>

      <SectionCard title="⚠️ worden, nicht geworden">
        <p className="text-sm text-gray-600 mb-2">
          In the passive Perfekt and Plusquamperfekt, <em>werden</em> becomes <strong>worden</strong> (no ge-).
          <em> geworden</em> is only for "to become": <em>Er ist Arzt geworden.</em>
        </p>
        <Ex de="Das Paket ist gestern geliefert worden." en="The parcel was delivered yesterday." />
        <Ex de="Der Kaffee wird von Kleinbauern geerntet." en="The coffee is harvested by small farmers. (von + Dativ = by)" />
      </SectionCard>
    </div>
  )
}

function Modal() {
  return (
    <div className="space-y-6">
      <MiniTable
        head={['Zeit', 'Form', 'Beispiel']}
        rows={[
          ['Präsens', 'Modalverb (Präsens) + Partizip II + werden', 'Das Shirt kann gefärbt werden.'],
          ['Präteritum', 'Modalverb (Präteritum) + Partizip II + werden', 'Das Shirt konnte gefärbt werden.'],
          ['Perfekt', 'haben (Präsens) + Partizip II + werden + Modalverb (beide Infinitiv)', 'Das Shirt hat gefärbt werden können.'],
        ]}
      />
      <SectionCard title="Beispiele" formula="Modalverb … Partizip II + werden">
        <Ex de="Die Kaffeemaschine muss jeden Monat entkalkt werden." en="The coffee machine has to be descaled every month." />
        <Ex de="Unfälle müssen unverzüglich gemeldet werden." en="Accidents must be reported immediately." />
        <Ex de="Der Antrag konnte nicht bearbeitet werden." en="The application could not be processed." />
        <Ex de="Die Ware hat nicht geliefert werden können." en="The goods could not be delivered." />
        <p className="text-sm text-gray-500 mt-2">
          In the Perfekt there are <strong>two infinitives at the end</strong> (<em>werden können</em>) and the auxiliary is
          always <strong>haben</strong> — never <em>sein</em>.
        </p>
      </SectionCard>
    </div>
  )
}

function Zustand() {
  return (
    <div className="space-y-6">
      <SectionCard title="Zustandspassiv — Ergebnis / Zustand" formula="sein + Partizip II">
        <p className="text-sm text-gray-600 mb-3">
          The <strong>Zustandspassiv</strong> describes a <strong>result or state</strong> after an action is finished.
        </p>
        <MiniTable
          head={['Zeit', 'Beispiel']}
          rows={[
            ['Präsens', 'Das Fenster ist geöffnet.'],
            ['Präteritum', 'Das Fenster war geöffnet.'],
          ]}
        />
      </SectionCard>
      <SectionCard title="Vorgang vs. Zustand">
        <MiniTable
          head={['Vorgangspassiv (Prozess)', 'Zustandspassiv (Ergebnis)']}
          rows={[
            ['Das Fenster wird geöffnet. (someone is opening it now)', 'Das Fenster ist geöffnet. (it is open)'],
            ['Die Tür wurde abgeschlossen.', 'Die Tür war abgeschlossen.'],
            ['Das Geschäft wird um 9 Uhr geöffnet.', 'Das Geschäft ist bis 20 Uhr geöffnet.'],
          ]}
        />
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const EXERCISES = [
  { id: 'pa1', usage: 'Präsens', question: 'Die Kaffeebohnen ___ per Hand geerntet.', options: ['werden', 'wird', 'sind', 'wurden worden'], answer: 'werden', explanation: 'Passiv Präsens: werden + Partizip II. Plural subject → werden.' },
  { id: 'pa2', usage: 'Präteritum', question: 'Die Kaffeebohnen ___ geröstet.', options: ['wurden', 'wurde', 'werden worden', 'waren'], answer: 'wurden', explanation: 'Passiv Präteritum: wurden + Partizip II.' },
  { id: 'pa3', usage: 'Perfekt', question: 'Die Kaffeebohnen sind verpackt ___.', options: ['worden', 'geworden', 'werden', 'gewesen'], answer: 'worden', explanation: 'Passiv Perfekt: sein + Partizip II + worden (never geworden).' },
  { id: 'pa4', usage: 'Perfekt', question: 'Das Paket ___ gestern geliefert worden.', options: ['ist', 'hat', 'wird', 'wurde'], answer: 'ist', explanation: 'Passiv Perfekt always uses sein: ist … worden.' },
  { id: 'pa5', usage: 'Plusquamperfekt', question: 'Nachdem die Bohnen geröstet worden ___, wurden sie verpackt.', options: ['waren', 'sind', 'hatten', 'wurden'], answer: 'waren', explanation: 'Plusquamperfekt Passiv: waren + Partizip II + worden.' },
  { id: 'pa6', usage: 'Modalverb Präsens', question: 'Das Shirt kann gefärbt ___.', options: ['werden', 'worden', 'wird', 'sein'], answer: 'werden', explanation: 'Modalverb + Partizip II + werden (Infinitiv).' },
  { id: 'pa7', usage: 'Modalverb Präteritum', question: 'Das Shirt ___ gefärbt werden.', options: ['konnte', 'kann gewesen', 'hat', 'ist'], answer: 'konnte', explanation: 'Präteritum: Modalverb im Präteritum + Partizip II + werden.' },
  { id: 'pa8', usage: 'Modalverb Perfekt', question: 'Das Shirt hat gefärbt werden ___.', options: ['können', 'gekonnt', 'konnte', 'worden'], answer: 'können', explanation: 'Perfekt with modal: hat + Partizip II + werden + Modalverb (both infinitives).' },
  { id: 'pa9', usage: 'Modalverb Perfekt', question: 'Die Ware ___ nicht geliefert werden können.', options: ['hat', 'ist', 'wurde', 'wird'], answer: 'hat', explanation: 'With a modal in the Perfekt the auxiliary is always haben.' },
  { id: 'pa10', usage: 'Zustandspassiv', question: 'Komm rein, die Tür ___ geöffnet.', options: ['ist', 'wird', 'wurde', 'hat'], answer: 'ist', explanation: 'A state/result → Zustandspassiv: sein + Partizip II.' },
  { id: 'pa11', usage: 'Zustandspassiv Präteritum', question: 'Als ich kam, ___ das Fenster schon geöffnet.', options: ['war', 'wurde', 'ist', 'hatte'], answer: 'war', explanation: 'State in the past → war + Partizip II.' },
  { id: 'pa12', usage: 'Vorgang vs. Zustand', question: 'Die Kaffeemaschine ___ gerade entkalkt. Bitte warten!', options: ['wird', 'ist', 'hat', 'war'], answer: 'wird', explanation: '"gerade" = the action is happening now → Vorgangspassiv (wird).' },
  { id: 'pa13', usage: 'Modalverb Präsens', question: 'Unfälle müssen unverzüglich gemeldet ___.', options: ['werden', 'worden', 'sein', 'wird'], answer: 'werden', explanation: 'müssen + Partizip II + werden.' },
  { id: 'pa14', usage: 'von + Dativ', question: 'Der Kaffee wird ___ Kleinbauern geerntet.', options: ['von', 'durch den', 'mit', 'bei'], answer: 'von', explanation: 'The person who does the action: von + Dativ.' },
  { id: 'pa15', usage: 'Aktiv → Passiv', question: 'Man verarbeitet die Baumwolle zu Garn. → Die Baumwolle ___ zu Garn verarbeitet.', options: ['wird', 'ist', 'wurde', 'werden'], answer: 'wird', explanation: '"man" + Präsens → Passiv Präsens. Singular subject → wird.' },
  { id: 'pa16', usage: 'Aktiv → Passiv', question: 'Man hat die Fracht nach Hamburg transportiert. → Die Fracht ist nach Hamburg transportiert ___.', options: ['worden', 'geworden', 'werden', 'wurde'], answer: 'worden', explanation: 'Aktiv Perfekt → Passiv Perfekt: ist … worden.' },
  { id: 'pa17', usage: 'Aktiv → Passiv', question: 'Man röstete die Bohnen. → Die Bohnen ___ geröstet.', options: ['wurden', 'werden', 'sind', 'waren worden'], answer: 'wurden', explanation: 'Aktiv Präteritum → Passiv Präteritum: wurden + Partizip II.' },
  { id: 'pa18', usage: 'Präsens', question: 'Aus Getreide ___ Mehl gemacht.', options: ['wird', 'werden', 'ist', 'hat'], answer: 'wird', explanation: 'Mehl is singular → wird gemacht.' },
  { id: 'pa19', usage: 'Welcher Satz ist richtig?', question: 'Welcher Satz ist richtig?', options: ['Der Vertrag ist unterschrieben worden.', 'Der Vertrag ist unterschrieben geworden.', 'Der Vertrag hat unterschrieben worden.', 'Der Vertrag wird unterschrieben worden.'], answer: 'Der Vertrag ist unterschrieben worden.', explanation: 'Passiv Perfekt: ist + Partizip II + worden.' },
  { id: 'pa20', usage: 'Modalverb Präteritum', question: 'Der Antrag ___ leider nicht bearbeitet werden.', options: ['konnte', 'könnte worden', 'hat', 'wurde'], answer: 'konnte', explanation: 'Modalverb im Präteritum + Partizip II + werden.' },
]
