import { useState, useMemo, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getTodayKey } from '../utils/srs'

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

  // ── sich fürchten ──
  { id: 'vp_51', verb: 'sich fürchten + ???', question: 'Als Kind fürchtete er sich sehr ___ großen Hunden.', options: ['vor', 'an', 'für', 'bei'], answer: 'vor', explanation: 'sich fürchten VOR + Dativ = to be afraid of something or someone. "vor" signals the source of fear.' },

  // ── warnen ──
  { id: 'vp_52', verb: 'warnen + ???', question: 'Der Arzt hat ihn ___ den Risiken der Operation gewarnt.', options: ['vor', 'über', 'gegen', 'von'], answer: 'vor', explanation: 'warnen VOR + Dativ = to warn someone about a danger or risk.' },

  // ── schützen ──
  { id: 'vp_53', verb: 'schützen + ???', question: 'Sonnencreme schützt deine Haut ___ schädlichen UV-Strahlen.', options: ['vor', 'gegen', 'von', 'für'], answer: 'vor', explanation: 'schützen VOR + Dativ = to protect something from a threat or harm.' },

  // ── Angst haben ──
  { id: 'vp_54', verb: 'Angst haben + ???', question: 'Hast du keine Angst ___ der Prüfung nächste Woche?', options: ['vor', 'für', 'an', 'von'], answer: 'vor', explanation: 'Angst haben VOR + Dativ = to be scared of / afraid of something.' },

  // ── retten ──
  { id: 'vp_55', verb: 'retten + ???', question: 'Die Ärztin hat ihn ___ dem Tod gerettet.', options: ['vor', 'aus', 'von', 'gegen'], answer: 'vor', explanation: 'retten VOR + Dativ = to save / rescue someone from a danger.' },

  // ── verstehen unter ──
  { id: 'vp_56', verb: 'verstehen + ??? (was bedeutet das?)', question: 'Was versteht man ___ dem Begriff "Nachhaltigkeit"?', options: ['unter', 'über', 'von', 'an'], answer: 'unter', explanation: 'verstehen UNTER + Dativ = to understand something by (a term) — i.e. what does a word or concept mean?' },

  // ── sich vorstellen unter ──
  { id: 'vp_57', verb: 'sich vorstellen + ??? (sich etwas denken)', question: 'Ich kann mir ___ diesem Fachbegriff leider nichts vorstellen.', options: ['unter', 'an', 'von', 'über'], answer: 'unter', explanation: 'sich (etwas) vorstellen UNTER + Dativ = to be able to picture or make sense of something.' },

  // ── sich unterhalten mit ──
  { id: 'vp_58', verb: 'sich unterhalten + ??? (die Person)', question: 'Ich habe mich gestern lange ___ meiner alten Freundin unterhalten.', options: ['mit', 'über', 'bei', 'von'], answer: 'mit', explanation: 'sich unterhalten MIT + Dativ = to have a conversation with someone (the person you are talking to).' },

  // ── sich unterhalten über ──
  { id: 'vp_59', verb: 'sich unterhalten + ??? (das Thema)', question: 'Wir haben uns ___ die aktuelle politische Lage unterhalten.', options: ['über', 'mit', 'von', 'an'], answer: 'über', explanation: 'sich unterhalten ÜBER + Akkusativ = to talk / chat about a topic.' },

  // ── sich verabreden ──
  { id: 'vp_60', verb: 'sich verabreden + ???', question: 'Hast du dich schon ___ deiner Freundin für Samstag verabredet?', options: ['mit', 'bei', 'zu', 'von'], answer: 'mit', explanation: 'sich verabreden MIT + Dativ = to arrange to meet with someone.' },

  // ── telefonieren ──
  { id: 'vp_61', verb: 'telefonieren + ???', question: 'Sie telefoniert jeden Abend ___ ihrer Schwester.', options: ['mit', 'bei', 'an', 'zu'], answer: 'mit', explanation: 'telefonieren MIT + Dativ = to be on the phone with someone.' },

  // ── erzählen von ──
  { id: 'vp_62', verb: 'erzählen + ??? (eine Geschichte)', question: 'Er hat uns stundenlang ___ seiner Reise durch Südamerika erzählt.', options: ['von', 'über', 'aus', 'an'], answer: 'von', explanation: 'erzählen VON + Dativ = to tell about / recount a personal story or experience. Compare: sprechen ÜBER (formal topic discussion).' },

  // ── hören von ──
  { id: 'vp_63', verb: 'hören + ??? (eine Neuigkeit)', question: 'Hast du schon ___ dem neuen Restaurant in der Innenstadt gehört?', options: ['von', 'über', 'an', 'für'], answer: 'von', explanation: 'hören VON + Dativ = to hear about something (a piece of news or information).' },

  // ── sprechen von ──
  { id: 'vp_64', verb: 'sprechen + ??? (etwas erwähnen)', question: 'Meine Oma spricht oft ___ ihren Kindheitserinnerungen.', options: ['von', 'über', 'aus', 'an'], answer: 'von', explanation: 'sprechen VON + Dativ = to speak of / mention something (often personal or nostalgic). Different from sprechen ÜBER (formal discussion of a topic).' },

  // ── überreden ──
  { id: 'vp_65', verb: 'überreden + ???', question: 'Mein Bruder hat mich ___ einem Kletterausflug überredet — ich bin kein Sportler!', options: ['zu', 'für', 'auf', 'bei'], answer: 'zu', explanation: 'überreden ZU + Dativ = to persuade / talk someone into doing something.' },

  // ── beitragen ──
  { id: 'vp_66', verb: 'beitragen + ???', question: 'Jeder kann ___ dem Klimaschutz beitragen, auch im Alltag.', options: ['zu', 'für', 'an', 'bei'], answer: 'zu', explanation: 'beitragen ZU + Dativ = to contribute to / help bring about something.' },

  // ── führen zu ──
  { id: 'vp_67', verb: 'führen + ??? (ein Ergebnis)', question: 'Zu wenig Schlaf kann ___ ernsthaften Gesundheitsproblemen führen.', options: ['zu', 'für', 'in', 'auf'], answer: 'zu', explanation: 'führen ZU + Dativ = to lead to / result in something.' },

  // ── arbeiten an ──
  { id: 'vp_68', verb: 'arbeiten + ???', question: 'Unsere Forschungsgruppe arbeitet seit zwei Jahren ___ einem neuen Impfstoff.', options: ['an', 'auf', 'für', 'bei'], answer: 'an', explanation: 'arbeiten AN + Dativ = to work on something (a project, task, or piece of creative or research work).' },

  // ── schreiben an ──
  { id: 'vp_69', verb: 'schreiben + ??? (an eine Person)', question: 'Sie hat einen langen Brief ___ ihren Vater geschrieben.', options: ['an', 'für', 'zu', 'bei'], answer: 'an', explanation: 'schreiben AN + Akkusativ = to write to someone (a letter directed at a person).' },

  // ── sich anmelden bei ──
  { id: 'vp_70', verb: 'sich anmelden + ???', question: 'Du musst dich ___ der Sprachschule anmelden, bevor du den Kurs buchen kannst.', options: ['bei', 'an', 'zu', 'auf'], answer: 'bei', explanation: 'sich anmelden BEI + Dativ = to register with / sign up at an institution or organisation.' },

  // ── sich erkundigen ──
  { id: 'vp_71', verb: 'sich erkundigen + ???', question: 'Ich habe mich ___ den Zugverbindungen nach Hamburg erkundigt.', options: ['nach', 'über', 'für', 'von'], answer: 'nach', explanation: 'sich erkundigen NACH + Dativ = to inquire about / ask for information about something specific.' },

  // ── suchen nach ──
  { id: 'vp_72', verb: 'suchen + ???', question: 'Die Firma sucht dringend ___ erfahrenen Mitarbeitern.', options: ['nach', 'für', 'um', 'auf'], answer: 'nach', explanation: 'suchen NACH + Dativ = to search for / look for someone or something.' },

  // ── riechen ──
  { id: 'vp_73', verb: 'riechen + ???', question: 'Es riecht hier ___ frischem Kaffee — habt ihr gerade eine Kanne gemacht?', options: ['nach', 'von', 'an', 'für'], answer: 'nach', explanation: 'riechen NACH + Dativ = to smell like / of something.' },

  // ── bestehen aus ──
  { id: 'vp_74', verb: 'bestehen + ??? (zusammengesetzt sein)', question: 'Die TELC-B1-Prüfung besteht ___ mehreren Teilen: Lesen, Hören, Schreiben und Sprechen.', options: ['aus', 'von', 'bei', 'mit'], answer: 'aus', explanation: 'bestehen AUS + Dativ = to consist of / be made up of something.' },

  // ── kommen aus ──
  { id: 'vp_75', verb: 'kommen + ??? (Herkunft)', question: 'Meine neue Kollegin kommt ursprünglich ___ dem Iran.', options: ['aus', 'von', 'bei', 'nach'], answer: 'aus', explanation: 'kommen AUS + Dativ = to come from a place of origin (country, city, or region).' },

  // ── diskutieren ──
  { id: 'vp_76', verb: 'diskutieren + ???', question: 'Die Politiker diskutieren schon seit Wochen ___ die geplante Steuerreform.', options: ['über', 'von', 'mit', 'an'], answer: 'über', explanation: 'diskutieren ÜBER + Akkusativ = to discuss / debate a topic.' },

  // ── sich sorgen ──
  { id: 'vp_77', verb: 'sich sorgen + ???', question: 'Sie sorgt sich sehr ___ die Gesundheit ihrer alten Mutter.', options: ['um', 'für', 'an', 'über'], answer: 'um', explanation: 'sich sorgen UM + Akkusativ = to worry about / be concerned about someone or something.' },

  // ── rechnen mit ──
  { id: 'vp_78', verb: 'rechnen + ??? (erwarten)', question: 'Ich hatte wirklich nicht ___ so vielen Schwierigkeiten gerechnet.', options: ['mit', 'auf', 'für', 'an'], answer: 'mit', explanation: 'rechnen MIT + Dativ = to count on / expect / reckon with something (often in negative or surprised contexts).' },

  // ── einverstanden sein ──
  { id: 'vp_79', verb: 'einverstanden sein + ???', question: 'Ich bin vollkommen ___ deinem Vorschlag einverstanden — lass uns das so machen!', options: ['mit', 'für', 'an', 'zu'], answer: 'mit', explanation: 'einverstanden sein MIT + Dativ = to agree with / be in agreement with something.' },

  // ── auffordern ──
  { id: 'vp_80', verb: 'auffordern + ???', question: 'Der Richter forderte den Zeugen ___ einer klaren Aussage auf.', options: ['zu', 'für', 'auf', 'an'], answer: 'zu', explanation: 'auffordern ZU + Dativ = to call on / urge someone to do something.' },

  // ── sich konzentrieren ──
  { id: 'vp_81', verb: 'sich konzentrieren + ???', question: 'Bei diesem Lärm kann ich mich überhaupt nicht ___ meine Arbeit konzentrieren.', options: ['auf', 'für', 'bei', 'in'], answer: 'auf', explanation: 'sich konzentrieren AUF + Akkusativ = to concentrate / focus on something.' },

  // ── aufpassen ──
  { id: 'vp_82', verb: 'aufpassen + ???', question: 'Pass ___ deine Tasche auf — hier gibt es viele Taschendiebe!', options: ['auf', 'für', 'an', 'bei'], answer: 'auf', explanation: 'aufpassen AUF + Akkusativ = to watch out for / keep an eye on someone or something.' },

  // ── ankommen auf ──
  { id: 'vp_83', verb: 'ankommen + ??? (es kommt ... an)', question: 'Bei einem Vorstellungsgespräch kommt es sehr ___ den ersten Eindruck an.', options: ['auf', 'an', 'bei', 'für'], answer: 'auf', explanation: 'ankommen AUF + Akkusativ (es kommt auf ... an) = it depends on / what really matters is something.' },

  // ── kämpfen um ──
  { id: 'vp_84', verb: 'kämpfen + ??? (etwas gewinnen wollen)', question: 'Die Mannschaft kämpfte bis zur letzten Minute ___ den Sieg.', options: ['um', 'für', 'gegen', 'auf'], answer: 'um', explanation: 'kämpfen UM + Akkusativ = to fight / compete for something you want to win or keep.' },

  // ── sich sehnen ──
  { id: 'vp_85', verb: 'sich sehnen + ???', question: 'Nach drei Monaten im Ausland sehnte er sich sehr ___ seiner Familie.', options: ['nach', 'von', 'zu', 'an'], answer: 'nach', explanation: 'sich sehnen NACH + Dativ = to long for / miss someone or something deeply.' },

  // ── zufrieden sein ──
  { id: 'vp_86', verb: 'zufrieden sein + ???', question: 'Bist du wirklich ___ deinen Prüfungsergebnissen zufrieden?', options: ['mit', 'von', 'für', 'an'], answer: 'mit', explanation: 'zufrieden sein MIT + Dativ = to be satisfied / happy with something.' },

  // ── überzeugen ──
  { id: 'vp_87', verb: 'überzeugen + ??? (jemanden von etwas)', question: 'Es ist schwer, ihn ___ einer anderen Meinung zu überzeugen.', options: ['von', 'für', 'über', 'mit'], answer: 'von', explanation: 'jemanden überzeugen VON + Dativ = to convince someone of something.' },

  // ── es handelt sich um ──
  { id: 'vp_88', verb: 'es handelt sich + ???', question: 'In diesem Bericht handelt es sich ___ ein ernstes gesellschaftliches Problem.', options: ['um', 'über', 'von', 'an'], answer: 'um', explanation: 'es handelt sich UM + Akkusativ = it is about / it concerns something (common in formal and written German).' },

  // ── sich orientieren an ──
  { id: 'vp_89', verb: 'sich orientieren + ???', question: 'Bei meiner Entscheidung orientiere ich mich ___ den Empfehlungen des Arztes.', options: ['an', 'nach', 'mit', 'bei'], answer: 'an', explanation: 'sich orientieren AN + Dativ = to orient oneself by / use something as a guide or reference point.' },

  // ── erinnern an (remind) ──
  { id: 'vp_90', verb: 'erinnern + ??? (jemanden erinnern)', question: 'Kannst du mich bitte ___ den Zahnarzttermin morgen erinnern?', options: ['an', 'auf', 'für', 'bei'], answer: 'an', explanation: 'jemanden erinnern AN + Akkusativ = to remind someone of something. (Different from "sich erinnern an" = to remember yourself.)' },

  // ── sich verlassen auf (new context) ──
  { id: 'vp_91', verb: 'sich verlassen + ??? (new situation)', question: 'In dieser Stadt kann man sich leider nicht ___ pünktliche Busse verlassen.', options: ['auf', 'von', 'an', 'bei'], answer: 'auf', explanation: 'sich verlassen AUF + Akkusativ = to rely on / count on something.' },

  // ── hängen an ──
  { id: 'vp_92', verb: 'hängen + ??? (emotional verbunden)', question: 'Sie hängt sehr ___ ihrem alten Familienauto — es gibt so viele Erinnerungen daran.', options: ['an', 'auf', 'in', 'bei'], answer: 'an', explanation: 'hängen AN + Dativ = to be emotionally attached to something or someone.' },

  // ── sich beteiligen ──
  { id: 'vp_93', verb: 'sich beteiligen + ???', question: 'Möchtest du dich ___ unserem neuen Schulprojekt beteiligen?', options: ['an', 'bei', 'für', 'mit'], answer: 'an', explanation: 'sich beteiligen AN + Dativ = to participate in / take part in something.' },

  // ── bestehen auf ──
  { id: 'vp_94', verb: 'bestehen + ??? (darauf beharren)', question: 'Sie besteht ___ einer schriftlichen Bestätigung — mündlich reicht ihr nicht.', options: ['auf', 'an', 'für', 'um'], answer: 'auf', explanation: 'bestehen AUF + Dativ = to insist on something.' },

  // ── sich entschließen ──
  { id: 'vp_95', verb: 'sich entschließen + ???', question: 'Nach langem Zögern hat er sich ___ einer Ausbildung als Elektriker entschlossen.', options: ['zu', 'für', 'auf', 'an'], answer: 'zu', explanation: 'sich entschließen ZU + Dativ = to make up one\'s mind / decide to do something.' },

  // ── protestieren ──
  { id: 'vp_96', verb: 'protestieren + ???', question: 'Tausende von Menschen haben ___ die geplante Abholzung des Waldes protestiert.', options: ['gegen', 'für', 'über', 'an'], answer: 'gegen', explanation: 'protestieren GEGEN + Akkusativ = to protest against something.' },

  // ── streben ──
  { id: 'vp_97', verb: 'streben + ???', question: 'Er strebt schon immer ___ einem besseren Leben für seine Familie.', options: ['nach', 'für', 'um', 'zu'], answer: 'nach', explanation: 'streben NACH + Dativ = to strive for / aspire to something.' },

  // ── sich freuen über (new context) ──
  { id: 'vp_98', verb: 'sich freuen + ??? (ein erhaltenes Ergebnis)', question: 'Er freute sich sehr ___ die bestandene Prüfung und feierte mit Freunden.', options: ['über', 'auf', 'für', 'an'], answer: 'über', explanation: 'sich freuen ÜBER + Akkusativ = happy about something that has already happened or been received.' },

  // ── neigen ──
  { id: 'vp_99', verb: 'neigen + ???', question: 'Er neigt manchmal ___ Übertreibungen — glaub nicht alles, was er erzählt.', options: ['zu', 'für', 'an', 'auf'], answer: 'zu', explanation: 'neigen ZU + Dativ = to tend toward / have a tendency for something.' },

  // ── ausgehen von ──
  { id: 'vp_100', verb: 'ausgehen + ??? (annehmen)', question: 'Ich gehe ___ einer schnellen Lösung des Problems aus.', options: ['von', 'auf', 'für', 'an'], answer: 'von', explanation: 'ausgehen VON + Dativ = to assume / proceed on the assumption that something is true.' },
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
  {
    preposition: 'vor',
    case: 'Dativ',
    color: 'bg-red-50 text-red-700 border-red-200',
    badge: 'bg-red-100 text-red-700',
    verbs: [
      { verb: 'sich fürchten vor', english: 'be afraid of', example: 'Sie fürchtet sich vor Spinnen.' },
      { verb: 'warnen vor', english: 'warn about', example: 'Er warnte mich vor der Gefahr.' },
      { verb: 'schützen vor', english: 'protect from', example: 'Die Jacke schützt dich vor dem Regen.' },
      { verb: 'Angst haben vor', english: 'be scared of', example: 'Hast du Angst vor der Prüfung?' },
      { verb: 'retten vor', english: 'save / rescue from', example: 'Der Feuerwehrmann hat ihn vor dem Feuer gerettet.' },
      { verb: 'sich verstecken vor', english: 'hide from', example: 'Das Kind versteckt sich vor dem Hund.' },
    ],
  },
  {
    preposition: 'unter',
    case: 'Dativ',
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    badge: 'bg-slate-100 text-slate-700',
    verbs: [
      { verb: 'leiden unter', english: 'suffer from / be troubled by', example: 'Er leidet sehr unter dem Stress.' },
      { verb: 'verstehen unter', english: 'understand / mean by', example: 'Was verstehst du unter "Freiheit"?' },
      { verb: 'sich vorstellen unter', english: 'imagine / picture by', example: 'Ich kann mir darunter nichts vorstellen.' },
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

// Pick `size` random questions and shuffle each question's options so the
// correct answer isn't always in the same position.
function buildSession(exercises, size) {
  return shuffle(exercises)
    .slice(0, size)
    .map(q => ({ ...q, options: shuffle(q.options) }))
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Verben() {
  const [tab, setTab] = useState('exercise')

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Verben mit Präpositionen</h1>
      <p className="text-base text-gray-400 mb-8">Fill-in-the-blank practice · A2 + B1 · 50 questions per session from a pool of {EXERCISES.length}</p>

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
  const { user } = useAuth()
  const SESSION_SIZE = 50
  const [questions, setQuestions] = useState(() => buildSession(EXERCISES, SESSION_SIZE))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done && user) {
      setDoc(
        doc(db, 'users', user.uid, 'sessions', getTodayKey()),
        { verben: { completed: true, completedAt: new Date().toISOString() } },
        { merge: true }
      ).catch(() => {})
    }
  }, [done, user])

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
    setQuestions(buildSession(EXERCISES, SESSION_SIZE))
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

const CASE_GUIDE = [
  {
    label: 'Always Dativ',
    labelColor: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
    chipBg: 'bg-teal-100 text-teal-700',
    prepositions: [
      { prep: 'aus', examples: 'bestehen aus, stammen aus' },
      { prep: 'bei', examples: 'helfen bei, sich bedanken bei, sich bewerben bei' },
      { prep: 'mit', examples: 'anfangen mit, aufhören mit, telefonieren mit' },
      { prep: 'nach', examples: 'fragen nach, riechen nach, suchen nach' },
      { prep: 'seit', examples: 'mostly temporal — seit einem Jahr warten' },
      { prep: 'von', examples: 'träumen von, abhängen von, sich erholen von' },
      { prep: 'zu', examples: 'gehören zu, gratulieren zu, einladen zu' },
      { prep: 'gegenüber', examples: 'sich verhalten gegenüber' },
      { prep: 'außer', examples: 'mostly standalone — außer mir, außer Betrieb' },
    ],
    tip: 'Memory trick: aus · bei · mit · nach · seit · von · zu → ABMN-SVZ',
  },
  {
    label: 'Always Akkusativ',
    labelColor: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
    chipBg: 'bg-indigo-100 text-indigo-700',
    prepositions: [
      { prep: 'durch', examples: 'mostly spatial — durch den Park gehen' },
      { prep: 'für', examples: 'sich interessieren für, danken für, sich entscheiden für' },
      { prep: 'gegen', examples: 'protestieren gegen, sich entscheiden gegen' },
      { prep: 'ohne', examples: 'mostly standalone — ohne Hilfe, ohne dich' },
      { prep: 'um', examples: 'bitten um, sich kümmern um, sich bewerben um' },
      { prep: 'bis', examples: 'mostly temporal/spatial — bis nächste Woche' },
    ],
    tip: 'Memory trick: durch · für · gegen · ohne · um → DFGOU',
  },
  {
    label: 'Wechselpräpositionen — Dativ or Akkusativ',
    labelColor: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    chipBg: 'bg-amber-100 text-amber-700',
    prepositions: [
      { prep: 'an', examples: null },
      { prep: 'auf', examples: null },
      { prep: 'hinter', examples: null },
      { prep: 'in', examples: null },
      { prep: 'neben', examples: null },
      { prep: 'über', examples: null },
      { prep: 'unter', examples: null },
      { prep: 'vor', examples: null },
      { prep: 'zwischen', examples: null },
    ],
    tip: null,
    wechselIntro: 'Standard rule: Dativ = location (Wo? — Das Buch liegt auf dem Tisch.) · Akkusativ = direction (Wohin? — Ich lege das Buch auf den Tisch.)\n\nIn fixed verb + preposition expressions, this location/direction rule does not apply — the verb decides the case.',
    wechsel: [
      {
        prep: 'auf',
        rows: [
          { case: 'Akkusativ', rule: 'almost always Akk in fixed expressions', verbs: 'warten auf, hoffen auf, sich freuen auf, achten auf, reagieren auf, sich vorbereiten auf' },
        ],
      },
      {
        prep: 'über',
        rows: [
          { case: 'Akkusativ', rule: 'almost always Akk in fixed expressions', verbs: 'sprechen über, nachdenken über, sich ärgern über, sich freuen über, sich informieren über' },
        ],
      },
      {
        prep: 'an',
        rows: [
          { case: 'Akkusativ', rule: 'figurative direction — toward someone/something', verbs: 'denken an, sich erinnern an, sich gewöhnen an, glauben an, schreiben an' },
          { case: 'Dativ', rule: 'fixed idiomatic pairs — verb dictates Dativ', verbs: 'teilnehmen an, arbeiten an, zweifeln an' },
        ],
      },
      {
        prep: 'in',
        rows: [
          { case: 'Akkusativ', rule: 'change of state / entering', verbs: 'sich verlieben in, sich einarbeiten in' },
          { case: 'Dativ', rule: 'fixed location sense or idiomatic', verbs: 'sich auskennen in, sich irren in' },
        ],
      },
      {
        prep: 'vor',
        rows: [
          { case: 'Dativ', rule: 'almost always Dat in fixed expressions (emotional distance / protection)', verbs: 'sich fürchten vor, warnen vor, schützen vor, Angst haben vor, retten vor' },
        ],
      },
      {
        prep: 'unter',
        rows: [
          { case: 'Dativ', rule: 'almost always Dat in fixed expressions', verbs: 'leiden unter, verstehen unter, sich vorstellen unter' },
        ],
      },
      {
        prep: 'hinter · neben · zwischen',
        rows: [
          { case: 'spatial only', rule: 'follow the standard Wo/Wohin rule — rarely appear in fixed verb expressions at B1', verbs: '' },
        ],
      },
    ],
  },
]

function ReferenceTab() {
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-4">

      {/* ── Case guide ── */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Which case does each preposition take?</p>
          <p className="text-xs text-gray-400 mt-0.5">With fixed verb + preposition expressions, the verb determines the case — but most prepositions always use the same one.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {CASE_GUIDE.map(group => (
            <div key={group.label} className="px-6 py-5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold mb-4 ${group.bg} ${group.labelColor}`}>
                {group.label}
              </div>

              {/* Preposition chips + examples */}
              {group.prepositions.every(p => !p.examples) ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.prepositions.map(({ prep }) => (
                    <span key={prep} className={`text-sm font-bold px-2.5 py-0.5 rounded-lg ${group.chipBg}`}>{prep}</span>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 mb-3">
                  {group.prepositions.map(({ prep, examples }) => (
                    <div key={prep} className="flex items-baseline gap-2 flex-wrap">
                      <span className={`text-sm font-bold px-2.5 py-0.5 rounded-lg flex-shrink-0 ${group.chipBg}`}>{prep}</span>
                      {examples && <span className="text-xs text-gray-500 leading-relaxed">{examples}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Tip text */}
              {group.tip && (
                <p className="text-xs text-gray-500 leading-relaxed">{group.tip}</p>
              )}

              {/* Wechselpräpositionen detail table */}
              {group.wechsel && (
                <div className="space-y-3 mt-1">
                  {group.wechselIntro && group.wechselIntro.split('\n\n').map((para, i) => (
                    <p key={i} className="text-xs text-gray-500 leading-relaxed">{para}</p>
                  ))}
                  <div className="space-y-3 pt-1">
                    {group.wechsel.map(({ prep, rows }) => (
                      <div key={prep} className="rounded-2xl overflow-hidden border border-amber-200">
                        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
                          <span className="text-sm font-bold text-amber-700">{prep}</span>
                        </div>
                        {rows.map((row, i) => (
                          <div key={i} className={`px-4 py-3 ${i < rows.length - 1 ? 'border-b border-amber-100' : ''}`}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${
                                row.case === 'Akkusativ' ? 'bg-indigo-100 text-indigo-700'
                                : row.case === 'Dativ' ? 'bg-teal-100 text-teal-700'
                                : 'bg-gray-100 text-gray-500'
                              }`}>
                                {row.case}
                              </span>
                              <span className="text-xs text-gray-500">{row.rule}</span>
                            </div>
                            {row.verbs && <p className="text-xs text-gray-600 italic mt-1">{row.verbs}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Verb groups ── */}
      <p className="text-xs text-gray-400 px-1">Tap a preposition below to see all verbs and example sentences.</p>
      {VERB_GROUPS.map((group) => {
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
                    <p className="text-sm font-bold text-gray-900">{v.verb}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.english}</p>
                    <p className="text-xs text-gray-600 mt-1.5 italic leading-relaxed">{v.example}</p>
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
