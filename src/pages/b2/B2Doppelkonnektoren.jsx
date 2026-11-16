import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2Doppelkonnektoren() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Doppelkonnektoren</h1>
      <p className="text-base text-gray-500 mb-8">sowohl … als auch · weder … noch · zwar … aber · je … desto …</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Überblick: alle 8 Paare" defaultOpen>
          <Overview />
        </ReferenceSection>
        <ReferenceSection title="Aufzählen: sowohl … als auch · weder … noch · nicht nur … sondern auch">
          <Listing />
        </ReferenceSection>
        <ReferenceSection title="Wählen & abwägen: entweder … oder · zwar … aber · einerseits … andererseits · teils … teils">
          <Choosing />
        </ReferenceSection>
        <ReferenceSection title="je … desto / umso">
          <JeDesto />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_doppelkonnektoren"
        perfectText="Perfekt — sowohl richtig als auch schnell!"
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
          A <strong>Doppelkonnektor</strong> is a connector with <strong>two parts</strong>. The first part
          announces what kind of link is coming. Useful in TELC Schreiben and Sprechen to sound more B2.
        </p>
      </div>

      <MiniTable
        head={['Paar', 'Bedeutung', 'Idee']}
        rows={[
          ['sowohl … als auch', 'both … and', '+ +'],
          ['nicht nur … sondern auch', 'not only … but also', '+ + (the 2nd is a surprise)'],
          ['weder … noch', 'neither … nor', '− −'],
          ['entweder … oder', 'either … or', 'one of two'],
          ['zwar …, aber', 'admittedly …, but', 'yes, but …'],
          ['einerseits …, andererseits', 'on the one hand …, on the other', 'pros and cons'],
          ['teils …, teils', 'partly …, partly', 'some this, some that'],
          ['je …, desto / umso', 'the more …, the more', 'two things grow together'],
        ]}
      />

      <SectionCard title="Unser Kursbeispiel: Wie soll ein Lehrer sein?">
        <Ex de="Ein Lehrer soll sowohl pünktlich als auch organisiert sein." en="A teacher should be both punctual and organised." />
        <Ex de="Ein Lehrer soll weder im Bikini noch im Astronautenkostüm zur Schule kommen." en="A teacher should come to school neither in a bikini nor in an astronaut costume." />
        <Ex de="Ein Lehrer soll zwar nett, aber auch streng sein." en="A teacher should be nice, but also strict." />
        <Ex de="Je interessanter der Lehrer ist, desto mehr Lernende gibt es." en="The more interesting the teacher, the more learners there are." />
        <Ex de="Am Montag kommt entweder Cordula oder ein Ersatzlehrer." en="On Monday either Cordula or a substitute teacher is coming." />
      </SectionCard>
    </div>
  )
}

function Listing() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="sowohl … als auch — both … and" formula="sowohl A als auch B">
        <Ex de="Er spricht sowohl Englisch als auch Spanisch." en="He speaks both English and Spanish." />
        <Ex de="Sowohl der Chef als auch die Kollegen waren zufrieden." en="Both the boss and the colleagues were satisfied." />
        <p className="text-sm text-gray-500 mt-2">
          Joins two words or phrases. As subject, the verb is <strong>plural</strong> (<em>waren</em>). No comma.
        </p>
      </SectionCard>

      <SectionCard num="2" title="nicht nur … sondern auch — not only … but also" formula="nicht nur A, sondern auch B">
        <Ex de="Die Stelle bietet nicht nur ein gutes Gehalt, sondern auch flexible Arbeitszeiten." en="The job offers not only a good salary, but also flexible working hours." />
        <p className="text-sm text-gray-500 mt-2">
          Like <em>sowohl … als auch</em>, but B is stressed: a bonus. <strong>Comma before sondern.</strong>
        </p>
      </SectionCard>

      <SectionCard num="3" title="weder … noch — neither … nor" formula="weder A noch B">
        <Ex de="Ich trinke weder Kaffee noch Tee." en="I drink neither coffee nor tea." />
        <Ex de="Er hat weder angerufen noch eine E-Mail geschrieben." en="He neither called nor wrote an e-mail." />
        <p className="text-sm text-gray-500 mt-2">
          Already negative: <strong>no extra nicht / kein</strong>.
          ✗ <em>Ich trinke weder keinen Kaffee …</em>
        </p>
      </SectionCard>
    </div>
  )
}

function Choosing() {
  return (
    <div className="space-y-6">
      <SectionCard num="1" title="entweder … oder — either … or" formula="Entweder + Verb …, oder + Subjekt + Verb">
        <Ex de="Wir fahren entweder mit dem Zug oder mit dem Auto." en="We're going either by train or by car." />
        <Ex de="Entweder kommst du mit, oder du bleibst zu Hause." en="Either you come along, or you stay at home." />
        <p className="text-sm text-gray-500 mt-2">
          <em>Entweder</em> at the start takes position 1 → verb next.
          <em> oder</em> is position 0 → normal order (<em>oder du bleibst</em>).
        </p>
      </SectionCard>

      <SectionCard num="2" title="zwar …, aber — yes …, but" formula="zwar A, aber B">
        <Ex de="Die Arbeit ist zwar anstrengend, aber sie macht Spaß." en="The work is tiring, admittedly, but it's fun." />
        <Ex de="Zwar ist die Wohnung teuer, aber sie liegt sehr zentral." en="The flat is expensive, but it's very central." />
        <p className="text-sm text-gray-500 mt-2">
          You admit A, then say B is more important. <em>Zwar</em> at the start → verb next.
          <em> aber</em> is position 0. Comma before <em>aber</em>.
        </p>
      </SectionCard>

      <SectionCard num="3" title="einerseits …, andererseits — on the one hand …, on the other" formula="Einerseits + Verb …, andererseits + Verb …">
        <Ex de="Einerseits verdient man im Vertrieb gut, andererseits hat man viel Stress." en="On the one hand you earn well in sales, on the other you have a lot of stress." />
        <p className="text-sm text-gray-500 mt-2">
          Both parts are adverbs → <strong>verb comes right after each one</strong>. Perfect for TELC Schreiben:
          giving pros and cons.
        </p>
      </SectionCard>

      <SectionCard num="4" title="teils …, teils — partly …, partly" formula="teils A, teils B">
        <Ex de="Die Teilnehmer waren teils zufrieden, teils enttäuscht." en="Some participants were satisfied, some disappointed." />
        <Ex de="Wir arbeiten teils im Büro, teils im Homeoffice." en="We work partly in the office, partly from home." />
      </SectionCard>
    </div>
  )
}

function JeDesto() {
  return (
    <div className="space-y-6">
      <SectionCard title="je + Komparativ …, desto + Komparativ …" formula="Je + Komp. … Verb (Ende), desto + Komp. + Verb + Subjekt">
        <Ex de="Je interessanter der Lehrer ist, desto mehr Lernende gibt es." en="The more interesting the teacher, the more learners there are." />
        <Ex de="Je länger ich in Deutschland lebe, desto besser spreche ich Deutsch." en="The longer I live in Germany, the better I speak German." />
        <Ex de="Je früher du anfängst, umso schneller bist du fertig." en="The earlier you start, the sooner you'll be finished." />
        <MiniTable
          head={['Teil', 'Wortstellung']}
          rows={[
            ['je …', <>side clause → verb at the <strong>end</strong>: <em>je länger ich hier <strong>lebe</strong></em></>],
            ['desto / umso …', <>verb <strong>right after</strong> the comparative: <em>desto besser <strong>spreche</strong> ich</em></>],
          ]}
        />
        <p className="text-sm text-gray-500 mt-3">
          Both parts need a <strong>comparative</strong> (<em>mehr, besser, länger, interessanter</em>).
          <em> desto</em> and <em>umso</em> mean the same.
        </p>
      </SectionCard>
    </div>
  )
}

// ─── Practice ─────────────────────────────────────────────────────────────────

const OPTS = ['sowohl', 'weder', 'entweder', 'zwar']

const EXERCISES = [
  { id: 'dk1', usage: 'sowohl … als auch', question: 'Ein Lehrer soll ___ pünktlich als auch organisiert sein.', options: OPTS, answer: 'sowohl', explanation: '"als auch" is the second part → first part sowohl. Both qualities (+ +).' },
  { id: 'dk2', usage: 'weder … noch', question: 'Ein Lehrer soll ___ im Bikini noch im Astronautenkostüm zur Schule kommen.', options: OPTS, answer: 'weder', explanation: '"noch" is the second part → weder. Neither … nor (− −).' },
  { id: 'dk3', usage: 'entweder … oder', question: 'Am Montag kommt ___ Cordula oder ein Ersatzlehrer.', options: OPTS, answer: 'entweder', explanation: '"oder" is the second part → entweder. One of two options.' },
  { id: 'dk4', usage: 'zwar … aber', question: 'Ein Lehrer soll ___ nett, aber auch streng sein.', options: OPTS, answer: 'zwar', explanation: 'zwar …, aber = yes …, but. "aber" completes the pair.' },
  { id: 'dk5', usage: 'je … desto', question: 'Je interessanter der Lehrer ist, ___ mehr Lernende gibt es.', options: ['desto', 'als', 'noch', 'aber'], answer: 'desto', explanation: 'je … desto / umso + comparative.' },
  { id: 'dk6', usage: 'nicht nur … sondern auch', question: 'Die Stelle bietet nicht nur ein gutes Gehalt, ___ auch flexible Arbeitszeiten.', options: ['sondern', 'aber', 'als', 'oder'], answer: 'sondern', explanation: 'nicht nur …, sondern auch. After a negative (nicht nur) → sondern, not aber.' },
  { id: 'dk7', usage: 'sowohl … als auch', question: 'Er spricht sowohl Englisch ___ Spanisch.', options: ['als auch', 'noch', 'oder', 'sondern'], answer: 'als auch', explanation: 'sowohl … als auch = both … and.' },
  { id: 'dk8', usage: 'weder … noch', question: 'Ich trinke weder Kaffee ___ Tee – nur Wasser.', options: ['noch', 'oder', 'als auch', 'aber'], answer: 'noch', explanation: 'weder … noch = neither … nor.' },
  { id: 'dk9', usage: 'weder … noch', question: 'Welcher Satz ist richtig?', options: ['Er hat weder angerufen noch geschrieben.', 'Er hat weder nicht angerufen noch geschrieben.', 'Er hat weder angerufen oder geschrieben.', 'Er hat nicht weder angerufen noch geschrieben.'], answer: 'Er hat weder angerufen noch geschrieben.', explanation: 'weder … noch is already negative → no extra nicht.' },
  { id: 'dk10', usage: 'Wortstellung', question: 'Entweder ___ mit, oder du bleibst zu Hause.', options: ['kommst du', 'du kommst', 'du mitkommst', 'kommen du'], answer: 'kommst du', explanation: 'Entweder at the start = position 1 → verb next: Entweder kommst du …' },
  { id: 'dk11', usage: 'Wortstellung', question: 'Entweder kommst du mit, oder ___ zu Hause.', options: ['du bleibst', 'bleibst du', 'du zu Hause bleibst', 'bleiben du'], answer: 'du bleibst', explanation: 'oder is position 0 → normal order: subject, then verb.' },
  { id: 'dk12', usage: 'Wortstellung', question: 'Einerseits verdient man gut, andererseits ___ viel Stress.', options: ['hat man', 'man hat', 'man viel Stress hat', 'haben man'], answer: 'hat man', explanation: 'andererseits is an adverb in position 1 → verb next: andererseits hat man …' },
  { id: 'dk13', usage: 'je … desto', question: 'Je länger ich in Deutschland lebe, desto besser ___ Deutsch.', options: ['spreche ich', 'ich spreche', 'ich Deutsch spreche', 'sprechen ich'], answer: 'spreche ich', explanation: 'desto + comparative, then verb, then subject.' },
  { id: 'dk14', usage: 'je … desto', question: 'Je mehr ich ___, desto sicherer werde ich.', options: ['übe', 'übe ich', 'ich übe', 'üben'], answer: 'übe', explanation: 'The je-part is a side clause → verb at the end: Je mehr ich übe …' },
  { id: 'dk15', usage: 'je … desto', question: 'Je ___ du anfängst, umso schneller bist du fertig.', options: ['früher', 'früh', 'am frühesten', 'frühe'], answer: 'früher', explanation: 'je … desto / umso need a comparative: früher.' },
  { id: 'dk16', usage: 'einerseits … andererseits', question: '___ ist die Stadt schön, andererseits ist sie sehr teuer.', options: ['Einerseits', 'Sowohl', 'Weder', 'Je'], answer: 'Einerseits', explanation: 'andererseits completes the pair → Einerseits. Pros and cons.' },
  { id: 'dk17', usage: 'teils … teils', question: 'Die Teilnehmer waren teils zufrieden, ___ enttäuscht.', options: ['teils', 'noch', 'als auch', 'desto'], answer: 'teils', explanation: 'teils …, teils = partly …, partly. The same word twice.' },
  { id: 'dk18', usage: 'Bedeutung', question: 'Die Wohnung ist ___ teuer, aber sie liegt sehr zentral.', options: ['zwar', 'sowohl', 'weder', 'je'], answer: 'zwar', explanation: 'You admit a negative (teuer), then give a stronger positive → zwar …, aber.' },
  { id: 'dk19', usage: 'Bedeutung', question: 'Mir gefällt die Stelle gar nicht: ___ das Gehalt noch das Team sind gut.', options: ['weder', 'sowohl', 'entweder', 'zwar'], answer: 'weder', explanation: 'Two negatives (− −) → weder … noch.' },
  { id: 'dk20', usage: 'Bedeutung', question: 'Sie können ___ bar oder mit Karte bezahlen.', options: ['entweder', 'weder', 'sowohl', 'zwar'], answer: 'entweder', explanation: 'A choice between two options → entweder … oder.' },
  { id: 'dk21', usage: 'Verb im Plural', question: 'Sowohl der Chef als auch die Kollegen ___ zufrieden.', options: ['waren', 'war', 'ist', 'wird'], answer: 'waren', explanation: 'sowohl A als auch B as subject = two people → plural verb.' },
  { id: 'dk22', usage: 'Wortstellung', question: 'Zwar ___ anstrengend, aber sie macht Spaß.', options: ['ist die Arbeit', 'die Arbeit ist', 'die Arbeit anstrengend ist', 'sein die Arbeit'], answer: 'ist die Arbeit', explanation: 'Zwar at the start = position 1 → verb next.' },
  { id: 'dk23', usage: 'nicht nur … sondern auch', question: 'Er ist nicht nur Lehrer, ___ auch Musiker.', options: ['sondern', 'aber', 'oder', 'noch'], answer: 'sondern', explanation: 'nicht nur …, sondern auch = not only …, but also.' },
  { id: 'dk24', usage: 'Bedeutung', question: 'Wir arbeiten ___ im Büro, teils im Homeoffice.', options: ['teils', 'weder', 'sowohl', 'je'], answer: 'teils', explanation: 'Some of the time here, some there → teils …, teils.' },
]
