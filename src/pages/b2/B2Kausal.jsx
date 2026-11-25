import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Kausal() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Kausale Satzverbindungen</h1>
      <p className="text-base text-gray-500 mb-8">Grund & Folge · weil · da · sodass · denn · nämlich · deshalb · wegen · aufgrund</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Überblick: Grund oder Folge?" defaultOpen>
          <Overview />
        </ReferenceSection>
        <ReferenceSection title="1. Nebensatz: da · weil · sodass · so … dass">
          <Nebensatz />
        </ReferenceSection>
        <ReferenceSection title="2. Hauptsatz: denn · nämlich · deshalb · deswegen · daher · darum · folglich">
          <Hauptsatz />
        </ReferenceSection>
        <ReferenceSection title="3. Präpositionen: wegen · aufgrund + Genitiv">
          <Praeposition />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_kausal"
        perfectText="Perfekt — deshalb bist du so gut!"
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
          <strong>Bedeutung:</strong> Grund und Folge (reason and result). <strong>Frage:</strong> Warum?
          The key question is always: <strong>where does the verb go?</strong>
        </p>
      </div>
      <MiniTable
        head={['Typ', 'Grund (Warum?)', 'Folge (Was passiert dann?)', 'Verb']}
        rows={[
          ['Nebensatz', 'weil, da', 'sodass, so … dass', 'am Ende'],
          ['Hauptsatz (Pos. 0)', 'denn', '—', 'normal (Pos. 2)'],
          ['Hauptsatz (Adverb)', 'nämlich (nach dem Verb!)', 'deshalb, deswegen, daher, darum, folglich', 'direkt danach'],
          ['Präposition', 'wegen, aufgrund + Genitiv', '—', 'kein Verb'],
        ]}
      />
      <SectionCard title="Ein Grund – fünf Sätze">
        <Ex de="Ich trinke heute Tee, weil ich erkältet bin." en="I'm drinking tea today because I have a cold." />
        <Ex de="Ich trinke heute Tee, denn ich bin erkältet." en="I'm drinking tea today, because I have a cold." />
        <Ex de="Ich trinke heute Tee, ich bin nämlich erkältet." en="I'm drinking tea today – I have a cold, you see." />
        <Ex de="Ich bin erkältet, daher trinke ich heute Tee." en="I have a cold, so I'm drinking tea today." />
        <Ex de="Aufgrund meiner Erkältung trinke ich heute Tee." en="Because of my cold I'm drinking tea today." />
      </SectionCard>
    </div>
  )
}

function Nebensatz() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="weil / da — Grund" formula="…, weil/da + … + Verb (Ende)">
        <Ex de="Da es den ganzen Tag geregnet hat, konnte ich nicht spazieren gehen." en="Since it rained all day, I couldn't go for a walk." />
        <Ex de="Ich bleibe zu Hause, weil ich krank bin." en="I'm staying at home because I'm ill." />
        <p className="text-sm text-gray-500 mt-2">
          <em>da</em> often comes <strong>at the start</strong> and gives a reason the listener already knows.
          <em> weil</em> answers a direct <em>Warum?</em> question. If the Nebensatz comes first → verb–comma–verb:
          <em> Da es geregnet <strong>hat</strong>, <strong>konnte</strong> ich …</em>
        </p>
      </SectionCard>
      <SectionCard num="2" title="sodass / so … dass — Folge" formula="…, sodass + … + Verb (Ende)  ·  so + Adjektiv, dass …">
        <Ex de="Die Preise für Lebensmittel steigen, sodass am Monatsende kein Geld übrig bleibt." en="Food prices are rising, so that there's no money left at the end of the month." />
        <Ex de="Die Wohnung ist so teuer, dass ich sie mir nicht leisten kann." en="The flat is so expensive that I can't afford it." />
        <p className="text-sm text-gray-500 mt-2">
          <em>so … dass</em>: <em>so</em> stands <strong>before the adjective</strong> in the main clause and makes it stronger.
          <em> sodass</em> is one word and stays together after the comma.
        </p>
      </SectionCard>
    </div>
  )
}

function Hauptsatz() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="denn — Grund (Position 0)" formula="Hauptsatz, denn + Subjekt + Verb …">
        <Ex de="Ich trinke heute Tee, denn ich bin erkältet." en="I'm drinking tea today, because I have a cold." />
        <p className="text-sm text-gray-500 mt-2">
          <em>denn</em> is like <em>und, aber, oder</em>: position 0, normal word order. It can't start a sentence.
        </p>
      </SectionCard>
      <SectionCard num="2" title="nämlich — Grund (nach dem Verb)" formula="Subjekt + Verb + nämlich …">
        <Ex de="Ich trinke heute Tee, ich bin nämlich erkältet." en="I'm drinking tea today – I have a cold, you see." />
        <p className="text-sm text-gray-500 mt-2">
          ⚠️ <em>nämlich</em> <strong>never</strong> goes in position 1. ✗ <em>Nämlich bin ich erkältet.</em>
        </p>
      </SectionCard>
      <SectionCard num="3" title="deshalb · deswegen · daher · darum · folglich — Folge" formula="Grund, deshalb + Verb + Subjekt …">
        <Ex de="Ich bin erkältet, daher trinke ich heute Tee." en="I have a cold, so I'm drinking tea today." />
        <Ex de="Der Zug hatte Verspätung, deshalb bin ich zu spät gekommen." en="The train was late, that's why I was late." />
        <Ex de="Er hat nicht gelernt, folglich hat er die Prüfung nicht bestanden." en="He didn't study; consequently he failed the exam." />
        <p className="text-sm text-gray-500 mt-2">
          These are adverbs in <strong>position 1 → verb straight after</strong>, then the subject.
          <em> folglich</em> is more formal (Schreiben).
        </p>
      </SectionCard>
    </div>
  )
}

function Praeposition() {
  return (
    <div className="space-y-6">
      <SectionCard title="wegen / aufgrund + Genitiv" formula="wegen/aufgrund + Genitiv (kein Verb)">
        <Ex de="Aufgrund meiner Erkältung trinke ich heute Tee." en="Because of my cold I'm drinking tea today." />
        <Ex de="Wegen des schlechten Wetters bleiben wir zu Hause." en="Because of the bad weather we're staying at home." />
        <Ex de="Aufgrund der hohen Preise kaufen viele Menschen weniger." en="Due to the high prices, many people are buying less." />
        <MiniTable
          head={['Satz mit weil', 'Nominalform (B2-Stil)']}
          rows={[
            ['weil ich erkältet bin', 'wegen / aufgrund meiner Erkältung'],
            ['weil es regnet', 'wegen des Regens'],
            ['weil die Preise hoch sind', 'aufgrund der hohen Preise'],
          ]}
        />
        <p className="text-sm text-gray-500 mt-2">
          <em>aufgrund</em> is more formal than <em>wegen</em>. In spoken German, <em>wegen</em> is often used with the dative
          (<em>wegen dem Wetter</em>) – in TELC Schreiben use the <strong>Genitiv</strong>.
        </p>
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const EXERCISES = [
  { id: 'ka1', usage: 'weil', question: 'Ich bleibe zu Hause, weil ich krank ___.', options: ['bin', 'bin ich', 'ich bin', 'sein'], answer: 'bin', explanation: 'weil = Nebensatz → verb at the end.' },
  { id: 'ka2', usage: 'denn', question: 'Ich trinke heute Tee, denn ___ erkältet.', options: ['ich bin', 'bin ich', 'ich erkältet bin', 'bin'], answer: 'ich bin', explanation: 'denn = position 0 → normal word order: subject, verb.' },
  { id: 'ka3', usage: 'nämlich', question: 'Ich trinke heute Tee, ich bin ___ erkältet.', options: ['nämlich', 'denn', 'deshalb', 'weil'], answer: 'nämlich', explanation: 'nämlich comes after the verb and gives the reason.' },
  { id: 'ka4', usage: 'daher', question: 'Ich bin erkältet, daher ___ heute Tee.', options: ['trinke ich', 'ich trinke', 'ich Tee trinke', 'trinken ich'], answer: 'trinke ich', explanation: 'daher in position 1 → verb next, then subject.' },
  { id: 'ka5', usage: 'aufgrund', question: '___ meiner Erkältung trinke ich heute Tee.', options: ['Aufgrund', 'Weil', 'Denn', 'Deshalb'], answer: 'Aufgrund', explanation: 'Followed by a noun in the Genitiv (meiner Erkältung) → preposition aufgrund.' },
  { id: 'ka6', usage: 'so … dass', question: 'Die Wohnung ist so teuer, ___ ich sie mir nicht leisten kann.', options: ['dass', 'sodass', 'weil', 'denn'], answer: 'dass', explanation: 'so + Adjektiv …, dass → result.' },
  { id: 'ka7', usage: 'sodass', question: 'Die Preise steigen, ___ am Monatsende kein Geld übrig bleibt.', options: ['sodass', 'weil', 'denn', 'deshalb'], answer: 'sodass', explanation: 'The second part is the result and the verb is at the end → sodass.' },
  { id: 'ka8', usage: 'da', question: 'Da es den ganzen Tag geregnet hat, ___ nicht spazieren gehen.', options: ['konnte ich', 'ich konnte', 'ich nicht konnte', 'könnte'], answer: 'konnte ich', explanation: 'Nebensatz first → the main clause starts with the verb (verb, comma, verb).' },
  { id: 'ka9', usage: 'wegen + Genitiv', question: 'Wegen ___ Wetters bleiben wir zu Hause.', options: ['des schlechten', 'dem schlechten', 'das schlechte', 'der schlechten'], answer: 'des schlechten', explanation: 'wegen + Genitiv: das Wetter → des schlechten Wetters.' },
  { id: 'ka10', usage: 'aufgrund + Genitiv', question: 'Aufgrund ___ Preise kaufen viele Menschen weniger.', options: ['der hohen', 'die hohen', 'den hohen', 'des hohen'], answer: 'der hohen', explanation: 'Genitiv plural: der hohen Preise.' },
  { id: 'ka11', usage: 'Grund oder Folge?', question: 'Der Zug hatte Verspätung, ___ bin ich zu spät gekommen.', options: ['deshalb', 'denn', 'weil', 'nämlich'], answer: 'deshalb', explanation: 'The second part is the result and the verb comes next → deshalb.' },
  { id: 'ka12', usage: 'Grund oder Folge?', question: 'Ich bin zu spät gekommen, ___ der Zug hatte Verspätung.', options: ['denn', 'deshalb', 'daher', 'folglich'], answer: 'denn', explanation: 'The second part is the reason with normal word order → denn.' },
  { id: 'ka13', usage: 'nämlich', question: 'Welcher Satz ist richtig?', options: ['Er kommt nicht, er ist nämlich krank.', 'Er kommt nicht, nämlich ist er krank.', 'Er kommt nicht, nämlich er ist krank.', 'Nämlich er ist krank, er kommt nicht.'], answer: 'Er kommt nicht, er ist nämlich krank.', explanation: 'nämlich never stands in position 1 – it comes after the verb.' },
  { id: 'ka14', usage: 'folglich', question: 'Er hat nicht gelernt, folglich ___ die Prüfung nicht bestanden.', options: ['hat er', 'er hat', 'er die Prüfung hat', 'haben er'], answer: 'hat er', explanation: 'folglich = adverb in position 1 → verb next.' },
  { id: 'ka15', usage: 'weil → Nomen', question: 'weil es regnet → ___ des Regens', options: ['wegen', 'weil', 'denn', 'darum'], answer: 'wegen', explanation: 'Noun in the Genitiv → wegen / aufgrund.' },
  { id: 'ka16', usage: 'darum', question: 'Ich habe morgen eine Prüfung, ___ lerne ich heute den ganzen Tag.', options: ['darum', 'denn', 'weil', 'da'], answer: 'darum', explanation: 'Result + verb straight after → darum (= deshalb).' },
  { id: 'ka17', usage: 'da', question: '___ ich kein Auto habe, fahre ich mit dem Bus.', options: ['Da', 'Denn', 'Deshalb', 'Wegen'], answer: 'Da', explanation: 'Nebensatz at the start with verb at the end (habe) → Da. denn can\'t start a sentence.' },
  { id: 'ka18', usage: 'deswegen', question: 'Die Firma hat viel Umsatz gemacht, deswegen ___ alle Mitarbeiter einen Bonus.', options: ['bekommen', 'bekommen sie', 'sie bekommen', 'bekommt'], answer: 'bekommen', explanation: 'deswegen in position 1 → verb next: deswegen bekommen alle Mitarbeiter …' },
  { id: 'ka19', usage: 'so … dass', question: 'Er war ___ müde, dass er sofort eingeschlafen ist.', options: ['so', 'sodass', 'zu', 'sehr'], answer: 'so', explanation: 'so + Adjektiv …, dass.' },
  { id: 'ka20', usage: 'weil', question: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten ___.', options: ['möchte', 'möchte ich', 'ich möchte', 'möchten'], answer: 'möchte', explanation: 'weil → the conjugated verb (the modal) goes to the very end.' },
]
