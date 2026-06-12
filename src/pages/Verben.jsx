import { useState, useMemo } from 'react'

// ─── Exercise data — A2 + B1 verbs from easy-deutsch.de PDF ──────────────────

const EXERCISES = [
  // ── sich freuen ──
  { id: 'vp_01', verb: 'sich freuen + ??? (etwas Zukünftiges)', question: 'Ich freue mich sehr ___ deinen Besuch nächste Woche.', options: ['auf', 'über', 'von', 'für'], answer: 'auf', explanation: 'sich freuen AUF + Akkusativ = looking forward to something in the future. "Nächste Woche" = future → auf.' },
  { id: 'vp_02', verb: 'sich freuen + ??? (etwas Erhaltenes)', question: 'Maria freut sich sehr ___ das schöne Geschenk.', options: ['über', 'auf', 'von', 'für'], answer: 'über', explanation: 'sich freuen ÜBER + Akkusativ = happy about something received or past. The gift was already given → über.' },

  // ── warten ──
  { id: 'vp_03', verb: 'warten + ???', question: 'Ich warte schon seit einer Stunde ___ den Bus.', options: ['auf', 'für', 'um', 'an'], answer: 'auf', explanation: 'warten AUF + Akkusativ. You always wait FOR something or someone → auf.' },

  // ── denken ──
  { id: 'vp_04', verb: 'denken + ???', question: 'Ich denke oft ___ meine Kindheit.', options: ['an', 'über', 'von', 'auf'], answer: 'an', explanation: 'denken AN + Akkusativ = to think about/of someone or something you miss or remember.' },

  // ── sich erinnern ──
  { id: 'vp_05', verb: 'sich erinnern + ???', question: 'Erinnerst du dich noch ___ unseren ersten Schultag?', options: ['an', 'auf', 'von', 'über'], answer: 'an', explanation: 'sich erinnern AN + Akkusativ = to remember/recall someone or something.' },

  // ── sich interessieren ──
  { id: 'vp_06', verb: 'sich interessieren + ???', question: 'Er interessiert sich sehr ___ deutsche Literatur.', options: ['für', 'an', 'über', 'um'], answer: 'für', explanation: 'sich interessieren FÜR + Akkusativ = to be interested in something.' },

  // ── träumen ──
  { id: 'vp_07', verb: 'träumen + ???', question: 'Als Kind habe ich immer ___ einer Weltreise geträumt.', options: ['von', 'über', 'an', 'für'], answer: 'von', explanation: 'träumen VON + Dativ = to dream of/about something.' },

  // ── sprechen ──
  { id: 'vp_08', verb: 'sprechen + ??? (Thema diskutieren)', question: 'Wir müssen ___ dieses Problem sprechen.', options: ['über', 'von', 'mit', 'an'], answer: 'über', explanation: 'sprechen ÜBER + Akkusativ = to talk about a topic (in depth, as a discussion).' },
  { id: 'vp_09', verb: 'sprechen + ??? (mit einer Person)', question: 'Ich habe gestern ___ meiner Chefin gesprochen.', options: ['mit', 'über', 'von', 'zu'], answer: 'mit', explanation: 'sprechen MIT + Dativ = to speak with / to a person.' },

  // ── sich ärgern ──
  { id: 'vp_10', verb: 'sich ärgern + ???', question: 'Er ärgert sich sehr ___ die hohen Preise.', options: ['über', 'auf', 'von', 'mit'], answer: 'über', explanation: 'sich ärgern ÜBER + Akkusativ = to be annoyed/upset about something.' },

  // ── sich beschweren ──
  { id: 'vp_11', verb: 'sich beschweren + ??? (der Grund)', question: 'Die Mieter haben sich ___ den Lärm beschwert.', options: ['über', 'bei', 'gegen', 'von'], answer: 'über', explanation: 'sich beschweren ÜBER + Akkusativ = to complain about something (the cause or reason).' },
  { id: 'vp_12', verb: 'sich beschweren + ??? (die Person/Stelle)', question: 'Sie hat sich ___ dem Chef beschwert.', options: ['bei', 'über', 'gegen', 'an'], answer: 'bei', explanation: 'sich beschweren BEI + Dativ = to complain to someone (the authority or person you address).' },

  // ── teilnehmen ──
  { id: 'vp_13', verb: 'teilnehmen + ???', question: 'Nächste Woche nehme ich ___ einem Sprachkurs teil.', options: ['an', 'bei', 'für', 'auf'], answer: 'an', explanation: 'teilnehmen AN + Dativ = to participate in / take part in something.' },

  // ── nachdenken ──
  { id: 'vp_14', verb: 'nachdenken + ???', question: 'Ich denke gerade ___ deinen Vorschlag nach.', options: ['über', 'an', 'von', 'für'], answer: 'über', explanation: 'nachdenken ÜBER + Akkusativ = to think about / reflect on something.' },

  // ── sich entscheiden ──
  { id: 'vp_15', verb: 'sich entscheiden + ??? (etwas wählen)', question: 'Am Ende hat sie sich ___ den Job in München entschieden.', options: ['für', 'gegen', 'um', 'auf'], answer: 'für', explanation: 'sich entscheiden FÜR + Akkusativ = to decide in favor of something.' },
  { id: 'vp_16', verb: 'sich entscheiden + ??? (etwas ablehnen)', question: 'Er hat sich ___ das Angebot entschieden — es war zu teuer.', options: ['gegen', 'für', 'ohne', 'auf'], answer: 'gegen', explanation: 'sich entscheiden GEGEN + Akkusativ = to decide against something.' },

  // ── helfen ──
  { id: 'vp_17', verb: 'helfen + ??? (eine Aufgabe)', question: 'Kannst du mir ___ den Hausaufgaben helfen?', options: ['bei', 'mit', 'an', 'für'], answer: 'bei', explanation: 'helfen + Dativ + BEI + Dativ = to help someone with a specific task.' },

  // ── anfangen / aufhören ──
  { id: 'vp_18', verb: 'anfangen + ???', question: 'Wir fangen morgen ___ dem Projekt an.', options: ['mit', 'an', 'für', 'auf'], answer: 'mit', explanation: 'anfangen MIT + Dativ = to start with / begin something.' },
  { id: 'vp_19', verb: 'aufhören + ???', question: 'Er hat endlich ___ dem Rauchen aufgehört.', options: ['mit', 'von', 'für', 'an'], answer: 'mit', explanation: 'aufhören MIT + Dativ = to stop doing something.' },

  // ── sich vorbereiten ──
  { id: 'vp_20', verb: 'sich vorbereiten + ???', question: 'Hast du dich gut ___ die Prüfung vorbereitet?', options: ['auf', 'für', 'zu', 'an'], answer: 'auf', explanation: 'sich vorbereiten AUF + Akkusativ = to prepare for something.' },

  // ── sich gewöhnen ──
  { id: 'vp_21', verb: 'sich gewöhnen + ???', question: 'Es dauert immer eine Weile, bis man sich ___ eine neue Stadt gewöhnt.', options: ['an', 'auf', 'in', 'für'], answer: 'an', explanation: 'sich gewöhnen AN + Akkusativ = to get used to something.' },

  // ── sich verlieben ──
  { id: 'vp_22', verb: 'sich verlieben + ???', question: 'Er hat sich ___ seine Kollegin verliebt.', options: ['in', 'für', 'an', 'mit'], answer: 'in', explanation: 'sich verlieben IN + Akkusativ = to fall in love with someone.' },

  // ── einladen ──
  { id: 'vp_23', verb: 'einladen + ???', question: 'Wir möchten euch ___ unserer Hochzeit einladen.', options: ['zu', 'auf', 'für', 'an'], answer: 'zu', explanation: 'einladen ZU + Dativ = to invite someone to an event.' },

  // ── gratulieren ──
  { id: 'vp_24', verb: 'gratulieren + ???', question: 'Ich gratuliere dir herzlich ___ deinem Geburtstag!', options: ['zu', 'für', 'an', 'auf'], answer: 'zu', explanation: 'gratulieren + Dativ + ZU + Dativ = to congratulate someone on something.' },

  // ── bitten ──
  { id: 'vp_25', verb: 'bitten + ???', question: 'Darf ich dich ___ einen Gefallen bitten?', options: ['um', 'für', 'an', 'auf'], answer: 'um', explanation: 'bitten + Akkusativ + UM + Akkusativ = to ask someone for something.' },

  // ── sich bedanken ──
  { id: 'vp_26', verb: 'sich bedanken + ??? (der Grund)', question: 'Ich möchte mich ___ deine Hilfe bedanken.', options: ['für', 'um', 'von', 'über'], answer: 'für', explanation: 'sich bedanken FÜR + Akkusativ = to thank someone for something (the reason).' },
  { id: 'vp_27', verb: 'sich bedanken + ??? (die Person)', question: 'Hast du dich schon ___ deiner Gastfamilie bedankt?', options: ['bei', 'für', 'an', 'von'], answer: 'bei', explanation: 'sich bedanken BEI + Dativ = to thank someone (the person you address directly).' },

  // ── hoffen ──
  { id: 'vp_28', verb: 'hoffen + ???', question: 'Wir hoffen alle ___ besseres Wetter am Wochenende.', options: ['auf', 'für', 'an', 'um'], answer: 'auf', explanation: 'hoffen AUF + Akkusativ = to hope for something.' },

  // ── sich kümmern ──
  { id: 'vp_29', verb: 'sich kümmern + ???', question: 'Könntest du dich bitte ___ das Problem kümmern?', options: ['um', 'für', 'von', 'an'], answer: 'um', explanation: 'sich kümmern UM + Akkusativ = to take care of / deal with someone or something.' },

  // ── sich erholen ──
  { id: 'vp_30', verb: 'sich erholen + ???', question: 'Nach dem Urlaub hat sie sich gut ___ dem Stress erholt.', options: ['von', 'über', 'nach', 'für'], answer: 'von', explanation: 'sich erholen VON + Dativ = to recover / recuperate from something.' },

  // ── reagieren ──
  { id: 'vp_31', verb: 'reagieren + ???', question: 'Er hat nicht ___ meine E-Mail reagiert.', options: ['auf', 'an', 'über', 'von'], answer: 'auf', explanation: 'reagieren AUF + Akkusativ = to react / respond to something.' },

  // ── verzichten ──
  { id: 'vp_32', verb: 'verzichten + ???', question: 'Im neuen Jahr möchte ich ___ Süßigkeiten verzichten.', options: ['auf', 'von', 'für', 'mit'], answer: 'auf', explanation: 'verzichten AUF + Akkusativ = to give up / do without something.' },

  // ── sich bewerben ──
  { id: 'vp_33', verb: 'sich bewerben + ??? (die Stelle)', question: 'Sie hat sich ___ eine Stelle als Ingenieurin beworben.', options: ['um', 'für', 'auf', 'bei'], answer: 'um', explanation: 'sich bewerben UM + Akkusativ = to apply for a position (the role itself).' },
  { id: 'vp_34', verb: 'sich bewerben + ??? (das Unternehmen)', question: 'Ich habe mich ___ der Firma Bosch beworben.', options: ['bei', 'für', 'an', 'um'], answer: 'bei', explanation: 'sich bewerben BEI + Dativ = to apply at / to a company.' },

  // ── abhängen ──
  { id: 'vp_35', verb: 'abhängen + ???', question: 'Der Erfolg hängt ___ deiner Vorbereitung ab.', options: ['von', 'an', 'auf', 'für'], answer: 'von', explanation: 'abhängen VON + Dativ = to depend on something.' },

  // ── sich informieren ──
  { id: 'vp_36', verb: 'sich informieren + ???', question: 'Du solltest dich ___ die Öffnungszeiten informieren.', options: ['über', 'von', 'für', 'an'], answer: 'über', explanation: 'sich informieren ÜBER + Akkusativ = to find out about / inform yourself about something.' },

  // ── sich wundern ──
  { id: 'vp_37', verb: 'sich wundern + ???', question: 'Ich wundere mich ___ sein seltsames Verhalten.', options: ['über', 'an', 'auf', 'von'], answer: 'über', explanation: 'sich wundern ÜBER + Akkusativ = to be surprised / astonished about something.' },

  // ── zweifeln ──
  { id: 'vp_38', verb: 'zweifeln + ???', question: 'Zweifelst du etwa ___ meinem Wort?', options: ['an', 'auf', 'über', 'von'], answer: 'an', explanation: 'zweifeln AN + Dativ = to doubt someone or something.' },

  // ── sich entschuldigen ──
  { id: 'vp_39', verb: 'sich entschuldigen + ??? (die Person)', question: 'Er hat sich ___ seiner Mutter entschuldigt.', options: ['bei', 'für', 'an', 'über'], answer: 'bei', explanation: 'sich entschuldigen BEI + Dativ = to apologize to a person.' },
  { id: 'vp_40', verb: 'sich entschuldigen + ??? (der Grund)', question: 'Sie hat sich ___ die Verspätung entschuldigt.', options: ['für', 'bei', 'um', 'über'], answer: 'für', explanation: 'sich entschuldigen FÜR + Akkusativ = to apologize for something (the reason).' },

  // ── passen ──
  { id: 'vp_41', verb: 'passen + ???', question: 'Das blaue Hemd passt gut ___ deiner Hose.', options: ['zu', 'mit', 'für', 'an'], answer: 'zu', explanation: 'passen ZU + Dativ = to go well with / match something.' },

  // ── gehören ──
  { id: 'vp_42', verb: 'gehören + ???', question: 'Sport gehört ___ einem gesunden Lebensstil.', options: ['zu', 'für', 'an', 'auf'], answer: 'zu', explanation: 'gehören ZU + Dativ = to belong to / be part of something.' },

  // ── glauben ──
  { id: 'vp_43', verb: 'glauben + ???', question: 'Ich glaube noch ___ das Gute im Menschen.', options: ['an', 'für', 'in', 'auf'], answer: 'an', explanation: 'glauben AN + Akkusativ = to believe in something.' },

  // ── berichten ──
  { id: 'vp_44', verb: 'berichten + ???', question: 'Die Journalistin berichtet ___ die Lage in dem Krisengebiet.', options: ['über', 'von', 'an', 'für'], answer: 'über', explanation: 'berichten ÜBER + Akkusativ = to report on something in detail.' },

  // ── achten ──
  { id: 'vp_45', verb: 'achten + ???', question: 'Du solltest mehr ___ deine Gesundheit achten.', options: ['auf', 'an', 'für', 'über'], answer: 'auf', explanation: 'achten AUF + Akkusativ = to pay attention to / look after something.' },

  // ── sich verlassen ──
  { id: 'vp_46', verb: 'sich verlassen + ???', question: 'Ich verlasse mich ___ dich — enttäusch mich nicht!', options: ['auf', 'an', 'um', 'für'], answer: 'auf', explanation: 'sich verlassen AUF + Akkusativ = to rely / count on someone or something.' },

  // ── sich verstehen ──
  { id: 'vp_47', verb: 'sich verstehen + ???', question: 'Ich verstehe mich sehr gut ___ meiner neuen Kollegin.', options: ['mit', 'von', 'für', 'an'], answer: 'mit', explanation: 'sich verstehen MIT + Dativ = to get along with someone.' },

  // ── leiden ──
  { id: 'vp_48', verb: 'leiden + ??? (eine Krankheit)', question: 'Er leidet schon lange ___ Rückenschmerzen.', options: ['an', 'unter', 'von', 'für'], answer: 'an', explanation: 'leiden AN + Dativ = to suffer from a medical condition or illness.' },
  { id: 'vp_49', verb: 'leiden + ??? (eine Situation)', question: 'Die Kinder leiden sehr ___ dem Lärm der Baustelle.', options: ['unter', 'an', 'von', 'durch'], answer: 'unter', explanation: 'leiden UNTER + Dativ = to suffer under/from an external (social/environmental) situation.' },

  // ── sich beschäftigen ──
  { id: 'vp_50', verb: 'sich beschäftigen + ???', question: 'Er beschäftigt sich schon seit drei Jahren ___ diesem Thema.', options: ['mit', 'an', 'für', 'über'], answer: 'mit', explanation: 'sich beschäftigen MIT + Dativ = to deal with / be occupied with something.' },
]

// ─── Reference data — grouped by preposition ─────────────────────────────────

const VERB_GROUPS = [
  {
    preposition: 'auf',
    case: 'Akkusativ',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
    verbs: [
      { verb: 'achten auf', english: 'pay attention to / look after', example: 'Du solltest mehr auf deine Gesundheit achten.' },
      { verb: 'ankommen auf', english: 'depend on', example: 'Es kommt auf deine Vorbereitung an.' },
      { verb: 'aufpassen auf', english: 'look after / watch out for', example: 'Pass auf deinen kleinen Bruder auf!' },
      { verb: 'hoffen auf', english: 'hope for', example: 'Wir hoffen alle auf bessere Zeiten.' },
      { verb: 'reagieren auf', english: 'react / respond to', example: 'Er hat nicht auf meine E-Mail reagiert.' },
      { verb: 'sich bewerben auf', english: 'apply for (a specific post)', example: 'Sie bewirbt sich auf die freie Stelle.' },
      { verb: 'sich freuen auf', english: 'look forward to (future)', example: 'Ich freue mich auf deinen Besuch.' },
      { verb: 'sich konzentrieren auf', english: 'concentrate on', example: 'Ich muss mich auf die Prüfung konzentrieren.' },
      { verb: 'sich verlassen auf', english: 'rely / count on', example: 'Ich verlasse mich auf dich!' },
      { verb: 'sich vorbereiten auf', english: 'prepare for', example: 'Bereite dich gut auf die Prüfung vor.' },
      { verb: 'verzichten auf', english: 'give up / do without', example: 'Er verzichtet auf Alkohol.' },
      { verb: 'warten auf', english: 'wait for', example: 'Maria hat auf dich gewartet.' },
    ],
  },
  {
    preposition: 'an',
    case: 'Akkusativ',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    badge: 'bg-violet-100 text-violet-700',
    verbs: [
      { verb: 'denken an', english: 'think about / of', example: 'Ich denke jeden Tag an dich.' },
      { verb: 'glauben an', english: 'believe in', example: 'Glaubst du noch an das Gute im Menschen?' },
      { verb: 'sich erinnern an', english: 'remember', example: 'Erinnerst du dich an deine Schulzeit?' },
      { verb: 'sich gewöhnen an', english: 'get used to', example: 'Hast du dich an das neue Umfeld gewöhnt?' },
      { verb: 'schreiben an', english: 'write to', example: 'Ich schreibe Postkarten an alle Omas.' },
    ],
  },
  {
    preposition: 'an',
    case: 'Dativ',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    verbs: [
      { verb: 'arbeiten an', english: 'work on', example: 'Ich arbeite an einem wichtigen Projekt.' },
      { verb: 'leiden an', english: 'suffer from (medical)', example: 'Er leidet an einer schweren Krankheit.' },
      { verb: 'teilnehmen an', english: 'participate in', example: 'Ich nehme an einem Kurs teil.' },
      { verb: 'zweifeln an', english: 'doubt', example: 'Zweifelst du an meiner Loyalität?' },
    ],
  },
  {
    preposition: 'für',
    case: 'Akkusativ',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    verbs: [
      { verb: 'danken für / sich bedanken für', english: 'thank for', example: 'Ich danke dir für deine Hilfe.' },
      { verb: 'sich benutzen für', english: 'use for', example: 'Benutzt du das für deine Übungen?' },
      { verb: 'sich entscheiden für', english: 'decide in favor of', example: 'Sie hat sich für den Job entschieden.' },
      { verb: 'sich interessieren für', english: 'be interested in', example: 'Er interessiert sich für Mathematik.' },
      { verb: 'sich entschuldigen für', english: 'apologize for (reason)', example: 'Sie entschuldigt sich für die Verspätung.' },
    ],
  },
  {
    preposition: 'mit',
    case: 'Dativ',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    verbs: [
      { verb: 'anfangen / beginnen mit', english: 'start / begin with', example: 'Hast du mit den Hausaufgaben angefangen?' },
      { verb: 'aufhören mit', english: 'stop doing', example: 'Hör bitte mit dem Rauchen auf!' },
      { verb: 'sich beschäftigen mit', english: 'deal with / be occupied with', example: 'Er beschäftigt sich mit dem Thema.' },
      { verb: 'sich unterhalten mit', english: 'converse with', example: 'Alex unterhält sich mit seinem Chef.' },
      { verb: 'sich verabreden mit', english: 'arrange to meet with', example: 'Er hat sich mit Anna verabredet.' },
      { verb: 'sich verstehen mit', english: 'get along with', example: 'Bea versteht sich nicht mit ihrer Schwiegermutter.' },
      { verb: 'telefonieren mit', english: 'talk on the phone with', example: 'Ich telefoniere täglich mit meiner Mutter.' },
    ],
  },
  {
    preposition: 'über',
    case: 'Akkusativ',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
    verbs: [
      { verb: 'berichten über', english: 'report on', example: 'Sie berichtet über den Hurrikan.' },
      { verb: 'diskutieren / reden über', english: 'discuss / talk about', example: 'Wir diskutieren über die Wahl.' },
      { verb: 'nachdenken über', english: 'reflect on / think about', example: 'Ich denke über deinen Vorschlag nach.' },
      { verb: 'sich ärgern über', english: 'be annoyed about', example: 'Tom ärgert sich über seinen Bruder.' },
      { verb: 'sich beschweren über', english: 'complain about (reason)', example: 'Er beschwert sich über den Lärm.' },
      { verb: 'sich freuen über', english: 'be happy about (received)', example: 'Er freut sich über die bestandene Prüfung.' },
      { verb: 'sich informieren über', english: 'find out about', example: 'Ich informiere mich über die Nachrichten.' },
      { verb: 'sich wundern über', english: 'be surprised about', example: 'Ich wundere mich über sein Verhalten.' },
      { verb: 'sprechen über', english: 'talk about (discuss)', example: 'Die Politiker sprechen über die Krise.' },
    ],
  },
  {
    preposition: 'um',
    case: 'Akkusativ',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    verbs: [
      { verb: 'bitten um', english: 'ask for / request', example: 'Darf ich dich um einen Gefallen bitten?' },
      { verb: 'es geht um', english: 'it is about', example: 'Es geht mir nicht ums Geld!' },
      { verb: 'sich bewerben um', english: 'apply for (a position)', example: 'Er bewirbt sich um einen Ausbildungsplatz.' },
      { verb: 'sich kümmern um', english: 'take care of / deal with', example: 'Kannst du dich um deine Schwester kümmern?' },
    ],
  },
  {
    preposition: 'von',
    case: 'Dativ',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
    verbs: [
      { verb: 'abhängen von', english: 'depend on', example: 'Das hängt von vielen Faktoren ab.' },
      { verb: 'erzählen von', english: 'tell about', example: 'Hast du ihr von deinem Unfall erzählt?' },
      { verb: 'hören von', english: 'hear about', example: 'Hast du von dem Unfall gehört?' },
      { verb: 'sich erholen von', english: 'recover from', example: 'Kristine erholt sich von ihrem Stress.' },
      { verb: 'sprechen von', english: 'speak of / mention', example: 'Meine Mutter spricht oft von ihren Großeltern.' },
      { verb: 'träumen von', english: 'dream of', example: 'Ich träume von einer Reise nach Japan.' },
    ],
  },
  {
    preposition: 'zu',
    case: 'Dativ',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    verbs: [
      { verb: 'einladen zu', english: 'invite to', example: 'Hat Marcus dich zu seiner Party eingeladen?' },
      { verb: 'gehören zu', english: 'belong to / be part of', example: 'Sport gehört zu einem gesunden Leben.' },
      { verb: 'gratulieren zu', english: 'congratulate on', example: 'Ich gratuliere dir zum Geburtstag!' },
      { verb: 'passen zu', english: 'go well with / match', example: 'Das T-Shirt passt nicht zu seiner Hose.' },
      { verb: 'überreden zu', english: 'persuade to', example: 'Er hat mich zu diesem Urlaub überredet.' },
    ],
  },
  {
    preposition: 'bei',
    case: 'Dativ',
    color: 'bg-green-50 text-green-700 border-green-200',
    badge: 'bg-green-100 text-green-700',
    verbs: [
      { verb: 'helfen bei', english: 'help with', example: 'Hilfst du mir bei den Hausaufgaben?' },
      { verb: 'sich anmelden bei', english: 'register with / sign up at', example: 'Hast du dich bei einem Kurs angemeldet?' },
      { verb: 'sich bedanken bei', english: 'thank (the person)', example: 'Hast du dich bei Oma bedankt?' },
      { verb: 'sich beschweren bei', english: 'complain to (a person)', example: 'Sie hat sich beim Chef beschwert.' },
      { verb: 'sich bewerben bei', english: 'apply at (a company)', example: 'Er bewirbt sich bei Siemens.' },
      { verb: 'sich entschuldigen bei', english: 'apologize to (a person)', example: 'Hast du dich bei ihr entschuldigt?' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Verben() {
  const [tab, setTab] = useState('exercise')

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Verben mit Präpositionen</h1>
      <p className="text-base text-gray-400 mb-8">Fill-in-the-blank practice · A2 + B1 level</p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['exercise', 'Exercise'], ['reference', 'Reference List']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'exercise' ? <ExerciseTab /> : <ReferenceTab />}
    </div>
  )
}

// ─── Exercise tab ─────────────────────────────────────────────────────────────

function ExerciseTab() {
  const [questions, setQuestions] = useState(() => shuffle(EXERCISES))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[index]
  const isCorrect = selected === q?.answer
  const answered = selected !== null

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
    if (opt === q.answer) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setQuestions(shuffle(EXERCISES))
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
        <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? 'text-green-600' : 'text-amber-500'}`}>
          {score}/{questions.length}
        </div>
        <p className="text-gray-500 mb-1">{pct}% correct</p>
        <p className="text-sm text-gray-400 mb-8">
          {pct >= 90 ? 'Excellent! You have a strong command of verb + preposition.' :
           pct >= 70 ? 'Good work! Review the ones you missed in the Reference List.' :
           'Keep practicing! Use the Reference List to review the patterns.'}
        </p>
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all"
        >
          Try again (new shuffle)
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
        <span>Question {index + 1} of {questions.length}</span>
        <span>{score} correct</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${((index) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{q.verb}</span>
        </div>
        <div className="px-6 pt-6 pb-5">
          {/* Sentence */}
          <p className="text-lg text-gray-900 font-medium leading-relaxed mb-6">
            {q.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[3rem] mx-1 border-b-2 text-center font-bold ${
                    answered
                      ? isCorrect ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400'
                      : 'border-gray-400 text-transparent'
                  }`}>
                    {answered ? selected : '___'}
                  </span>
                )}
              </span>
            ))}
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {q.options.map(opt => {
              let style = 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              if (answered) {
                if (opt === q.answer) style = 'bg-green-50 text-green-700 border border-green-300 font-semibold'
                else if (opt === selected) style = 'bg-red-50 text-red-600 border border-red-300'
                else style = 'bg-gray-50 text-gray-400 border border-gray-100'
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                  className={`py-3 rounded-2xl text-base font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className={`rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? 'Correct' : `Correct answer: ${q.answer}`}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          <button
            onClick={answered ? handleNext : undefined}
            disabled={!answered}
            className={`w-full py-3.5 rounded-2xl text-base font-semibold transition-all ${
              answered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {index + 1 >= questions.length ? 'See results' : 'Next question'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Reference tab ────────────────────────────────────────────────────────────

function ReferenceTab() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500 mb-2">
        Tap a preposition to expand the verb list. The case shown is the case required by that verb–preposition pair.
      </p>
      {VERB_GROUPS.map((group, i) => {
        const key = `${group.preposition}-${group.case}`
        const isOpen = open === key
        return (
          <div key={key} className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`text-base font-bold px-3 py-1 rounded-xl border ${group.color}`}>
                  {group.preposition}
                </span>
                <span className="text-sm text-gray-500">+ {group.case}</span>
                <span className="text-xs text-gray-400">({group.verbs.length} verbs)</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100">
                {group.verbs.map((v, j) => (
                  <div key={j} className={`px-6 py-4 ${j < group.verbs.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{v.verb}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{v.english}</p>
                        <p className="text-xs text-gray-600 mt-1.5 italic leading-relaxed">{v.example}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
