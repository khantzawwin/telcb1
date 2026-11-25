import { BackToGrammar, ReferenceSection, PracticeHeading } from '../../components/DrillLayout'
import ChoiceDrill, { buildSession } from '../../components/ChoiceDrill'
import { SectionCard, MiniTable, Ex } from '../../components/LearnBlocks'

const SESSION_SIZE = 15

export default function B2NomenVerb() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12">
      <BackToGrammar to="/grammar" label="B2 Grammatik" />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Nomen-Verb-Verbindungen</h1>
      <p className="text-base text-gray-500 mb-8">zur Verfügung stellen · in Kauf nehmen · Rücksicht nehmen · zur Sprache kommen …</p>

      <div className="space-y-4 mb-10">
        <ReferenceSection title="Was ist das?" defaultOpen>
          <Intro />
        </ReferenceSection>
        <ReferenceSection title="Mit nehmen">
          <List rows={NEHMEN} />
        </ReferenceSection>
        <ReferenceSection title="Mit kommen · stehen · stellen · setzen">
          <List rows={KOMMEN_STEHEN} />
        </ReferenceSection>
        <ReferenceSection title="Mit anderen Verben">
          <List rows={ANDERE} />
        </ReferenceSection>
      </div>

      <PracticeHeading />
      <ChoiceDrill
        makeSession={() => buildSession(EXERCISES, SESSION_SIZE)}
        sessionKey="b2_nomenverb"
        perfectText="Perfekt — das kommt gar nicht infrage, dass du einen Fehler machst!"
      />
    </div>
  )
}

// ─── Reference ────────────────────────────────────────────────────────────────

function Intro() {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 sm:p-6">
        <p className="text-base text-gray-700 leading-relaxed">
          A <strong>Nomen-Verb-Verbindung</strong> is a fixed pair: the <strong>noun carries the meaning</strong>,
          the verb is almost empty (<em>nehmen, kommen, stellen, stehen …</em>). They sound formal and are typical of
          letters, e-mails and meetings – great for TELC B2 Schreiben. Learn them as a block, with the preposition.
        </p>
      </div>
      <SectionCard title="Stellen vs. stehen">
        <MiniTable
          head={['aktiv (jemand macht etwas)', 'Zustand / passiv']}
          rows={[
            ['etwas zur Verfügung stellen', 'zur Verfügung stehen'],
            ['etwas zur Diskussion stellen', 'zur Diskussion stehen'],
            ['etwas zur Sprache bringen', 'zur Sprache kommen'],
          ]}
        />
        <Ex de="Inlingua stellt jedem Lehrer einen Laptop zur Verfügung." en="Inlingua provides every teacher with a laptop." />
        <Ex de="Jedem Lehrer steht ein Laptop zur Verfügung." en="A laptop is available to every teacher." />
      </SectionCard>
    </div>
  )
}

function List({ rows }) {
  return (
    <div className="space-y-3">
      {rows.map(([nvv, meaning, de, en]) => (
        <SectionCard key={nvv} title={nvv} formula={meaning}>
          <Ex de={de} en={en} />
        </SectionCard>
      ))}
    </div>
  )
}

const NEHMEN = [
  ['etwas in Angriff nehmen', '= beginnen mit', 'Im Juni möchten wir die Renovierung in Angriff nehmen.', 'We want to get started on the renovation in June.'],
  ['etwas in Empfang nehmen', '= annehmen, entgegennehmen', 'Kannst du für mich ein Paket in Empfang nehmen?', 'Can you take in a parcel for me?'],
  ['Rücksicht nehmen auf + Akk.', '= berücksichtigen, beachten', 'Man muss auf ältere Fahrgäste Rücksicht nehmen.', 'You have to be considerate of older passengers.'],
  ['Abschied nehmen von + Dat.', '= sich (für lange) verabschieden', 'Frau Meier geht in Rente, wir müssen von ihr Abschied nehmen.', 'Ms Meier is retiring; we have to say goodbye to her.'],
  ['etwas in Kauf nehmen', '= (etwas Negatives) akzeptieren', 'Wer Karriere machen will, muss unbezahlte Überstunden in Kauf nehmen.', 'Anyone who wants a career has to accept unpaid overtime.'],
  ['Bezug nehmen auf + Akk.', '= sich beziehen auf', 'Wir nehmen Bezug auf Ihr Schreiben vom 10. November.', 'We refer to your letter of 10 November.'],
]

const KOMMEN_STEHEN = [
  ['zur Sprache kommen', '= ein Thema wird angesprochen', 'Auf der Teamsitzung kommt das Thema „Urlaubsplanung“ zur Sprache.', 'The topic "holiday planning" comes up at the team meeting.'],
  ['infrage kommen', '= möglich sein', 'In Krisenzeiten kommt keine Gehaltserhöhung infrage.', 'In times of crisis a pay rise is out of the question.'],
  ['zu dem Entschluss kommen', '= sich entscheiden', 'Wir sind zu dem Entschluss gekommen, unsere Rücklagen zu erhöhen.', 'We have decided to increase our reserves.'],
  ['zur Verfügung stehen', '= verfügbar sein', 'Moderne Arbeitsmittel stehen Ihnen in jedem Raum zur Verfügung.', 'Modern equipment is available to you in every room.'],
  ['zur Verfügung stellen', '= geben, zur Benutzung überlassen', 'Die Firma hat mir einen Wagen zur Verfügung gestellt.', 'The company provided me with a car.'],
  ['zur Diskussion stehen', '= diskutiert werden', 'Das Thema steht bei der Sitzung zur Diskussion.', 'The topic is up for discussion at the meeting.'],
  ['jemanden in Kenntnis setzen', '= informieren', 'Ich möchte Sie davon in Kenntnis setzen, dass die Besprechung verschoben wurde.', 'I would like to inform you that the meeting has been postponed.'],
]

const ANDERE = [
  ['einen Beitrag leisten zu + Dat.', '= etwas beitragen', 'Wir alle können einen Beitrag zum Umweltschutz leisten.', 'We can all contribute to protecting the environment.'],
  ['Maßnahmen ergreifen / treffen', '= eine Aktion durchführen', 'Die Firma muss Maßnahmen ergreifen, um Unfälle zu vermeiden.', 'The company has to take measures to avoid accidents.'],
  ['einen Anspruch haben auf + Akk.', '= ein Recht haben auf', 'Jeder Arbeitnehmer hat einen Anspruch auf bezahlten Urlaub.', 'Every employee is entitled to paid holiday.'],
  ['in der Lage sein', '= können', 'Ich bin nicht in der Lage, den Computer zu starten.', "I'm not able to start the computer."],
  ['einen Standpunkt vertreten', '= meinen, glauben', 'Ich vertrete den Standpunkt, dass Homeoffice produktiver ist.', 'I take the view that working from home is more productive.'],
  ['eine Präsentation halten', '= präsentieren', 'Am Donnerstag hält jeder eine Präsentation.', 'On Thursday everyone gives a presentation.'],
  ['jemandem ins Wort fallen', '= unterbrechen', 'Warum fällst du mir die ganze Zeit ins Wort?', 'Why do you keep interrupting me?'],
  ['etwas in Erfahrung bringen', '= herausfinden', 'Ich habe in Erfahrung gebracht, wo er wohnt.', 'I found out where he lives.'],
  ['Wert legen auf + Akk.', '= wichtig finden', 'Ich lege großen Wert auf Sauberkeit in der Küche.', 'Cleanliness in the kitchen is very important to me.'],
]

// ─── Practice ─────────────────────────────────────────────────────────────────

const EXERCISES = [
  { id: 'nv1', usage: 'in Empfang nehmen', question: 'Kannst du für mich ein Paket in Empfang ___?', options: ['nehmen', 'stellen', 'kommen', 'bringen'], answer: 'nehmen', explanation: 'etwas in Empfang nehmen = to receive, take in.' },
  { id: 'nv2', usage: 'in Angriff nehmen', question: 'Im Juni möchten wir die Renovierung in ___ nehmen.', options: ['Angriff', 'Kauf', 'Empfang', 'Rücksicht'], answer: 'Angriff', explanation: 'in Angriff nehmen = to start, tackle.' },
  { id: 'nv3', usage: 'Wert legen auf', question: 'Ich lege großen ___ auf Sauberkeit in der Küche.', options: ['Wert', 'Anspruch', 'Bezug', 'Beitrag'], answer: 'Wert', explanation: 'Wert legen auf + Akk. = to attach importance to.' },
  { id: 'nv4', usage: 'in Kenntnis setzen', question: 'Ich möchte Sie in Kenntnis ___, dass die Besprechung verschoben wurde.', options: ['setzen', 'stellen', 'nehmen', 'bringen'], answer: 'setzen', explanation: 'jemanden in Kenntnis setzen = to inform (formal).' },
  { id: 'nv5', usage: 'zu dem Entschluss kommen', question: 'Wir sind zu dem ___ gekommen, dass wir unsere Rücklagen erhöhen müssen.', options: ['Entschluss', 'Standpunkt', 'Vorrang', 'Anspruch'], answer: 'Entschluss', explanation: 'zu dem Entschluss kommen = to come to the decision.' },
  { id: 'nv6', usage: 'Rücksicht nehmen auf', question: 'Man muss ___ ältere Fahrgäste Rücksicht nehmen.', options: ['auf', 'für', 'an', 'von'], answer: 'auf', explanation: 'Rücksicht nehmen auf + Akk.' },
  { id: 'nv7', usage: 'Abschied nehmen von', question: 'Leider müssen wir ___ Frau Meier Abschied nehmen.', options: ['von', 'auf', 'mit', 'an'], answer: 'von', explanation: 'Abschied nehmen von + Dat.' },
  { id: 'nv8', usage: 'zur Sprache kommen', question: 'Auf der Teamsitzung kommt das Thema Urlaub zur ___.', options: ['Sprache', 'Diskussion', 'Verfügung', 'Kenntnis'], answer: 'Sprache', explanation: 'zur Sprache kommen = to come up (as a topic).' },
  { id: 'nv9', usage: 'infrage kommen', question: 'In Krisenzeiten ___ keine Gehaltserhöhung infrage.', options: ['kommt', 'steht', 'nimmt', 'stellt'], answer: 'kommt', explanation: 'infrage kommen = to be possible; nicht infrage kommen = out of the question.' },
  { id: 'nv10', usage: 'stehen vs. stellen', question: 'Jedem Lehrer ___ ein Laptop zur Verfügung.', options: ['steht', 'stellt', 'kommt', 'nimmt'], answer: 'steht', explanation: 'The laptop is available (state) → zur Verfügung stehen.' },
  { id: 'nv11', usage: 'stehen vs. stellen', question: 'Inlingua ___ jedem Lehrer einen Laptop zur Verfügung.', options: ['stellt', 'steht', 'bringt', 'setzt'], answer: 'stellt', explanation: 'Someone gives something (active, Akkusativ object) → zur Verfügung stellen.' },
  { id: 'nv12', usage: 'einen Beitrag leisten', question: 'Wir alle können einen Beitrag zum Umweltschutz ___.', options: ['leisten', 'nehmen', 'stellen', 'haben'], answer: 'leisten', explanation: 'einen Beitrag leisten = to make a contribution.' },
  { id: 'nv13', usage: 'Maßnahmen ergreifen', question: 'Die Firma muss Maßnahmen ___, um Unfälle zu vermeiden.', options: ['ergreifen', 'nehmen', 'stellen', 'leisten'], answer: 'ergreifen', explanation: 'Maßnahmen ergreifen / treffen = to take measures.' },
  { id: 'nv14', usage: 'in Kauf nehmen', question: 'Wer Karriere machen will, muss Überstunden in ___ nehmen.', options: ['Kauf', 'Angriff', 'Anspruch', 'Empfang'], answer: 'Kauf', explanation: 'etwas in Kauf nehmen = to accept a disadvantage.' },
  { id: 'nv15', usage: 'Bezug nehmen auf', question: 'Wir nehmen ___ auf Ihr Schreiben vom 10. November.', options: ['Bezug', 'Rücksicht', 'Abschied', 'Wert'], answer: 'Bezug', explanation: 'Bezug nehmen auf + Akk. = to refer to (formal letters).' },
  { id: 'nv16', usage: 'einen Anspruch haben auf', question: 'Jeder Arbeitnehmer hat einen ___ auf bezahlten Urlaub.', options: ['Anspruch', 'Beitrag', 'Bezug', 'Entschluss'], answer: 'Anspruch', explanation: 'einen Anspruch haben auf = to be entitled to.' },
  { id: 'nv17', usage: 'in der Lage sein', question: 'Ich bin nicht in der ___, den Computer zu starten.', options: ['Lage', 'Verfügung', 'Sprache', 'Kenntnis'], answer: 'Lage', explanation: 'in der Lage sein = to be able to.' },
  { id: 'nv18', usage: 'ins Wort fallen', question: 'Warum ___ du mir die ganze Zeit ins Wort?', options: ['fällst', 'nimmst', 'kommst', 'stellst'], answer: 'fällst', explanation: 'jemandem ins Wort fallen = to interrupt someone.' },
  { id: 'nv19', usage: 'in Erfahrung bringen', question: 'Ich habe in Erfahrung ___, wo er wohnt.', options: ['gebracht', 'genommen', 'gestellt', 'gekommen'], answer: 'gebracht', explanation: 'etwas in Erfahrung bringen = to find out.' },
  { id: 'nv20', usage: 'zur Diskussion stehen', question: 'Das Thema ___ bei der Sitzung zur Diskussion.', options: ['steht', 'kommt', 'nimmt', 'setzt'], answer: 'steht', explanation: 'zur Diskussion stehen = to be up for discussion.' },
  { id: 'nv21', usage: 'einen Standpunkt vertreten', question: 'Ich ___ den Standpunkt, dass Homeoffice produktiver ist.', options: ['vertrete', 'nehme', 'stelle', 'leiste'], answer: 'vertrete', explanation: 'einen Standpunkt vertreten = to hold a view.' },
  { id: 'nv22', usage: 'Bedeutung', question: '„etwas in Kauf nehmen“ bedeutet …', options: ['etwas Negatives akzeptieren', 'etwas kaufen', 'etwas beginnen', 'etwas bekommen'], answer: 'etwas Negatives akzeptieren', explanation: 'Nothing to do with buying – it means accepting a disadvantage.' },
  { id: 'nv23', usage: 'Perfekt', question: 'Das Thema ist gestern zur Sprache ___.', options: ['gekommen', 'genommen', 'gestellt', 'gestanden'], answer: 'gekommen', explanation: 'zur Sprache kommen → Perfekt with sein: ist zur Sprache gekommen.' },
]
