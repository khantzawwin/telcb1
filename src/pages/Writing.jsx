import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getTodayKey } from '../utils/srs'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
  : null

// ─── Prompts ──────────────────────────────────────────────────────────────────
// Each prompt has an incoming email the student received, and points they must
// include in their reply. This matches the real TELC B1 Schreiben Teil 1 format.

const PROMPTS = [
  // ── Informal ─────────────────────────────────────────────────────────────────
  {
    id: 1, type: 'informal',
    title: 'Neue Wohnung',
    instruction: 'Sie haben eine E-Mail von Ihrer Freundin Mia bekommen. Schreiben Sie eine Antwort auf die E-Mail.',
    incomingEmail: {
      from: 'Mia Schmidt',
      subject: 'Deine neue Wohnung!',
      body: `Liebe/r [Name],

ich habe gerade von deinem Umzug gehört und wollte dir sofort schreiben! Wie ist deine neue Wohnung? Gefällt dir die Gegend?

Ich würde dich so gerne besuchen! Wann würde es dir passen? Vielleicht könnten wir zusammen etwas essen gehen oder einen Spaziergang machen.

Liebe Grüße,
Mia`,
    },
    addressee: 'Mia',
    points: [
      'Beschreiben Sie Ihre neue Wohnung (Größe, Lage, was Ihnen gefällt).',
      'Erzählen Sie, wie der Umzug war.',
      'Berichten Sie etwas über Ihre neue Nachbarschaft.',
      'Laden Sie Mia ein und machen Sie einen konkreten Plan.',
    ],
  },
  {
    id: 2, type: 'informal',
    title: 'Urlaubspläne',
    instruction: 'Ihr Cousin Erik hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Erik Berger',
      subject: 'Sommerurlaub – kommst du mit?',
      body: `Hey [Name],

ich plane diesen Sommer eine Reise und dachte, vielleicht hast du Lust mitzukommen? Ich habe noch kein festes Ziel – vielleicht Südeuropa, vielleicht Skandinavien. Die Reise würde ungefähr zwei Wochen dauern, wahrscheinlich im Juli oder August.

Was meinst du? Ich freue mich auf deine Antwort!

Viele Grüße,
Erik`,
    },
    addressee: 'Erik',
    points: [
      'Zeigen Sie Interesse und sagen Sie, ob Sie mitkommen können.',
      'Schlagen Sie ein konkretes Reiseziel vor und begründen Sie es.',
      'Nennen Sie zwei Aktivitäten, die Sie dort machen möchten.',
      'Fragen Sie nach den ungefähren Kosten und dem Transportmittel.',
    ],
  },
  {
    id: 3, type: 'informal',
    title: 'Geburtstagseinladung',
    instruction: 'Ihre Freundin Lena hat Ihnen eine Einladung geschickt. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Lena Wagner',
      subject: 'Mein Geburtstag – du bist eingeladen!',
      body: `Liebe/r [Name],

ich feiere nächsten Samstag meinen Geburtstag und würde mich riesig freuen, wenn du kommen könntest! Die Party beginnt um 19 Uhr bei mir zu Hause. Es wird Essen geben, Musik und natürlich viele gemeinsame Freunde.

Du musst nichts mitbringen, aber wenn du magst, kannst du etwas zu trinken mitbringen. Kannst du kommen?

Herzliche Grüße,
Lena`,
    },
    addressee: 'Lena',
    points: [
      'Bedanken Sie sich für die Einladung und bestätigen Sie, dass Sie kommen.',
      'Fragen Sie, wie viele Personen kommen werden.',
      'Bieten Sie an, etwas beizutragen (Essen, Getränke oder Hilfe beim Vorbereiten).',
      'Schlagen Sie vor, sich am nächsten Tag noch einmal zu treffen.',
    ],
  },
  {
    id: 4, type: 'informal',
    title: 'Neue Arbeitsstelle',
    instruction: 'Ihr Freund Max hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Max Schreiber',
      subject: 'Wie läuft die neue Stelle?',
      body: `Hey [Name],

ich wollte mal fragen, wie es dir bei der neuen Arbeit geht! Du hast letzte Woche angefangen, oder? Macht es dir Spaß? Wie sind die Kollegen?

Bei mir gibt es auch Neuigkeiten – ich überlege selbst, den Job zu wechseln. Vielleicht können wir uns bald treffen und reden?

Bis bald,
Max`,
    },
    addressee: 'Max',
    points: [
      'Beschreiben Sie Ihre neue Arbeitsstelle und was Sie dort machen.',
      'Erzählen Sie, was Ihnen besonders gut gefällt.',
      'Erwähnen Sie eine Schwierigkeit, auf die Sie gestoßen sind.',
      'Fragen Sie nach seinen Neuigkeiten und schlagen Sie ein Treffen vor.',
    ],
  },
  {
    id: 5, type: 'informal',
    title: 'Deutsch lernen',
    instruction: 'Ihre Freundin Sofia hat Ihnen geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Sofia Reyes',
      subject: 'Du lernst Deutsch?',
      body: `Liebe/r [Name],

ich habe gehört, dass du Deutsch lernst – das ist ja toll! Wie lange machst du das schon? Findest du es sehr schwer? Ich überlege auch, eine neue Sprache zu lernen.

Magst du mir erzählen, wie du lernst und ob es dir Spaß macht?

Viele Grüße,
Sofia`,
    },
    addressee: 'Sofia',
    points: [
      'Erklären Sie, warum Sie Deutsch lernen.',
      'Beschreiben Sie, wie Sie lernen (Kurs, App, Bücher usw.).',
      'Nennen Sie etwas, das Sie besonders schwierig finden.',
      'Erzählen Sie einen lustigen Sprachfehler, den Sie gemacht haben.',
    ],
  },
  {
    id: 6, type: 'informal',
    title: 'Stadtempfehlung',
    instruction: 'Ihr Freund Ben hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Ben Carter',
      subject: 'Deutschland besuchen – hast du Tipps?',
      body: `Hey [Name],

ich plane dieses Jahr, Deutschland zu besuchen, und brauche deine Hilfe! Welche Stadt würdest du mir empfehlen? Was gibt es dort zu sehen?

Am liebsten möchte ich etwas Besonderes erleben – kein normaler Touristenweg. Hast du Tipps für mich?

Viele Grüße,
Ben`,
    },
    addressee: 'Ben',
    points: [
      'Empfehlen Sie eine deutsche Stadt und erklären Sie warum.',
      'Beschreiben Sie mindestens zwei Sehenswürdigkeiten oder Aktivitäten.',
      'Geben Sie praktische Tipps (Unterkunft, Verkehr, beste Reisezeit).',
      'Schlagen Sie vor, die Stadt eines Tages gemeinsam zu besuchen.',
    ],
  },
  {
    id: 7, type: 'informal',
    title: 'Problem mit Mitbewohner',
    instruction: 'Ihre Freundin Anna hat Ihnen geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Anna Köhler',
      subject: 'Ich brauche deinen Rat!',
      body: `Liebe/r [Name],

ich habe ein Problem mit meinem Mitbewohner und weiß nicht, was ich tun soll. Er ist nie ordentlich, lässt Geschirr in der Küche stehen und kommt nachts laut nach Hause. Ich habe ihn schon zweimal angesprochen, aber nichts ändert sich.

Was würdest du an meiner Stelle machen?

Liebe Grüße,
Anna`,
    },
    addressee: 'Anna',
    points: [
      'Zeigen Sie Verständnis für ihr Problem.',
      'Fragen Sie nach weiteren Details zur Situation.',
      'Geben Sie mindestens zwei konkrete Ratschläge.',
      'Schlagen Sie vor, das Thema gemeinsam beim nächsten Treffen zu besprechen.',
    ],
  },
  {
    id: 8, type: 'informal',
    title: 'Neues Hobby',
    instruction: 'Ihre Freundin Clara hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Clara Nowak',
      subject: 'Mein neues Hobby!',
      body: `Liebe/r [Name],

ich wollte dir unbedingt von meinem neuen Hobby erzählen: Ich male jetzt Aquarelle! Es macht mir unglaublich viel Spaß.

Hast du auch ein Hobby, das dir viel bedeutet? Ich würde gerne mehr davon hören. Vielleicht können wir uns bald treffen?

Bis bald,
Clara`,
    },
    addressee: 'Clara',
    points: [
      'Freuen Sie sich für Clara und stellen Sie eine Frage zu ihrem Hobby.',
      'Erzählen Sie von Ihrem eigenen Hobby und wie Sie es entdeckt haben.',
      'Beschreiben Sie, was Ihnen daran am besten gefällt.',
      'Machen Sie einen konkreten Plan, sich zu treffen.',
    ],
  },
  {
    id: 9, type: 'informal',
    title: 'Alltag in Deutschland',
    instruction: 'Ihre Brieffreundin Ana aus Spanien hat Ihnen geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Ana García',
      subject: 'Wie ist das Leben in Deutschland?',
      body: `Liebe/r [Name],

ich freue mich so, dass wir uns regelmäßig schreiben! Ich wollte dich schon lange fragen: Wie ist das Leben in Deutschland? Was ist ein typischer Tag bei dir?

Gibt es etwas, das dich überrascht oder begeistert hat? Ich stelle mir Deutschland immer sehr ordentlich und pünktlich vor!

Liebe Grüße aus Spanien,
Ana`,
    },
    addressee: 'Ana',
    points: [
      'Beschreiben Sie Ihren typischen Alltag in Deutschland.',
      'Erzählen Sie etwas Typisch-Deutsches, das Sie überrascht hat.',
      'Beschreiben Sie Ihre Wohngegend.',
      'Stellen Sie Ana zwei Fragen über ihren eigenen Alltag.',
    ],
  },
  {
    id: 10, type: 'informal',
    title: 'Wochenendausflug',
    instruction: 'Ihr Freund Jonas hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Jonas Braun',
      subject: 'Pläne fürs Wochenende?',
      body: `Hey [Name],

hast du dieses Wochenende schon etwas vor? Ich hätte total Lust auf einen Ausflug – vielleicht in die Natur oder eine andere Stadt. Ich bin für alles offen!

Was denkst du? Schreib mir schnell!

Bis bald,
Jonas`,
    },
    addressee: 'Jonas',
    points: [
      'Begrüßen Sie seine Idee und schlagen Sie eine konkrete Aktivität vor.',
      'Erklären Sie, warum Sie diese Aktivität gewählt haben.',
      'Nennen Sie die praktischen Details (wo, wann, was mitbringen).',
      'Fragen Sie, ob Jonas besondere Wünsche hat.',
    ],
  },

  // ── Halbformal ────────────────────────────────────────────────────────────────
  {
    id: 11, type: 'halbformal',
    title: 'Verpasste Prüfung',
    instruction: 'Ihre Lehrerin Frau Schmidt hat Ihnen eine E-Mail geschickt. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Frau Schmidt',
      subject: 'Ihre Abwesenheit bei der Prüfung',
      body: `Guten Tag,

ich habe gesehen, dass Sie bei der Deutschprüfung am Dienstag nicht da waren. Ich mache mir Sorgen und möchte wissen, ob es Ihnen gut geht.

Können Sie mir bitte schreiben, was passiert ist? Wenn Sie krank waren, brauche ich ein ärztliches Attest. Ich hoffe, wir finden zusammen eine Lösung.

Mit freundlichen Grüßen,
Frau Schmidt`,
    },
    addressee: 'Frau Schmidt',
    points: [
      'Entschuldigen Sie sich für die Abwesenheit und erklären Sie den Grund.',
      'Erwähnen Sie, dass Sie ein ärztliches Attest haben.',
      'Fragen Sie, ob Sie die Prüfung nachholen können.',
      'Fragen Sie, welchen Unterrichtsstoff Sie verpasst haben.',
    ],
  },
  {
    id: 12, type: 'halbformal',
    title: 'Gemeinsamer Garten',
    instruction: 'Ihr Nachbar Herr Fischer hat Ihnen eine E-Mail geschickt. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Herr Fischer',
      subject: 'Unser gemeinsamer Garten',
      body: `Guten Tag,

ich schreibe Ihnen wegen unseres gemeinsamen Gartens. Ich glaube, es gibt ein kleines Problem damit, wie wir den Garten benutzen. Letzte Woche wollte meine Familie im Garten ein kleines Fest feiern, aber das war leider nicht möglich.

Ich würde mich freuen, wenn wir darüber sprechen könnten.

Mit freundlichen Grüßen,
Herr Fischer`,
    },
    addressee: 'Herrn Fischer',
    points: [
      'Bestätigen Sie den Empfang seiner E-Mail und zeigen Sie Verständnis.',
      'Erklären Sie Ihre Perspektive zur Gartensituation.',
      'Schlagen Sie eine faire Lösung oder Regelung vor.',
      'Laden Sie ihn zu einem persönlichen Gespräch ein.',
    ],
  },
  {
    id: 13, type: 'halbformal',
    title: 'Flexible Arbeitszeiten',
    instruction: 'Ihre Chefin Frau Hoffmann hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Frau Hoffmann',
      subject: 'Ihre Anfrage – Arbeitszeiten',
      body: `Guten Tag,

ich habe Ihre Nachricht bekommen. Sie möchten Ihre Arbeitszeiten für kurze Zeit ändern. Ich verstehe, dass Sie gerade eine schwierige private Situation haben.

Bevor ich entscheide, möchte ich aber mehr wissen: Welche Zeiten genau möchten Sie ändern und wie lange? Und wie wollen Sie Ihre Arbeit trotzdem schaffen?

Mit freundlichen Grüßen,
Frau Hoffmann`,
    },
    addressee: 'Frau Hoffmann',
    points: [
      'Bedanken Sie sich für ihre schnelle Antwort.',
      'Erklären Sie kurz die private Situation (ohne zu viele Details).',
      'Nennen Sie genau, welche Zeiten Sie ändern möchten und für wie lange.',
      'Beschreiben Sie, wie Ihre Aufgaben trotzdem pünktlich erledigt werden können.',
    ],
  },
  {
    id: 14, type: 'halbformal',
    title: 'Stundenplanänderung',
    instruction: 'Die Koordinatorin Ihrer Sprachschule hat Ihnen geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Sprachschule Berliner Tor – Koordination',
      subject: 'Änderung Ihres Kursplans',
      body: `Sehr geehrte/r Teilnehmer/in,

wir möchten Sie informieren, dass Ihr Deutschkurs ab nächster Woche zu einer anderen Zeit stattfindet. Der Kurs ist ab jetzt mittwochs von 18:00 bis 20:00 Uhr und nicht mehr dienstags.

Wir hoffen, dass diese Änderung für Sie in Ordnung ist. Bei Fragen helfen wir Ihnen gerne.

Mit freundlichen Grüßen,
Das Koordinationsteam`,
    },
    addressee: 'die Koordinatorin der Sprachschule',
    points: [
      'Erklären Sie, dass die neue Zeit ein Problem für Sie ist.',
      'Beschreiben Sie den Konflikt (z. B. Arbeit oder Kinderbetreuung).',
      'Fragen Sie, ob Sie in eine andere Gruppe wechseln können.',
      'Fragen Sie, was mit den Stunden passiert, die Sie verpassen werden.',
    ],
  },
  {
    id: 15, type: 'halbformal',
    title: 'Waschmaschine kaputt',
    instruction: 'Ihre Vermieterin Frau Becker hat Ihnen eine E-Mail geschrieben. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Frau Becker',
      subject: 'Alles in Ordnung in der Wohnung?',
      body: `Guten Tag,

ich hoffe, Sie fühlen sich in der Wohnung wohl! Ich wollte kurz fragen, ob alles in Ordnung ist und ob es etwas gibt, das man reparieren sollte.

Bitte melden Sie sich, wenn etwas nicht funktioniert.

Mit freundlichen Grüßen,
Frau Becker`,
    },
    addressee: 'Frau Becker',
    points: [
      'Bedanken Sie sich für ihre Nachfrage.',
      'Berichten Sie, dass die Waschmaschine seit drei Tagen kaputt ist.',
      'Erklären Sie, wie das Problem Ihren Alltag beeinträchtigt.',
      'Bitten Sie um einen Techniker und nennen Sie passende Termine.',
    ],
  },
  {
    id: 16, type: 'halbformal',
    title: 'Abwesenheit – Kind krank',
    instruction: 'Der Klassenlehrer Herr Weber hat Ihnen eine E-Mail geschickt. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Herr Weber',
      subject: 'Abwesenheit von Lena',
      body: `Guten Tag,

ich schreibe Ihnen wegen Ihrer Tochter Lena. Sie war diese Woche nicht in der Schule, und ich habe bis jetzt keine Entschuldigung von Ihnen bekommen.

Ich mache mir ein bisschen Sorgen und möchte gerne wissen, ob alles in Ordnung ist. Bitte melden Sie sich so schnell wie möglich.

Mit freundlichen Grüßen,
Herr Weber`,
    },
    addressee: 'Herrn Weber',
    points: [
      'Entschuldigen Sie das Fehlen Ihres Kindes und nennen Sie den Grund.',
      'Nennen Sie die genauen Fehlzeiten (Datum).',
      'Erwähnen Sie, dass Sie ein ärztliches Attest haben.',
      'Fragen Sie nach dem versäumten Stoff und wie Ihr Kind aufholen kann.',
    ],
  },
  {
    id: 17, type: 'halbformal',
    title: 'Sportverein',
    instruction: 'Das Sekretariat des FC Grüntal hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'FC Grüntal – Sekretariat',
      subject: 'Ihre Mitgliedsanfrage',
      body: `Sehr geehrte/r Interessent/in,

vielen Dank für Ihr Interesse am FC Grüntal! Wir freuen uns immer über neue Mitglieder.

Damit wir Ihnen besser helfen können, würden wir gerne mehr über Sie erfahren: Welche Erfahrungen haben Sie im Fußball, und auf welchem Niveau spielen Sie?

Mit sportlichen Grüßen,
Das Sekretariat`,
    },
    addressee: 'das Sekretariat des FC Grüntal',
    points: [
      'Beschreiben Sie Ihre Fußballerfahrung und Ihr aktuelles Niveau.',
      'Fragen Sie nach den Trainingszeiten und -orten.',
      'Erkundigen Sie sich nach dem Mitgliedsbeitrag.',
      'Fragen Sie, ob es die Möglichkeit eines Schnuppertrainings gibt.',
    ],
  },
  {
    id: 18, type: 'halbformal',
    title: 'Ehrenamt',
    instruction: 'Die Koordinatorin des Bürgerhaus Westend hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Bürgerhaus Westend – Koordination',
      subject: 'Ihre Ehrenamts-Anfrage',
      body: `Sehr geehrte/r Bewerber/in,

vielen Dank, dass Sie im Bürgerhaus Westend ehrenamtlich helfen möchten! Wir suchen immer Menschen, die gerne helfen.

Damit wir die richtige Aufgabe für Sie finden, möchten wir mehr über Sie wissen: Was können Sie gut? Wie viel Zeit pro Woche haben Sie?

Mit freundlichen Grüßen,
Das Koordinationsteam`,
    },
    addressee: 'die Koordinatorin des Bürgerhaus Westend',
    points: [
      'Beschreiben Sie Ihre relevanten Fähigkeiten oder Erfahrungen.',
      'Nennen Sie, wie viel Zeit pro Woche Sie investieren können.',
      'Fragen Sie, welche konkreten Tätigkeiten aktuell gesucht werden.',
      'Fragen Sie nach den nächsten Schritten, um mitmachen zu können.',
    ],
  },

  // ── Formal ───────────────────────────────────────────────────────────────────
  {
    id: 19, type: 'formal',
    title: 'Sprachkurs – Rückfrage',
    instruction: 'Die Sprachschule Berliner Tor hat auf Ihre Anfrage geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Sprachschule Berliner Tor',
      subject: 'Re: Informationsanfrage Deutschkurse',
      body: `Sehr geehrte Damen und Herren,

vielen Dank für Ihr Interesse an unseren Deutschkursen! Wir bieten Kurse auf verschiedenen Stufen von A1 bis C1 an.

Unsere Kurse finden montags bis freitags statt, von 09:00–12:00 Uhr oder von 17:00–20:00 Uhr. Wenn Sie mehr über die Preise und die Anmeldung wissen möchten, schreiben Sie uns gerne.

Mit freundlichen Grüßen,
Sprachschule Berliner Tor`,
    },
    addressee: 'die Sprachschule Berliner Tor',
    points: [
      'Bedanken Sie sich für die Informationen.',
      'Fragen Sie, ob der Kurs für das Niveau B1 geeignet ist.',
      'Erkundigen Sie sich nach den Kursgebühren und möglichen Ermäßigungen.',
      'Fragen Sie, wie und bis wann man sich anmelden kann.',
    ],
  },
  {
    id: 20, type: 'formal',
    title: 'Online-Shop – Rückgabe',
    instruction: 'Der Kundenservice hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Modehaus Online – Kundenservice',
      subject: 'Re: Beschwerde Bestellnummer #45821',
      body: `Sehr geehrte/r Kunde/Kundin,

vielen Dank für Ihre Nachricht. Es tut uns leid, dass Sie das falsche Produkt bekommen haben.

Damit wir Ihnen helfen können, brauchen wir noch ein paar Informationen: Können Sie uns bitte genau beschreiben, was Sie bekommen haben? Dann kümmern wir uns sofort darum.

Mit freundlichen Grüßen,
Kundenservice Modehaus Online`,
    },
    addressee: 'den Kundenservice von Modehaus Online',
    points: [
      'Bestätigen Sie Ihre Bestelldetails (Datum, bestelltes Produkt, Bestellnummer).',
      'Beschreiben Sie genau, was Sie stattdessen erhalten haben.',
      'Erklären Sie, dass Sie das falsche Produkt bereits zurückgeschickt haben oder es zurückschicken möchten.',
      'Fordern Sie eine Rückerstattung oder die Lieferung des richtigen Produkts und setzen Sie eine Frist.',
    ],
  },
  {
    id: 21, type: 'formal',
    title: 'Hotel – Beschwerde',
    instruction: 'Der Manager des Hotel Seeblick hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Hotel Seeblick – Direktion',
      subject: 'Re: Ihre Beschwerde',
      body: `Sehr geehrte/r Gast,

vielen Dank für Ihre Nachricht über Ihren Aufenthalt. Es tut uns sehr leid, dass Ihr Besuch Ihnen nicht gefallen hat.

Damit wir Ihr Problem prüfen können, brauchen wir mehr Informationen: Welche Probleme hatten Sie genau? Haben Sie während Ihres Aufenthalts schon mit dem Personal gesprochen?

Mit freundlichen Grüßen,
Hotel Seeblick – Direktion`,
    },
    addressee: 'die Direktion des Hotel Seeblick',
    points: [
      'Nennen Sie Datum und Art Ihrer Buchung.',
      'Beschreiben Sie die Probleme, die Sie erlebt haben (mindestens zwei).',
      'Erklären Sie, wie das Personal reagiert hat.',
      'Nennen Sie klar, welche Entschädigung Sie erwarten.',
    ],
  },
  {
    id: 22, type: 'formal',
    title: 'Deutsche Bahn – Entschädigung',
    instruction: 'Die Deutsche Bahn hat auf Ihre Beschwerde geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Deutsche Bahn – Kundenservice',
      subject: 'Re: Ihre Fahrgastrechte-Anfrage',
      body: `Sehr geehrte/r Fahrgast,

vielen Dank für Ihre Beschwerde. Damit wir Ihnen helfen können, brauchen wir noch einige Informationen: das Datum der Reise, die Zugnummer, die Strecke und was genau passiert ist (Verspätung oder ausgefallener Zug).

Wenn wir diese Informationen haben, prüfen wir Ihren Fall.

Mit freundlichen Grüßen,
Deutsche Bahn Kundenservice`,
    },
    addressee: 'den Kundenservice der Deutschen Bahn',
    points: [
      'Nennen Sie Datum, Zugnummer und betroffene Strecke.',
      'Beschreiben Sie, was passiert ist (Verspätung oder Stornierung).',
      'Erklären Sie, welche Folgen Sie erlitten haben (verpasster Termin, Zusatzkosten).',
      'Bitten Sie um Entschädigung gemäß EU-Fahrgastrechten und setzen Sie eine Antwortfrist.',
    ],
  },
  {
    id: 23, type: 'formal',
    title: 'Arzttermin bestätigen',
    instruction: 'Die Arztpraxis Dr. Müller hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Arztpraxis Dr. Müller',
      subject: 'Terminbestätigung',
      body: `Guten Tag,

wir können Ihnen folgenden Termin anbieten: Donnerstag, 27. Juli, um 10:30 Uhr.

Bitte bestätigen Sie diesen Termin bis morgen. Kommen Sie außerdem mit Ihrer Versicherungskarte. Haben Sie Allergien oder nehmen Sie regelmäßig Medikamente?

Mit freundlichen Grüßen,
Praxis Dr. Müller`,
    },
    addressee: 'die Arztpraxis Dr. Müller',
    points: [
      'Bestätigen Sie den Termin.',
      'Beschreiben Sie kurz, warum Sie zum Arzt kommen.',
      'Beantworten Sie die Frage zu Allergien und Medikamenten.',
      'Fragen Sie, ob Sie sich besonders auf den Termin vorbereiten müssen.',
    ],
  },
  {
    id: 24, type: 'formal',
    title: 'Wohnungsbesichtigung',
    instruction: 'Ein Vermieter hat auf Ihre Wohnungsanfrage geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'Peter Lange – Vermieter',
      subject: 'Re: Anfrage Wohnung Goethestraße 12',
      body: `Sehr geehrte/r Interessent/in,

vielen Dank für Ihr Interesse an der Wohnung in der Goethestraße 12. Die Wohnung hat 65 m², liegt im 3. Stock und ist in einem sehr guten Zustand. Die Miete ist 950 € inklusive Nebenkosten.

Ich möchte Ihnen die Wohnung gerne zeigen. Hätten Sie am Dienstag oder Mittwoch nächster Woche Zeit?

Mit freundlichen Grüßen,
Peter Lange`,
    },
    addressee: 'Herrn Lange',
    points: [
      'Bedanken Sie sich und bestätigen Sie Ihr Interesse.',
      'Fragen Sie, ob Haustiere in der Wohnung erlaubt sind.',
      'Nennen Sie, welcher der vorgeschlagenen Termine Ihnen passt.',
      'Fragen Sie, welche Unterlagen Sie zur Besichtigung mitbringen sollen.',
    ],
  },
  {
    id: 25, type: 'formal',
    title: 'Krankenkasse – Rechnung',
    instruction: 'Ihre Krankenkasse hat Ihnen geantwortet. Schreiben Sie eine Antwort.',
    incomingEmail: {
      from: 'AOK – Kundenservice',
      subject: 'Re: Ihre Anfrage zur Arztrechnung',
      body: `Sehr geehrte/r Versicherte/r,

vielen Dank für Ihre Nachricht wegen Ihrer Rechnung. Damit wir Ihren Fall prüfen können, brauchen wir noch mehr Informationen: Ihre Versicherungsnummer, das Datum der Behandlung und den Namen des Arztes.

Bitte schicken Sie uns diese Informationen so schnell wie möglich.

Mit freundlichen Grüßen,
AOK Kundenservice`,
    },
    addressee: 'den Kundenservice der AOK',
    points: [
      'Nennen Sie Ihre Versicherungsnummer und persönliche Daten.',
      'Nennen Sie Datum und Art der Behandlung sowie den Arzt.',
      'Erklären Sie, warum Sie glauben, dass die Behandlung übernommen werden sollte.',
      'Bitten Sie um Klärung und darum, dass die Rechnung direkt beglichen wird.',
    ],
  },
]

// ─── Gemini evaluation ────────────────────────────────────────────────────────

async function evaluateWithGemini(prompt, userText) {
  if (!GEMINI_URL) throw new Error('no_api_key')

  const typeLabel = prompt.type === 'formal' ? 'förmlich' : prompt.type === 'informal' ? 'informell' : 'halbförmlich'

  const systemPrompt = `You are an official TELC B1 German exam examiner. Evaluate the student's reply strictly using the TELC B1 Schreiben Teil 1 marking scheme (45 points total).

EXAM TASK:
The student received the following email and must write a reply in German.
Register: ${typeLabel}
Addressee: ${prompt.addressee}

INCOMING EMAIL (what the student received):
From: ${prompt.incomingEmail.from}
Subject: ${prompt.incomingEmail.subject}
Body:
${prompt.incomingEmail.body}

REQUIRED REPLY POINTS (student must address all ${prompt.points.length}):
${prompt.points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

STUDENT'S REPLY:
${userText}

SCORING GUIDE:
1. INHALT (Content) — 15 points: Score each content point 0–3 (3=fully addressed, 2=partially, 1=barely, 0=missing). Total = sum of all point scores, max 15.
2. KOMMUNIKATIVE GESTALTUNG (Communication) — 15 points: Rate salutation (0–3), structure (0–3), register consistency (0–3), connectors (0–3), clarity (0–3).
3. FORMALE RICHTIGKEIT (Accuracy) — 15 points: Rate grammar (0–5), vocabulary (0–5), spelling/punctuation (0–5).

Return ONLY valid JSON exactly like this (no markdown, no extra text):
{
  "inhalt": {
    "score": <0-15>,
    "points": [
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
  "summary": "<2-3 encouraging sentences in English>",
  "musterbrief": "<A complete model reply IN GERMAN written at a REALISTIC CEFR B1 / telc B1 level — like a good B1 student would write, NOT a native speaker and NOT B2/C1. STRICT LANGUAGE RULES: use simple, common everyday words; short and clear sentences (mostly main clauses, plus easy subordinate clauses with weil/dass/wenn); use ONLY basic B1 connectors (und, aber, denn, deshalb, weil, dann, außerdem, trotzdem); AVOID rare, formal or abstract vocabulary, idioms, Passiv, Konjunktiv I, and complicated Konjunktiv II (only simple forms like 'ich würde gern …' and 'könnten Sie …' are allowed); avoid long compound nouns. It MUST use the correct register (${typeLabel}), open with a fitting Anrede for ${prompt.addressee}, clearly address ALL ${prompt.points.length} points in simple language, end with a fitting Gruß, and be about 80 words. Use \\n for line breaks after the greeting and before the closing. The result should be something a real B1 student could realistically write themselves.>"
}`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2400 },
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
      await Promise.all([
        setDoc(doc(db, 'users', user.uid, 'writing', todayKey), {
          promptId: todayPrompt.id,
          promptTitle: todayPrompt.title,
          text,
          result,
          submittedAt: new Date().toISOString(),
        }),
        setDoc(
          doc(db, 'users', user.uid, 'sessions', todayKey),
          { writing: { completed: true, completedAt: new Date().toISOString() } },
          { merge: true }
        ),
      ])
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
      <p className="text-base text-gray-400 mb-8">TELC B1 · Schreiben Teil 1 · {PROMPTS.length} tasks</p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['practice', 'Practice'], ['tips', 'Tips']].map(([key, label]) => (
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
  const TYPE_LABEL = { formal: 'Förmlich', halbformal: 'Halbförmlich', informal: 'Informell' }
  const wordOk  = wordCount >= 70 && wordCount <= 120
  const wordLow = wordCount > 0 && wordCount < 70

  return (
    <div className="space-y-5">
      {/* Task header */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">TELC B1 · Schreiben · Teil 1</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${TYPE_COLOR[prompt.type]}`}>
            {TYPE_LABEL[prompt.type]}
          </span>
        </div>
        <div className="px-6 pt-5 pb-6">
          <p className="text-base text-gray-800 leading-relaxed mb-5">{prompt.instruction}</p>

          {/* Incoming email */}
          <div className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-gray-200 space-y-1">
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-14 flex-shrink-0">Von:</span>
                <span className="font-medium text-gray-800">{prompt.incomingEmail.from}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-14 flex-shrink-0">Betreff:</span>
                <span className="font-medium text-gray-800">{prompt.incomingEmail.subject}</span>
              </div>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {prompt.incomingEmail.body}
              </p>
            </div>
          </div>

          {/* Reply points */}
          <p className="text-sm font-semibold text-gray-500 mb-3">Schreiben Sie zu folgenden Punkten:</p>
          <ul className="space-y-2.5 mb-5">
            {prompt.points.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-base text-gray-800 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-dashed border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              Schreiben Sie <strong className="text-gray-700">etwa 80 Wörter</strong>.
              Vergessen Sie Anrede und Gruß nicht.
            </p>
          </div>
        </div>
      </div>

      {/* Answer or feedback */}
      {!feedback ? (
        <>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ihre Antwort</span>
              <span className={`text-xs font-semibold tabular-nums ${
                wordOk ? 'text-green-600' : wordLow ? 'text-amber-500' : wordCount > 120 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {wordCount} Wörter{wordOk ? ' ✓' : wordCount > 0 ? ' (Ziel: ~80)' : ''}
              </span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Beginnen Sie Ihre Antwort hier …\n\nDenken Sie an: Anrede · alle Punkte · passenden Gruß`}
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
                Gemini bewertet …
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
  const { inhalt, kommunikation, genauigkeit, total, level, summary, musterbrief } = feedback
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

      {/* Model answer — how a full-mark reply could look */}
      {musterbrief && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 bg-indigo-50 border-b border-indigo-100">
            <span className="text-base">✍️</span>
            <div>
              <p className="text-sm font-bold text-indigo-800">Musterlösung — Model Answer</p>
              <p className="text-xs text-indigo-500">An example reply that would score full marks. Compare it with yours.</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{musterbrief}</p>
          </div>
        </div>
      )}

      <details className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-gray-500 hover:bg-slate-50 list-none flex items-center justify-between">
          <span>Your submitted reply</span>
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
        Try again with a new reply
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
        <h2 className="text-base font-bold text-gray-800 mb-4">TELC B1 Schreiben Teil 1 — How it works</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4 mb-4">
          <p className="text-sm text-indigo-800 leading-relaxed">
            You receive a <strong>real email from someone</strong> (friend, teacher, company). You must <strong>write a reply</strong> that addresses all required bullet points. Aim for <strong>about 80 words</strong>. Use an appropriate greeting and closing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Inhalt', pts: '15', desc: '4 content points × up to 3 pts each. Address every bullet point clearly.' },
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
        <p className="text-xs text-gray-400 mt-4">Pass mark: <strong className="text-gray-600">36 / 45 (80%)</strong>. Writing time: ~30 minutes.</p>
      </div>

      {[
        {
          type: 'Informell', badge: 'bg-green-100 text-green-700',
          when: 'Friends, family, pen pals.',
          salutation: ['Liebe Mia,', 'Lieber Jonas,', 'Hallo Ben,'],
          closing: ['Liebe Grüße,', 'Viele Grüße,', 'Bis bald,'],
          pronoun: 'du / ihr',
          phrases: [
            'Wie geht es dir?', 'Stell dir vor …!', 'Es wäre super, wenn …',
            'Ich freue mich schon riesig!', 'Was hältst du davon?', 'Ich wollte dir schnell schreiben …',
          ],
          avoid: 'Overly formal phrases, Sie-form.',
        },
        {
          type: 'Halbförmlich', badge: 'bg-amber-100 text-amber-700',
          when: 'Teachers, doctors, neighbours, employers you know.',
          salutation: ['Guten Tag, Frau Schmidt,', 'Liebe Frau Becker,', 'Sehr geehrter Herr Weber,'],
          closing: ['Herzliche Grüße,', 'Viele Grüße,', 'Mit freundlichen Grüßen,'],
          pronoun: 'Sie (still formal — only du if invited)',
          phrases: [
            'Ich hoffe, es geht Ihnen gut.', 'Ich wollte Sie kurz fragen, ob …',
            'Ich wäre Ihnen sehr dankbar, wenn …', 'Danke im Voraus für Ihre Hilfe.',
            'Ich freue mich auf Ihre Rückmeldung.', 'Mit freundlicher Bitte um …',
          ],
          avoid: 'Overly stiff phrases; casual slang.',
        },
        {
          type: 'Förmlich', badge: 'bg-indigo-100 text-indigo-700',
          when: 'Companies, authorities, hotels, unknown persons.',
          salutation: ['Sehr geehrte Damen und Herren,', 'Sehr geehrter Herr Lange,', 'Sehr geehrte Frau Hoffmann,'],
          closing: ['Mit freundlichen Grüßen,', 'Mit freundlichem Gruß,'],
          pronoun: 'Sie (immer)',
          phrases: [
            'Ich schreibe Ihnen bezüglich …', 'Hiermit möchte ich …',
            'Könnten Sie mir bitte … mitteilen?', 'Ich bitte Sie um …',
            'Vielen Dank für Ihre Mühe.', 'Ich freue mich auf Ihre Antwort.',
          ],
          avoid: 'du-form, exclamation marks for requests, casual language.',
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
        <h2 className="text-base font-bold text-gray-800 mb-4">Common Mistakes</h2>
        <ul className="space-y-3">
          {[
            ['Missing bullet points', 'Read all points before you start. Tick each off as you write. Even a brief mention scores 1 point.'],
            ['Wrong register', 'Informal = du. Formal/semi-formal = Sie. Mixing registers costs Kommunikation points.'],
            ['No greeting or closing', 'Always include a proper salutation and a closing line. These are easy free points.'],
            ['Too short', 'Under 60 words = missing content. Aim for about 80 words. Quality over quantity.'],
            ['Forgetting connectors', 'Use deshalb, außerdem, obwohl, trotzdem to connect ideas and score well in structure.'],
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

      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Useful Connectors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Adding information', words: ['außerdem', 'zusätzlich', 'zudem', 'auch', 'darüber hinaus'] },
            { label: 'Contrast / Concession', words: ['jedoch', 'allerdings', 'trotzdem', 'obwohl', 'zwar … aber'] },
            { label: 'Cause / Reason', words: ['deshalb', 'deswegen', 'daher', 'weil', 'denn'] },
            { label: 'Purpose / Goal', words: ['damit', 'um … zu', 'zum Zweck'] },
            { label: 'Time sequence', words: ['zunächst', 'dann', 'danach', 'schließlich', 'zuerst'] },
            { label: 'Emphasis', words: ['vor allem', 'besonders', 'insbesondere', 'leider', 'natürlich'] },
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
    </div>
  )
}
