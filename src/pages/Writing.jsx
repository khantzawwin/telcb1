import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getTodayKey } from '../utils/srs'

// ─── Gemini setup ─────────────────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
  : null

// ─── Writing prompts — all in German, exam-style ──────────────────────────────

const PROMPTS = [
  // ── Förmlich ──────────────────────────────────────────────────────────────
  {
    id: 1, type: 'formal', format: 'E-Mail',
    title: 'Sprachkursanfrage',
    situation: 'Sie haben eine Anzeige für einen Deutschkurs an der Sprachschule Berliner Tor gesehen und möchten mehr Informationen. Schreiben Sie eine förmliche E-Mail an die Sprachschule.',
    addressee: 'die Sprachschule Berliner Tor',
    points: [
      'Stellen Sie sich kurz vor und erklären Sie, warum Sie schreiben.',
      'Fragen Sie nach dem Kursplan und der Kursdauer.',
      'Erkundigen Sie sich nach den Kursgebühren und möglichen Ermäßigungen.',
      'Fragen Sie, ob der Kurs für Lernende auf B1-Niveau geeignet ist.',
      'Bitten Sie um Informationen, wie und wann man sich anmelden kann.',
    ],
  },
  {
    id: 2, type: 'formal', format: 'Brief',
    title: 'Beschwerde — Hotel',
    situation: 'Sie haben letzte Woche im Hotel Seeblick übernachtet und waren sehr unzufrieden mit Ihrem Aufenthalt. Schreiben Sie einen förmlichen Beschwerdebrief an den Hotelmanager.',
    addressee: 'den Hotelmanager des Hotel Seeblick',
    points: [
      'Erklären Sie, wann Sie übernachtet haben und was Sie gebucht haben.',
      'Beschreiben Sie das erste Problem, das Sie erlebt haben (z. B. Zimmer nicht fertig, Lärm).',
      'Beschreiben Sie ein zweites Problem (z. B. Frühstücksqualität, Verhalten des Personals).',
      'Erklären Sie, wie diese Probleme Ihren Aufenthalt beeinträchtigt haben.',
      'Teilen Sie mit, welche Entschädigung Sie erwarten.',
    ],
  },
  {
    id: 3, type: 'formal', format: 'Brief',
    title: 'Bewerbung — Teilzeitstelle',
    situation: 'Sie haben eine Stellenanzeige für eine Teilzeitstelle als Büroassistentin / Büroassistent bei einem lokalen Unternehmen gesehen. Schreiben Sie ein förmliches Bewerbungsschreiben.',
    addressee: 'die Personalabteilung des Unternehmens',
    points: [
      'Teilen Sie mit, wo Sie die Anzeige gesehen haben und auf welche Stelle Sie sich bewerben.',
      'Stellen Sie kurz Ihren Bildungsweg vor.',
      'Beschreiben Sie Ihre relevante Berufserfahrung.',
      'Erklären Sie, warum Sie sich für dieses Unternehmen interessieren.',
      'Geben Sie Ihre Verfügbarkeit an und teilen Sie mit, wie man Sie erreichen kann.',
    ],
  },
  {
    id: 4, type: 'formal', format: 'E-Mail',
    title: 'Termin — Ausländerbehörde',
    situation: 'Ihre Aufenthaltserlaubnis läuft bald ab. Sie müssen einen Termin bei der Ausländerbehörde vereinbaren. Schreiben Sie eine förmliche E-Mail.',
    addressee: 'die Ausländerbehörde',
    points: [
      'Erklären Sie klar den Grund Ihrer E-Mail.',
      'Nennen Sie Ihre persönlichen Daten (Name, Geburtsdatum, Staatsangehörigkeit).',
      'Erklären Sie, wann Ihre aktuelle Erlaubnis abläuft.',
      'Bitten Sie um einen Termin und nennen Sie mögliche Wunschtermine.',
      'Fragen Sie, welche Unterlagen Sie zum Termin mitbringen müssen.',
    ],
  },
  {
    id: 5, type: 'formal', format: 'E-Mail',
    title: 'Rückgabe — Online-Shop',
    situation: 'Sie haben eine Jacke in einem Online-Shop bestellt, aber das falsche Produkt erhalten. Schreiben Sie eine förmliche Beschwerde und bitten Sie um eine Rückerstattung.',
    addressee: 'den Kundendienst von Modehaus Online',
    points: [
      'Nennen Sie Ihre Bestellnummer und das Kaufdatum.',
      'Beschreiben Sie genau, was Sie erhalten haben und was das Problem ist.',
      'Erklären Sie, dass Sie bereits versucht haben, das Problem zu lösen (z. B. Anruf beim Kundendienst).',
      'Bitten Sie um eine Rückerstattung oder die Lieferung des richtigen Produkts.',
      'Bitten Sie um eine Antwort innerhalb einer angemessenen Frist.',
    ],
  },
  {
    id: 6, type: 'formal', format: 'Brief',
    title: 'Heizungsproblem — Vermieter',
    situation: 'Die Heizung in Ihrer Mietwohnung funktioniert seit zwei Wochen im Winter nicht. Sie frieren. Schreiben Sie einen förmlichen Brief an Ihren Vermieter, Herrn Maier.',
    addressee: 'Ihren Vermieter, Herrn Maier',
    points: [
      'Beschreiben Sie das Problem und seit wann es besteht.',
      'Erklären Sie, wie das Problem Ihren Alltag beeinträchtigt.',
      'Erwähnen Sie, dass Sie das Problem bereits gemeldet haben (z. B. telefonisch).',
      'Bitten Sie darum, dass das Problem bis zu einem bestimmten Datum behoben wird.',
      'Bitten Sie um eine schriftliche Bestätigung der geplanten Reparatur.',
    ],
  },
  {
    id: 7, type: 'formal', format: 'Brief',
    title: 'Zugverspätung — Beschwerde',
    situation: 'Ihr Zug wurde storniert und Sie haben dadurch einen wichtigen Termin verpasst. Schreiben Sie eine förmliche Beschwerde an die Bahngesellschaft.',
    addressee: 'Deutsche Bahn Kundenservice',
    points: [
      'Nennen Sie das Datum, die Zugnummer und die betroffene Strecke.',
      'Beschreiben Sie, was passiert ist (Stornierung / lange Verspätung).',
      'Erklären Sie, welche Folgen Sie erlitten haben (verpasster Termin, zusätzliche Kosten).',
      'Erwähnen Sie, ob und wie Ihnen das Personal geholfen hat.',
      'Bitten Sie um eine Entschädigung gemäß den EU-Fahrgastrechten.',
    ],
  },
  {
    id: 8, type: 'formal', format: 'Brief',
    title: 'Krankenkasse — Anfrage',
    situation: 'Sie haben eine Rechnung für einen Arztbesuch erhalten, der Ihrer Meinung nach von Ihrer Krankenkasse übernommen werden sollte. Schreiben Sie einen förmlichen Brief an Ihre Krankenkasse.',
    addressee: 'Ihre Krankenkasse (AOK)',
    points: [
      'Erklären Sie, dass Sie eine unerwartete Rechnung erhalten haben.',
      'Nennen Sie das Datum und die Einzelheiten der medizinischen Behandlung.',
      'Geben Sie Ihre Versicherungsnummer und Ihren Versicherungsstatus an.',
      'Erklären Sie, warum Sie glauben, dass die Behandlung von der Kasse übernommen werden sollte.',
      'Bitten Sie um Klärung und darum, dass die Rechnung direkt beglichen wird.',
    ],
  },
  {
    id: 9, type: 'formal', format: 'E-Mail',
    title: 'Wohnungsanfrage',
    situation: 'Sie haben online eine Wohnung gesehen und sind interessiert. Schreiben Sie eine förmliche Anfrage an den Vermieter.',
    addressee: 'den Vermieter der angebotenen Wohnung',
    points: [
      'Stellen Sie sich kurz vor (Beruf, wie viele Personen einziehen würden).',
      'Fragen Sie nach der genauen Größe, dem Stockwerk und dem Zustand der Wohnung.',
      'Erkundigen Sie sich nach den monatlichen Gesamtkosten inklusive Nebenkosten.',
      'Fragen Sie, ob Haustiere erlaubt sind.',
      'Bitten Sie um einen Besichtigungstermin und nennen Sie Ihre Kontaktdaten.',
    ],
  },
  {
    id: 10, type: 'formal', format: 'Brief',
    title: 'Anwohnerparkausweis',
    situation: 'Sie sind kürzlich in einen neuen Stadtteil umgezogen und benötigen einen Anwohnerparkausweis für Ihr Auto. Schreiben Sie einen förmlichen Brief an das Straßenverkehrsamt.',
    addressee: 'das Straßenverkehrsamt',
    points: [
      'Nennen Sie Ihren Namen, Ihre neue Adresse und Ihr Fahrzeugkennzeichen.',
      'Erklären Sie, wann Sie in das Gebiet gezogen sind.',
      'Fragen Sie nach dem Verfahren und den Anforderungen für einen Parkausweis.',
      'Fragen Sie, wie lange der Ausweis gültig ist und was er kostet.',
      'Fragen Sie, wie lange das Antragsverfahren dauert.',
    ],
  },

  // ── Halbförmlich ──────────────────────────────────────────────────────────
  {
    id: 11, type: 'halbformal', format: 'E-Mail',
    title: 'Fehlende Prüfung — Lehrerin',
    situation: 'Sie waren krank und konnten letzte Woche nicht an Ihrer Deutschprüfung teilnehmen. Schreiben Sie eine E-Mail an Ihre Lehrerin, Frau Schmidt.',
    addressee: 'Ihre Deutschlehrerin, Frau Schmidt',
    points: [
      'Entschuldigen Sie sich für das Fehlen und erklären Sie, dass Sie krank waren.',
      'Erwähnen Sie, dass Sie ein ärztliches Attest haben.',
      'Fragen Sie, ob Sie die Prüfung zu einem späteren Zeitpunkt nachholen können.',
      'Erkundigen Sie sich, welchen Unterrichtsstoff Sie verpasst haben.',
      'Bedanken Sie sich für das Verständnis.',
    ],
  },
  {
    id: 12, type: 'halbformal', format: 'E-Mail',
    title: 'Arzttermin vereinbaren',
    situation: 'Sie möchten einen Arzt aufsuchen und einen Termin für eine Untersuchung vereinbaren. Schreiben Sie eine E-Mail an die Praxis von Dr. Müller.',
    addressee: 'die Arztpraxis von Dr. Müller',
    points: [
      'Stellen Sie sich vor und erklären Sie, dass Sie Patient / Patientin in der Praxis sind.',
      'Erklären Sie den Grund Ihres Besuchs (Routineuntersuchung, ein bestimmtes Symptom).',
      'Nennen Sie Tage oder Uhrzeiten, an denen Sie nicht können.',
      'Fragen Sie, ob in nächster Zeit ein Termin frei ist.',
      'Geben Sie Ihre Telefonnummer zur Terminbestätigung an.',
    ],
  },
  {
    id: 13, type: 'halbformal', format: 'E-Mail',
    title: 'Nachbar — Gemeinsamer Garten',
    situation: 'Sie und Ihr Nachbar, Herr Fischer, teilen sich einen Garten. Es gibt einen Streit über die Gartennutzung. Schreiben Sie eine höfliche E-Mail, um das Problem zu klären.',
    addressee: 'Ihren Nachbarn, Herrn Fischer',
    points: [
      'Begrüßen Sie ihn und erklären Sie den Zweck Ihrer E-Mail.',
      'Beschreiben Sie das Problem (z. B. Lärm, Müll, Nutzung des Platzes).',
      'Erkennen Sie an, dass es vielleicht ein Missverständnis gibt.',
      'Schlagen Sie eine faire Lösung oder einen Kompromiss vor.',
      'Schlagen Sie vor, das Problem persönlich bei einem Treffen zu besprechen.',
    ],
  },
  {
    id: 14, type: 'halbformal', format: 'E-Mail',
    title: 'Sportverein beitreten',
    situation: 'Sie möchten dem lokalen Fußballverein FC Grüntal beitreten. Schreiben Sie eine E-Mail an den Vereinssekretär.',
    addressee: 'den Sekretär des FC Grüntal',
    points: [
      'Stellen Sie sich vor und erklären Sie, dass Sie Mitglied werden möchten.',
      'Beschreiben Sie Ihre Spielerfahrung und Ihr aktuelles Fitnessniveau.',
      'Fragen Sie nach den Trainingszeiten und -orten.',
      'Erkundigen Sie sich nach dem Mitgliedsbeitrag und dem Anmeldeverfahren.',
      'Fragen Sie, ob es die Möglichkeit eines Schnuppertrainings gibt.',
    ],
  },
  {
    id: 15, type: 'halbformal', format: 'E-Mail',
    title: 'Stadtbibliothek — Mitgliedschaft',
    situation: 'Sie sind in eine neue Stadt gezogen und möchten Mitglied der Stadtbibliothek Grünau werden. Schreiben Sie eine Anfrage per E-Mail.',
    addressee: 'die Stadtbibliothek Grünau',
    points: [
      'Stellen Sie sich vor und erklären Sie, dass Sie kürzlich in die Stadt gezogen sind.',
      'Fragen Sie, welche Mitgliedschaftsarten es gibt und was sie kosten.',
      'Erkundigen Sie sich, welche Dienste angeboten werden (z. B. E-Books, Lernräume).',
      'Fragen Sie, ob man auch Medien in anderen Sprachen ausleihen kann.',
      'Fragen Sie, wie die Anmeldung funktioniert und ob man persönlich erscheinen muss.',
    ],
  },
  {
    id: 16, type: 'halbformal', format: 'E-Mail',
    title: 'Flexible Arbeitszeiten',
    situation: 'Sie müssen Ihre Arbeitszeiten vorübergehend ändern, da Sie eine familiäre Situation bewältigen müssen. Schreiben Sie eine E-Mail an Ihre Vorgesetzte, Frau Hoffmann.',
    addressee: 'Ihre Vorgesetzte, Frau Hoffmann',
    points: [
      'Erklären Sie höflich, dass Sie eine private Situation bewältigen müssen.',
      'Teilen Sie mit, welche Arbeitszeiten oder Tage Sie ändern möchten und für wie lange.',
      'Schlagen Sie vor, wie Ihre Aufgaben trotzdem pünktlich erledigt werden können.',
      'Bieten Sie Alternativen an (z. B. Homeoffice, Überstunden nachholen).',
      'Bedanken Sie sich für das Verständnis und bieten Sie ein persönliches Gespräch an.',
    ],
  },
  {
    id: 17, type: 'halbformal', format: 'E-Mail',
    title: 'Ehrenamt — Bürgerhaus',
    situation: 'Sie möchten sich im Bürgerhaus Westend ehrenamtlich engagieren. Schreiben Sie eine E-Mail, um Ihr Interesse zu bekunden.',
    addressee: 'die Koordinatorin / den Koordinator des Bürgerhaus Westend',
    points: [
      'Stellen Sie sich vor und erklären Sie Ihr Interesse am Ehrenamt.',
      'Beschreiben Sie Ihre relevanten Fähigkeiten oder bisherige Erfahrungen.',
      'Fragen Sie, welche ehrenamtlichen Tätigkeiten derzeit angeboten werden.',
      'Erkundigen Sie sich nach dem zeitlichen Aufwand pro Woche.',
      'Fragen Sie nach den nächsten Schritten, um mitmachen zu können.',
    ],
  },
  {
    id: 18, type: 'halbformal', format: 'E-Mail',
    title: 'Reparatur — Waschmaschine',
    situation: 'Die Waschmaschine in Ihrer Mietwohnung ist seit drei Tagen kaputt. Schreiben Sie eine E-Mail an Ihre Vermieterin, Frau Becker.',
    addressee: 'Ihre Vermieterin, Frau Becker',
    points: [
      'Beschreiben Sie das Problem und wann es angefangen hat.',
      'Erklären Sie, wie das Problem Ihren Alltag beeinträchtigt.',
      'Erwähnen Sie, ob Sie bereits versucht haben, das Problem selbst zu beheben.',
      'Bitten Sie darum, dass möglichst schnell ein Techniker geschickt wird.',
      'Bitten Sie um eine Bestätigung, wann die Reparatur stattfinden kann.',
    ],
  },
  {
    id: 19, type: 'halbformal', format: 'E-Mail',
    title: 'Stundenplanänderung — Sprachkurs',
    situation: 'Der Stundenplan Ihres Sprachkurses hat sich geändert und kollidiert jetzt mit Ihrer Arbeitszeit. Schreiben Sie eine E-Mail an die Kurskoordinatorin.',
    addressee: 'die Kurskoordinatorin Ihrer Sprachschule',
    points: [
      'Erklären Sie, dass der neue Stundenplan ein Problem für Sie ist.',
      'Beschreiben Sie den Konflikt (z. B. Arbeit, Kinderbetreuung).',
      'Fragen Sie, ob Sie in eine andere Gruppe oder zu einem anderen Zeitpunkt wechseln können.',
      'Fragen Sie, was mit den Unterrichtsstunden passiert, die Sie verpassen werden.',
      'Bitten Sie um eine schnelle Antwort, damit Sie Ihren Alltag planen können.',
    ],
  },
  {
    id: 20, type: 'halbformal', format: 'E-Mail',
    title: 'Abwesenheit Ihres Kindes',
    situation: 'Ihr Kind war drei Tage krank und konnte die Schule nicht besuchen. Schreiben Sie eine E-Mail an den Klassenlehrer, Herrn Weber.',
    addressee: 'den Klassenlehrer, Herrn Weber',
    points: [
      'Entschuldigen Sie das Fehlen Ihres Kindes und erklären Sie den Grund.',
      'Nennen Sie die genauen Fehlzeiten (Datum).',
      'Erwähnen Sie, dass Sie ein ärztliches Attest beifügen.',
      'Fragen Sie, welcher Unterrichtsstoff verpasst wurde und wie Ihr Kind aufholen kann.',
      'Bedanken Sie sich für die Unterstützung des Lehrers.',
    ],
  },

  // ── Informell ─────────────────────────────────────────────────────────────
  {
    id: 21, type: 'informal', format: 'Brief',
    title: 'Neue Wohnung',
    situation: 'Sie sind kürzlich in eine neue Wohnung umgezogen. Schreiben Sie einen Brief an Ihre Freundin Lena und erzählen Sie ihr davon.',
    addressee: 'Ihre Freundin Lena',
    points: [
      'Beschreiben Sie die Wohnung (Größe, Lage, was Ihnen gefällt).',
      'Erzählen Sie vom Umzug — war er schwierig oder stressig?',
      'Berichten Sie etwas über Ihre neue Nachbarschaft.',
      'Laden Sie Lena ein zu Besuch und beschreiben Sie, was ihr zusammen unternehmen könntet.',
      'Fragen Sie, wie es Lena geht und was es Neues bei ihr gibt.',
    ],
  },
  {
    id: 22, type: 'informal', format: 'Brief',
    title: 'Urlaubspläne',
    situation: 'Sie planen einen Urlaub und möchten Ihren Cousin Erik einladen, mitzukommen. Schreiben Sie ihm einen Brief.',
    addressee: 'Ihren Cousin Erik',
    points: [
      'Erzählen Sie ihm, wohin Sie fahren möchten und wann.',
      'Erklären Sie, warum Sie dieses Reiseziel gewählt haben.',
      'Beschreiben Sie, was Sie dort unternehmen möchten.',
      'Fragen Sie, ob er mitkommen kann, und nennen Sie einen Termin für seine Entscheidung.',
      'Nennen Sie die ungefähren Kosten und bitten Sie ihn, bald zu bestätigen.',
    ],
  },
  {
    id: 23, type: 'informal', format: 'Brief',
    title: 'Einladung zum Geburtstag',
    situation: 'Sie feiern bald Geburtstag und möchten Ihre Freundin Mia einladen. Schreiben Sie ihr einen Brief.',
    addressee: 'Ihre Freundin Mia',
    points: [
      'Erzählen Sie ihr von der Feier (Datum, Uhrzeit, Ort).',
      'Beschreiben Sie die Art der Feier (z. B. Abendessen, Grillen im Freien).',
      'Sagen Sie, wer noch eingeladen ist.',
      'Sagen Sie, ob sie etwas mitbringen soll (Essen, ein Getränk, ein Geschenk usw.).',
      'Bitten Sie sie, bis zu einem bestimmten Datum zu bestätigen, ob sie kommen kann.',
    ],
  },
  {
    id: 24, type: 'informal', format: 'Brief',
    title: 'Neue Arbeitsstelle',
    situation: 'Sie haben kürzlich eine neue Stelle angetreten. Schreiben Sie Ihrem Freund Max einen Brief und erzählen Sie ihm davon.',
    addressee: 'Ihren Freund Max',
    points: [
      'Beschreiben Sie Ihren neuen Arbeitsplatz und was Sie dort machen.',
      'Erzählen Sie, was Ihnen an der neuen Stelle am besten gefällt.',
      'Erwähnen Sie eine Schwierigkeit oder Herausforderung, auf die Sie gestoßen sind.',
      'Vergleichen Sie die neue Stelle mit Ihrer früheren Arbeit.',
      'Fragen Sie Max, wie es ihm bei der Arbeit geht und was er so macht.',
    ],
  },
  {
    id: 25, type: 'informal', format: 'Brief',
    title: 'Deutsch lernen',
    situation: 'Sie lernen seit einigen Monaten Deutsch und machen gute Fortschritte. Schreiben Sie Ihrer Freundin Sofia einen Brief über Ihre Erfahrungen.',
    addressee: 'Ihre Freundin Sofia',
    points: [
      'Erklären Sie, warum Sie angefangen haben, Deutsch zu lernen.',
      'Beschreiben Sie, wie Sie lernen (Kurse, Apps, Lesen, Gespräche usw.).',
      'Erzählen Sie, was Sie am schwierigsten finden.',
      'Teilen Sie einen lustigen oder peinlichen Sprachfehler mit, den Sie gemacht haben.',
      'Fragen Sie, ob Sofia auch eine Fremdsprache lernen möchte und welche.',
    ],
  },
  {
    id: 26, type: 'informal', format: 'Brief',
    title: 'Stadtempfehlung — Leipzig',
    situation: 'Sie haben letzten Monat Leipzig besucht und waren begeistert. Schreiben Sie Ihrem Freund Ben und empfehlen Sie ihm, die Stadt zu besuchen.',
    addressee: 'Ihren Freund Ben',
    points: [
      'Erklären Sie, wann und warum Sie in Leipzig waren.',
      'Beschreiben Sie, was Ihnen an der Stadt am besten gefallen hat.',
      'Empfehlen Sie mindestens zwei Sehenswürdigkeiten oder Aktivitäten.',
      'Geben Sie praktische Tipps (Unterkunft, Verkehr, beste Reisezeit).',
      'Schlagen Sie vor, die Stadt eines Tages gemeinsam zu besuchen.',
    ],
  },
  {
    id: 27, type: 'informal', format: 'Brief',
    title: 'Problem mit Mitbewohner',
    situation: 'Sie haben ein Problem mit Ihrem Mitbewohner und brauchen den Rat Ihrer Freundin Anna. Schreiben Sie ihr einen Brief.',
    addressee: 'Ihre Freundin Anna',
    points: [
      'Beschreiben Sie kurz die Wohnsituation (WG, wie lange Sie zusammenwohnen).',
      'Erklären Sie, was das Problem ist.',
      'Sagen Sie, wie das Problem Ihren Alltag beeinflusst.',
      'Beschreiben Sie, was Sie bereits versucht haben, um es zu lösen.',
      'Bitten Sie Anna um ihren Rat und ihre Meinung.',
    ],
  },
  {
    id: 28, type: 'informal', format: 'Brief',
    title: 'Wochenendpläne',
    situation: 'Sie planen ein interessantes Wochenende und möchten Ihren Freund Jonas einladen, mitzumachen. Schreiben Sie ihm einen Brief.',
    addressee: 'Ihren Freund Jonas',
    points: [
      'Erklären Sie, was Sie an dem Wochenende planen.',
      'Sagen Sie, warum Sie diese Aktivitäten ausgewählt haben.',
      'Fragen Sie Jonas, ob er mitkommen möchte.',
      'Geben Sie die praktischen Details an (wann, wo man sich trifft, was man mitbringen soll).',
      'Fragen Sie, ob er Vorschläge oder Wünsche hat.',
    ],
  },
  {
    id: 29, type: 'informal', format: 'Brief',
    title: 'Neues Hobby',
    situation: 'Sie haben kürzlich ein neues Hobby begonnen und sind sehr begeistert davon. Schreiben Sie Ihrer Freundin Clara einen Brief und erzählen Sie ihr davon.',
    addressee: 'Ihre Freundin Clara',
    points: [
      'Stellen Sie das Hobby vor und erklären Sie, wie Sie es entdeckt haben.',
      'Beschreiben Sie, was Ihnen daran am meisten Spaß macht.',
      'Erzählen Sie, wie viel Zeit und Geld Sie dafür aufwenden.',
      'Erwähnen Sie, ob Sie durch dieses Hobby neue Leute kennengelernt haben.',
      'Fragen Sie Clara, ob sie ein Hobby hat, das ihr besonders am Herzen liegt.',
    ],
  },
  {
    id: 30, type: 'informal', format: 'Brief',
    title: 'Alltag in Deutschland',
    situation: 'Ihre Brieffreundin Ana aus Spanien hat Sie nach Ihrem Alltag in Deutschland gefragt. Schreiben Sie ihr zurück.',
    addressee: 'Ihre Brieffreundin Ana',
    points: [
      'Beschreiben Sie Ihren typischen Alltag (Arbeit / Studium, Tagesroutine).',
      'Erzählen Sie ihr von etwas Typisch-Deutschem, das Sie überrascht oder beeindruckt hat.',
      'Beschreiben Sie Ihre Wohngegend und wie es dort ist.',
      'Erzählen Sie, was Ihnen an Ihrer Heimat fehlt — oder was Ihnen an Deutschland besonders gut gefällt.',
      'Stellen Sie Ana Fragen über ihren eigenen Alltag, um das Gespräch weiterzuführen.',
    ],
  },
]

// ─── Gemini evaluation ────────────────────────────────────────────────────────

async function evaluateWithGemini(prompt, userText) {
  if (!GEMINI_URL) throw new Error('no_api_key')

  const typeLabel = prompt.type === 'formal' ? 'förmlich' : prompt.type === 'informal' ? 'informell' : 'halbförmlich'

  const systemPrompt = `You are an official TELC B1 German exam examiner. Evaluate the student's letter strictly using the TELC B1 Schreiben Teil 1 marking scheme (45 points total).

WRITING TASK (as it appeared on the exam):
Register: ${typeLabel} (${prompt.format})
Situation: ${prompt.situation}
Addressee: ${prompt.addressee}

Required content points (student must address all 5):
${prompt.points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

STUDENT'S RESPONSE:
${userText}

SCORING GUIDE:
1. INHALT (Content) — 15 points: Score each of the 5 content points 0–3 (3=fully addressed, 2=partially, 1=barely, 0=missing).
2. KOMMUNIKATIVE GESTALTUNG (Communication) — 15 points: Rate salutation (0–3), structure (0–3), register consistency (0–3), connectors (0–3), clarity (0–3).
3. FORMALE RICHTIGKEIT (Accuracy) — 15 points: Rate grammar (0–5), vocabulary (0–5), spelling/punctuation (0–5).

Return ONLY valid JSON exactly like this (no markdown, no extra text):
{
  "inhalt": {
    "score": <0-15>,
    "points": [
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence in English>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence in English>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence in English>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence in English>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence in English>"}
    ]
  },
  "kommunikation": {
    "score": <0-15>,
    "salutation": <0-3>,
    "structure": <0-3>,
    "register": <0-3>,
    "connectors": <0-3>,
    "clarity": <0-3>,
    "feedback": "<2-3 sentences in English>"
  },
  "genauigkeit": {
    "score": <0-15>,
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "spelling": <0-5>,
    "errors": ["<correction or tip in English>"],
    "feedback": "<2-3 sentences in English>"
  },
  "total": <0-45>,
  "level": "<A2|B1-|B1|B1+|B2>",
  "summary": "<2-3 encouraging sentences in English>"
}`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1800 },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const jsonStr = raw.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(jsonStr)
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Writing() {
  const { user } = useAuth()
  const [tab, setTab] = useState('practice')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [loadingPrev, setLoadingPrev] = useState(true)

  const todayKey = getTodayKey()
  const todayPrompt = PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length]
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid, 'writing', todayKey))
      .then(snap => {
        if (snap.exists()) {
          const d = snap.data()
          setText(d.text || '')
          setFeedback(d.result || null)
        }
      })
      .finally(() => setLoadingPrev(false))
  }, [user, todayKey])

  const handleSubmit = async () => {
    if (!text.trim() || wordCount < 30) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await evaluateWithGemini(todayPrompt, text)
      setFeedback(result)
      await setDoc(doc(db, 'users', user.uid, 'writing', todayKey), {
        promptId: todayPrompt.id,
        promptTitle: todayPrompt.title,
        text,
        result,
        submittedAt: new Date().toISOString(),
      })
    } catch (e) {
      setError(e.message === 'no_api_key' ? 'api_key' : e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingPrev) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Schreiben</h1>
      <p className="text-base text-gray-400 mb-8">TELC B1 Writing Practice</p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['practice', 'Daily Practice'], ['tips', 'Writing Tips']].map(([key, label]) => (
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

      {tab === 'practice' ? (
        <PracticeTab
          prompt={todayPrompt}
          text={text}
          setText={setText}
          wordCount={wordCount}
          submitting={submitting}
          feedback={feedback}
          error={error}
          onSubmit={handleSubmit}
          onReset={() => { setFeedback(null); setText('') }}
        />
      ) : (
        <TipsTab />
      )}
    </div>
  )
}

// ─── Practice tab ─────────────────────────────────────────────────────────────

function PracticeTab({ prompt, text, setText, wordCount, submitting, feedback, error, onSubmit, onReset }) {
  const TYPE_COLOR = {
    formal:     'bg-indigo-100 text-indigo-700',
    halbformal: 'bg-amber-100 text-amber-700',
    informal:   'bg-green-100 text-green-700',
  }
  const TYPE_LABEL = {
    formal: 'Förmlich', halbformal: 'Halbförmlich', informal: 'Informell',
  }
  const wordOk = wordCount >= 80 && wordCount <= 150
  const wordLow = wordCount > 0 && wordCount < 80

  return (
    <div className="space-y-5">
      {/* Exam-style prompt card */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">TELC B1 · Schreiben · Teil 1</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${TYPE_COLOR[prompt.type]}`}>
            {TYPE_LABEL[prompt.type]}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-5">
          {/* Situation */}
          <p className="text-base text-gray-800 leading-relaxed mb-6">{prompt.situation}</p>

          {/* Points */}
          <p className="text-sm font-semibold text-gray-500 mb-3">Schreiben Sie zu folgenden Punkten:</p>
          <ul className="space-y-2.5 mb-6">
            {prompt.points.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-gray-400 font-medium mt-0.5 select-none flex-shrink-0">–</span>
                <span className="text-base text-gray-800 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          {/* Footer instruction */}
          <div className="border-t border-dashed border-gray-200 pt-4 flex flex-wrap gap-x-6 gap-y-1">
            <p className="text-sm text-gray-500">
              Schreiben Sie <strong className="text-gray-700">etwa 80 Wörter</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Schreiben Sie {prompt.type === 'informal' ? 'einen Brief' : `eine ${TYPE_LABEL[prompt.type].toLowerCase().replace('halbförmlich', 'halbförmliche').replace('förmlich', 'förmliche')} ${prompt.format}`} an: <strong className="text-gray-700">{prompt.addressee}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Answer area or feedback */}
      {!feedback ? (
        <>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Letter</span>
              <span className={`text-xs font-semibold tabular-nums ${
                wordOk ? 'text-green-600' : wordLow ? 'text-amber-500' : wordCount > 150 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {wordCount} words {wordOk ? '✓' : wordCount > 0 ? '(aim for 80–150)' : ''}
              </span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Begin your ${prompt.type === 'formal' ? 'formal' : prompt.type === 'informal' ? 'informal' : 'semi-formal'} letter here…\n\nRemember to include an appropriate greeting and closing.`}
              className="w-full px-5 py-4 text-base text-gray-900 leading-relaxed resize-none focus:outline-none min-h-[280px]"
            />
          </div>

          {error === 'api_key' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
              <strong>API key missing.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file and rebuild.
            </div>
          )}
          {error && error !== 'api_key' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
              Gemini error: {error}. Please try again.
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={wordCount < 30 || submitting || !GEMINI_API_KEY}
            className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gemini is evaluating…
              </>
            ) : 'Submit for AI Feedback'}
          </button>
        </>
      ) : (
        <FeedbackPanel feedback={feedback} onReset={onReset} text={text} />
      )}
    </div>
  )
}

// ─── Feedback panel ───────────────────────────────────────────────────────────

function FeedbackPanel({ feedback, onReset, text }) {
  const { inhalt, kommunikation, genauigkeit, total, level, summary } = feedback
  const pct = Math.round((total / 45) * 100)
  const grade = total >= 36 ? 'Passed ✓' : total >= 27 ? 'Close' : 'Not passed'

  return (
    <div className="space-y-5">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">Total Score</p>
            <p className="text-5xl font-bold">{total}<span className="text-2xl text-indigo-300 font-normal"> / 45</span></p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${total >= 36 ? 'text-green-300' : total >= 27 ? 'text-amber-300' : 'text-red-300'}`}>{grade}</p>
            <p className="text-indigo-200 text-sm mt-1">Level: {level}</p>
          </div>
        </div>
        <div className="bg-indigo-500 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-indigo-200 text-xs mt-2">{pct}% — Pass mark is 80% (36/45)</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ScorePillar label="Inhalt" score={inhalt.score} max={15} color="indigo" />
        <ScorePillar label="Kommunikation" score={kommunikation.score} max={15} color="amber" />
        <ScorePillar label="Genauigkeit" score={genauigkeit.score} max={15} color="green" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Inhalt — Content Points</h3>
        <div className="space-y-3">
          {inhalt.points.map((p, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
                p.score === 3 ? 'bg-green-100 text-green-700' :
                p.score === 2 ? 'bg-amber-100 text-amber-700' :
                p.score === 1 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'
              }`}>{p.score}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">{p.point}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Kommunikative Gestaltung</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {[
            ['Greeting', kommunikation.salutation, 3],
            ['Structure', kommunikation.structure, 3],
            ['Register', kommunikation.register, 3],
            ['Connectors', kommunikation.connectors, 3],
            ['Clarity', kommunikation.clarity, 3],
          ].map(([label, score, max]) => (
            <div key={label} className="text-center bg-slate-50 rounded-2xl py-3 px-2">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-900">{score}<span className="text-xs text-gray-400">/{max}</span></p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{kommunikation.feedback}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Formale Richtigkeit — Accuracy</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            ['Grammar', genauigkeit.grammar, 5],
            ['Vocabulary', genauigkeit.vocabulary, 5],
            ['Spelling', genauigkeit.spelling, 5],
          ].map(([label, score, max]) => (
            <div key={label} className="text-center bg-slate-50 rounded-2xl py-3">
              <p className="text-xs text-gray-400 mb-1 leading-tight">{label}</p>
              <p className="text-lg font-bold text-gray-900">{score}<span className="text-xs text-gray-400">/{max}</span></p>
            </div>
          ))}
        </div>
        {genauigkeit.errors?.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {genauigkeit.errors.map((e, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>{e}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-gray-700 leading-relaxed">{genauigkeit.feedback}</p>
      </div>

      <div className="bg-green-50 rounded-3xl p-5">
        <p className="text-sm font-bold text-green-700 mb-1">Overall Feedback</p>
        <p className="text-sm text-green-800 leading-relaxed">{summary}</p>
      </div>

      <details className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-gray-500 hover:bg-slate-50 list-none flex items-center justify-between">
          <span>Your submitted letter</span>
          <span className="text-gray-400 text-xs">▼</span>
        </summary>
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-4">{text}</p>
        </div>
      </details>

      <button
        onClick={onReset}
        className="w-full py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:border-indigo-300 hover:text-indigo-600 active:scale-[0.98] transition-all text-base"
      >
        Try again with a new letter
      </button>
    </div>
  )
}

function ScorePillar({ label, score, max, color }) {
  const colors = { indigo: 'bg-indigo-50 text-indigo-700', amber: 'bg-amber-50 text-amber-700', green: 'bg-green-50 text-green-700' }
  return (
    <div className={`${colors[color]} rounded-2xl p-4 text-center`}>
      <p className="text-xs font-semibold opacity-70 mb-1 leading-tight">{label}</p>
      <p className="text-3xl font-bold">{score}</p>
      <p className="text-xs opacity-60">/ {max}</p>
    </div>
  )
}

// ─── Tips tab ─────────────────────────────────────────────────────────────────

function TipsTab() {
  return (
    <div className="space-y-5">

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">TELC B1 Schreiben — Scoring (45 pts)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Inhalt', pts: '15', desc: '5 content points × 3 pts each. Address every bullet point clearly.' },
            { label: 'Kommunikation', pts: '15', desc: 'Greeting, structure, register, connectors, clarity — 3 pts each.' },
            { label: 'Genauigkeit', pts: '15', desc: 'Grammar 5 pts, Vocabulary 5 pts, Spelling & Punctuation 5 pts.' },
          ].map(c => (
            <div key={c.label} className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-gray-900">{c.label}</span>
                <span className="text-indigo-600 font-bold text-lg">{c.pts}</span>
                <span className="text-gray-400 text-xs">Pt.</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Pass mark: <strong className="text-gray-600">36 / 45 (80%)</strong>. Writing time: ~30 minutes. Aim for 80–150 words.</p>
      </div>

      {[
        {
          type: 'Förmlich', badge: 'bg-indigo-100 text-indigo-700',
          when: 'Authorities (Ämter), companies, hotels, unknown persons, job applications.',
          salutation: ['Sehr geehrte Damen und Herren,', 'Sehr geehrter Herr [Name],', 'Sehr geehrte Frau [Name],'],
          closing: ['Mit freundlichen Grüßen,', 'Mit freundlichem Gruß,'],
          pronoun: 'Sie (immer)',
          phrases: [
            'Ich schreibe Ihnen bezüglich …',
            'Hiermit möchte ich mich für … bewerben.',
            'Könnten Sie mir bitte … mitteilen?',
            'Ich würde gern wissen, ob …',
            'Vielen Dank für Ihre Mühe.',
            'Ich freue mich auf Ihre Antwort.',
          ],
          avoid: 'Casual language, du-form, exclamation marks for requests.',
        },
        {
          type: 'Halbförmlich', badge: 'bg-amber-100 text-amber-700',
          when: 'Teachers, doctors, neighbours, employers you know, club coordinators.',
          salutation: ['Guten Tag, Frau [Name],', 'Liebe Frau [Name],', 'Lieber Herr [Name],'],
          closing: ['Herzliche Grüße,', 'Viele Grüße,', 'Mit freundlichen Grüßen,'],
          pronoun: 'Sie (still formal — only switch to du if invited)',
          phrases: [
            'Ich hoffe, es geht Ihnen gut.',
            'Ich wollte Sie kurz fragen, ob …',
            'Ich wäre Ihnen sehr dankbar, wenn …',
            'Könnten Sie mir bitte … schicken?',
            'Danke im Voraus für Ihre Hilfe.',
            'Ich freue mich auf Ihre Rückmeldung.',
          ],
          avoid: 'Overly stiff phrases; overly casual slang.',
        },
        {
          type: 'Informell', badge: 'bg-green-100 text-green-700',
          when: 'Friends, family, pen pals, flatmates.',
          salutation: ['Liebe / Lieber [Name],', 'Hallo [Name],', 'Hey [Name],'],
          closing: ['Liebe Grüße,', 'Viele Grüße,', 'Bis bald,', 'Tschüss,'],
          pronoun: 'du / ihr',
          phrases: [
            'Wie geht es dir?',
            'Stell dir vor, …!',
            'Ich wollte dir schnell schreiben, weil …',
            'Was hältst du davon?',
            'Es wäre super, wenn du …',
            'Ich freue mich schon riesig darauf!',
          ],
          avoid: 'Overly formal phrases; Sie-form with friends.',
        },
      ].map(lt => (
        <div key={lt.type} className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lt.badge}`}>{lt.type}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4"><strong>When:</strong> {lt.when}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Salutation</p>
              {lt.salutation.map(s => <p key={s} className="text-sm text-gray-700 font-medium italic mb-0.5">{s}</p>)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Closing</p>
              {lt.closing.map(s => <p key={s} className="text-sm text-gray-700 font-medium italic mb-0.5">{s}</p>)}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3"><strong>Pronoun:</strong> {lt.pronoun}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Key Phrases</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {lt.phrases.map(p => (
              <span key={p} className="text-xs bg-slate-100 text-gray-700 px-3 py-1.5 rounded-xl font-medium">{p}</span>
            ))}
          </div>
          <p className="text-xs text-red-500"><strong>Avoid:</strong> {lt.avoid}</p>
        </div>
      ))}

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Useful Connectors (Konnektoren)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Adding information', words: ['außerdem', 'zusätzlich', 'zudem', 'darüber hinaus', 'auch'] },
            { label: 'Contrast / Concession', words: ['jedoch', 'allerdings', 'trotzdem', 'obwohl', 'zwar … aber'] },
            { label: 'Cause / Reason', words: ['deshalb', 'deswegen', 'daher', 'darum', 'wegen + Genitiv'] },
            { label: 'Purpose / Goal', words: ['damit', 'um … zu', 'zum Zweck'] },
            { label: 'Time sequence', words: ['zunächst', 'dann', 'danach', 'schließlich', 'zuerst'] },
            { label: 'Listing / Emphasis', words: ['erstens', 'zweitens', 'außerdem', 'vor allem', 'besonders'] },
          ].map(g => (
            <div key={g.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.words.map(w => (
                  <span key={w} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Common Mistakes to Avoid</h2>
        <ul className="space-y-3">
          {[
            ['Missing bullet points', 'Read all 5 points before you start. Tick each off as you write. Even a brief mention scores 1 point.'],
            ['Wrong register', 'Formal = Sie + Sehr geehrte/r. Informal = du + Liebe/r. Mixing registers costs Kommunikation points.'],
            ['No greeting / closing', 'Always include a proper salutation and closing. These alone are worth up to 6 points.'],
            ['Too short or too long', 'Aim for 80–150 words. Too short = missing content. Too long = more errors. Quality over quantity.'],
            ['Forgetting connectors', 'Use at least 3 connectors (deshalb, außerdem, jedoch, etc.) to score well in structure.'],
            ['Capital nouns', 'Every German noun is capitalised. Der Tisch, die Prüfung, das Leben — always!'],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
