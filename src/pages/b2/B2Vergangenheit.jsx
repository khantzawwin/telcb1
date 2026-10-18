import { Link } from 'react-router-dom'
import Vergangenheit, { makeSession } from '../Vergangenheit'
import { buildSession, shuffle } from '../../components/ChoiceDrill'

// B2: the B1 past-tense page, plus "which tense fits here?" questions.
// The irregular verb groups have their own B2 page.
export default function B2Vergangenheit() {
  return (
    <Vergangenheit
      back={{ to: '/grammar', label: 'B2 Grammatik' }}
      sessionKey="b2_vergangenheit"
      makeDrill={() => shuffle([...makeSession(undefined, 12), ...buildSession(USAGE, 8)])}
      verbGroupsLink={
        <Link
          to="/grammar/b2/verben"
          className="flex items-center justify-between gap-3 bg-white rounded-3xl shadow-sm px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base font-semibold text-gray-800">Unregelmäßige Verben nach Gruppen</span>
          <span className="text-sm font-semibold text-indigo-600 flex-shrink-0">Open ›</span>
        </Link>
      }
    />
  )
}

const PLUSQ = 'Plusquamperfekt (hatte/war + Partizip II) = the earlier of two past events.'
const PRAT_SPOKEN = 'sein, haben, es gibt and the modal verbs use the Präteritum even in speech.'

const USAGE = [
  { id: 'u1', usage: 'nachdem + Plusquamperfekt', question: 'Nachdem wir gegessen ___, gingen wir spazieren.', options: ['hatten', 'haben', 'waren', 'sind'], answer: 'hatten', explanation: `${PLUSQ} essen → haben.` },
  { id: 'u2', usage: 'nachdem + Plusquamperfekt', question: 'Nachdem sie angekommen ___, rief sie ihre Mutter an.', options: ['war', 'hatte', 'ist', 'hat'], answer: 'war', explanation: `${PLUSQ} ankommen → sein (movement).` },
  { id: 'u3', usage: 'Präteritum im Gespräch', question: 'Gestern ___ ich leider keine Zeit.', options: ['hatte', 'habe', 'hätte', 'habe gehabt'], answer: 'hatte', explanation: PRAT_SPOKEN },
  { id: 'u4', usage: 'Präteritum: Modalverb', question: 'Als Kind ___ ich nicht schwimmen.', options: ['konnte', 'könnte', 'kann', 'habe gekonnt'], answer: 'konnte', explanation: `${PRAT_SPOKEN} können → konnte (no umlaut; könnte is Konjunktiv II).` },
  { id: 'u5', usage: 'Perfekt im Gespräch', question: '„Was hast du am Wochenende gemacht?" – „Ich ___ ins Kino gegangen."', options: ['bin', 'habe', 'werde', 'wurde'], answer: 'bin', explanation: 'In speech: Perfekt. gehen = movement from A to B → sein.' },
  { id: 'u6', usage: 'Präteritum: Erzählung', question: 'Es ___ einmal ein König, der drei Töchter hatte.', options: ['war', 'ist', 'wäre', 'wird'], answer: 'war', explanation: 'Stories, fairy tales, reports and books use the Präteritum.' },
  { id: 'u7', usage: 'Plusquamperfekt', question: 'Als ich am Bahnhof ankam, war der Zug schon ___.', options: ['abgefahren', 'abgefahrt', 'abfuhr', 'gefahren ab'], answer: 'abgefahren', explanation: `${PLUSQ} abfahren – fuhr ab – ist abgefahren (separable: ab + ge + fahren).` },
  { id: 'u8', usage: 'Plusquamperfekt', question: 'Ich ___ meinen Schlüssel vergessen, deshalb kam ich nicht in die Wohnung.', options: ['hatte', 'war', 'wurde', 'habe gehabt'], answer: 'hatte', explanation: `${PLUSQ} vergessen → haben.` },
  { id: 'u9', usage: 'Perfekt: haben oder sein?', question: 'Er ___ den ganzen Tag im Bett geblieben.', options: ['ist', 'hat', 'wird', 'würde'], answer: 'ist', explanation: 'bleiben and sein always take sein in the Perfekt, although there is no movement.' },
  { id: 'u10', usage: 'Perfekt: haben oder sein?', question: 'Wir ___ uns gestern im Café getroffen.', options: ['haben', 'sind', 'werden', 'wurden'], answer: 'haben', explanation: 'Reflexive verbs (sich treffen) always take haben.' },
  { id: 'u11', usage: 'Präteritum: Zeitungsbericht', question: 'Im Jahr 1989 ___ die Berliner Mauer.', options: ['fiel', 'fällt', 'fallte', 'gefallen'], answer: 'fiel', explanation: 'Written reports use the Präteritum. fallen – fiel – ist gefallen.' },
  { id: 'u12', usage: 'bevor … + Plusquamperfekt', question: 'Bevor ich nach Deutschland kam, ___ ich schon zwei Jahre Deutsch gelernt.', options: ['hatte', 'habe', 'war', 'bin'], answer: 'hatte', explanation: `${PLUSQ} Learning came before coming to Germany.` },
  { id: 'u13', usage: 'nachdem + Plusquamperfekt', question: 'Nachdem der Film ___ hatte, gingen alle nach Hause.', options: ['geendet', 'endete', 'geendigt', 'endet'], answer: 'geendet', explanation: `${PLUSQ} enden is regular: geendet.` },
  { id: 'u14', usage: 'Präteritum: es gibt', question: 'Früher ___ es hier keinen Supermarkt.', options: ['gab', 'gibt', 'gebte', 'gegeben'], answer: 'gab', explanation: `${PRAT_SPOKEN} es gibt → es gab.` },
  { id: 'u15', usage: 'Präteritum + Plusquamperfekt', question: 'Ich ___ müde, weil ich schlecht geschlafen hatte.', options: ['war', 'wäre', 'werde', 'sei'], answer: 'war', explanation: 'Main event in the Präteritum (war), the earlier cause in the Plusquamperfekt (hatte geschlafen).' },
  { id: 'u16', usage: 'Perfekt: haben oder sein?', question: 'Der Preis ist im letzten Jahr stark ___.', options: ['gestiegen', 'gesteigt', 'stieg', 'gestiegt'], answer: 'gestiegen', explanation: 'steigen – stieg – ist gestiegen (ei – ie – ie). Change of state → sein.' },
]
