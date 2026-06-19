import { useState } from 'react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
  : null

// ─── Teil 2 debates — each person gets a different perspective article ──────────

const TEIL2_DEBATES = [
  {
    theme: 'Alleine reisen',
    cards: [
      {
        headline: 'Allein reisen: Freiheit und Abenteuer',
        text: 'Immer mehr Menschen reisen allein — und das ist sehr gut so. Wer allein reist, kann jeden Tag selbst entscheiden, was er macht. Es gibt keine Kompromisse und kein Warten. Man lernt neue Menschen kennen und wird mutiger und selbstständiger. Studien zeigen: Alleinreisende sind offener für neue Erfahrungen. Ein Solotrip ist eine der besten Möglichkeiten, sich selbst besser kennenzulernen.',
      },
      {
        headline: 'Allein auf Reisen — riskant und teuer',
        text: 'Allein in fremde Länder zu fahren klingt toll, aber es gibt auch Probleme. Wenn man krank wird oder den Zug verpasst, muss man alles allein lösen. Das kann sehr stressig sein. Sicherheitsexperten warnen besonders Frauen vor einigen Reisezielen. Außerdem ist es oft teuer: Ein Einzelzimmer kostet bis zu 40 Prozent mehr als ein Zimmer in der Gruppe. Und manchmal ist man einfach einsam.',
      },
      {
        headline: 'Gut vorbereitet allein reisen',
        text: 'Alleinreisen ist nicht immer gefährlich — aber auch nicht immer einfach. Es kommt auf die Vorbereitung an. Wer gut plant und das Reiseziel gut auswählt, kann tolle Erfahrungen machen. Heute gibt es viele Möglichkeiten: Apps, Online-Communities und Hostels helfen dabei, andere Reisende kennenzulernen. So hat man die Freiheit des Solotrips und trotzdem soziale Kontakte.',
      },
    ],
  },
  {
    theme: 'Homeoffice',
    cards: [
      {
        headline: 'Homeoffice: Mehr Freiheit, mehr Leistung',
        text: 'Seit der Pandemie arbeiten viele Menschen von zu Hause — und das funktioniert gut. Studien zeigen: Mitarbeiter im Homeoffice sind produktiver. Es gibt weniger Unterbrechungen und keinen Stress beim Pendeln. Familien können Beruf und Familie besser kombinieren. Eine Umfrage hat ergeben, dass fast 70 Prozent der Menschen im Homeoffice zufriedener sind als ihre Kollegen im Büro.',
      },
      {
        headline: 'Homeoffice: Einsamkeit und kein Feierabend',
        text: 'Das Homeoffice klingt praktisch, aber es gibt auch Probleme. Viele Menschen fühlen sich einsam und vermissen den Kontakt zu Kollegen. Die Grenze zwischen Arbeit und Freizeit ist unscharf — man ist immer erreichbar. Besonders junge Mitarbeiter brauchen den Kontakt zu Kollegen, um zu lernen. Für Eltern mit kleinen Kindern ist konzentriertes Arbeiten zu Hause oft sehr schwierig.',
      },
      {
        headline: 'Hybrid-Modell: Das Beste aus beiden Welten',
        text: 'Weder nur Homeoffice noch täglich ins Büro — das Hybrid-Modell ist eine gute Lösung. Zwei oder drei Tage im Büro ermöglichen Teamarbeit und persönliche Gespräche. Die anderen Tage zu Hause bieten Ruhe und Flexibilität. Laut einer Studie möchten fast 75 Prozent der Beschäftigten diese Kombination. Auch Firmen sparen dabei Geld, weil sie weniger Bürofläche brauchen.',
      },
    ],
  },
  {
    theme: 'Soziale Medien',
    cards: [
      {
        headline: 'Soziale Medien: Verbunden mit der Welt',
        text: 'Soziale Medien werden oft kritisiert, aber sie haben viele Vorteile. Man kann Kontakt zu Freunden und Familie auf der ganzen Welt halten. Kleine Unternehmen können dort kostenlos Werbung machen und direkt mit Kunden sprechen. Außerdem können Menschen über soziale Medien für wichtige Themen kämpfen — zum Beispiel für den Klimaschutz. Sie verbinden Menschen weltweit.',
      },
      {
        headline: 'Soziale Medien: Sucht und falsche Informationen',
        text: 'Soziale Medien haben eine gefährliche Seite. Studien zeigen, dass viele Jugendliche durch soziale Medien Angst bekommen, schlechter schlafen und sich nicht mehr gut fühlen. Falsche Informationen verbreiten sich dort sehr schnell. Viele Nutzer merken nicht, wie viel Zeit sie dort verbringen — oft mehr als drei Stunden pro Tag. Es ist schwer, damit aufzuhören.',
      },
      {
        headline: 'Soziale Medien brauchen klare Regeln',
        text: 'Soziale Medien sind weder nur schlecht noch nur gut. Die Lösung liegt in klaren Regeln für die Plattformen. Die EU hat schon erste Gesetze gemacht: Plattformen müssen falsche Informationen bekämpfen und Kinder besser schützen. Soziale Medien können nützlich sein, wenn sie verantwortungsvoll genutzt werden. Klare Regeln sind wichtiger als ein komplettes Verbot.',
      },
    ],
  },
  {
    theme: 'Vegane Ernährung',
    cards: [
      {
        headline: 'Vegan essen: Gut für Gesundheit und Umwelt',
        text: 'Vegane Ernährung ist gut für die Gesundheit und für die Umwelt. Wer keine tierischen Produkte isst, hat laut Studien ein kleineres Risiko für Herzprobleme und Diabetes. Außerdem verursacht die Tierhaltung sehr viel CO₂ — mehr als alle Autos und Flugzeuge zusammen. Heute gibt es viele leckere vegane Produkte in jedem Supermarkt. Mit guter Planung kann man sich gesund und vegan ernähren.',
      },
      {
        headline: 'Vegan: Nicht immer gesund und oft teuer',
        text: 'Vegane Ernährung klingt gesund, hat aber Risiken. Ohne gute Planung fehlen wichtige Nährstoffe wie Vitamin B12 und Eisen. Das kann zu gesundheitlichen Problemen führen. Vegane Ersatzprodukte sind oft teuer — für Menschen mit wenig Geld ist das schwierig. Für Kinder und ältere Menschen ist eine vegane Ernährung ohne Arztberatung manchmal gefährlich.',
      },
      {
        headline: 'Weniger Fleisch — aber nicht gleich vegan',
        text: 'Müssen wir komplett auf Fleisch verzichten? Experten sagen: Nein. Weniger Fleisch essen ist für die meisten Menschen einfacher und auch sehr gut für die Umwelt. Wer einmal pro Woche auf Fleisch verzichtet, hilft schon sehr viel. Regional und saisonal einkaufen ist oft besser für die Umwelt als importierte Sojaprodukte. Man muss nicht perfekt vegan sein, um etwas zu verändern.',
      },
    ],
  },
  {
    theme: 'Elektroautos',
    cards: [
      {
        headline: 'Elektroautos: Die Zukunft des Fahrens',
        text: 'Elektroautos sind wichtig für den Klimaschutz. In Städten verbessern sie die Luftqualität. Moderne Elektroautos können 400 bis 600 Kilometer mit einer Ladung fahren. Sie sind günstiger zu betreiben: Strom kostet weniger als Benzin, und die Wartung ist einfacher. Viele Länder geben beim Kauf Geld dazu. Die Zukunft gehört dem Elektroauto — das ist sicher.',
      },
      {
        headline: 'Elektroautos: Teuer und nicht wirklich grün',
        text: 'Elektroautos gelten als gut für die Umwelt, aber es ist komplizierter. Die Produktion einer Batterie braucht viel Energie und seltene Rohstoffe. Das Ladenetz ist noch nicht gut genug — auf langen Strecken ist das ein echtes Problem. Der Kaufpreis ist viel höher als bei normalen Autos. Wenn der Strom aus Kohle kommt, ist ein Elektroauto auch nicht wirklich gut für die Umwelt.',
      },
      {
        headline: 'Lieber mehr Bus und Bahn als Elektroautos',
        text: 'Wir reden zu viel über Autos und zu wenig darüber, ob wir wirklich so viele Autos brauchen. Investitionen in Busse, Bahnen und Fahrradwege wären besser für das Klima als viele Elektroautos. Ein guter öffentlicher Nahverkehr hilft allen Menschen — nicht nur denen, die sich ein neues Auto leisten können. Städte wie Wien zeigen, dass weniger Autos möglich ist und die Lebensqualität verbessert.',
      },
    ],
  },
  {
    theme: 'Stadt- oder Landleben',
    cards: [
      {
        headline: 'Großstadtleben: Alles nah, alles möglich',
        text: 'Das Leben in der Großstadt hat viele Vorteile. Es gibt viel Kultur, kurze Wege zur Arbeit und viele Menschen. Mit Bus und Bahn braucht man kein Auto. Es gibt mehr Jobangebote und oft bessere Gehälter. Besonders für junge Menschen ist die Stadt ein guter Ort: Man kann neue Ideen ausprobieren und viele Kontakte knüpfen. Deshalb ziehen immer mehr Menschen in die Städte.',
      },
      {
        headline: 'Raus aufs Land: Ruhe, Natur, Gemeinschaft',
        text: 'Immer mehr Menschen entscheiden sich für das Landleben — und sind sehr zufrieden damit. Die Mieten sind günstiger, und viele können sich ein eigenes Haus leisten. Kinder haben mehr Platz und können in der Natur aufwachsen. Mit Homeoffice muss man nicht mehr jeden Tag pendeln. Studien zeigen, dass Menschen auf dem Land oft gesünder und glücklicher sind — weniger Stress und bessere Luft.',
      },
      {
        headline: 'Kleinstädte: Das Beste aus Stadt und Land',
        text: 'Wer sich nicht zwischen Großstadt und Land entscheiden kann, sollte eine Kleinstadt anschauen. Mit 20.000 bis 100.000 Einwohnern bietet sie vieles von beiden: Kultur, günstige Wohnungen und echten Zusammenhalt. Es gibt guten öffentlichen Nahverkehr, und die Natur ist nah. Der Stress einer großen Stadt fehlt. Laut einer Umfrage sind Menschen in deutschen Kleinstädten besonders zufrieden mit ihrem Leben.',
      },
    ],
  },
  {
    theme: 'Haustiere in der Stadt',
    cards: [
      {
        headline: 'Haustiere machen glücklich — auch in der Stadt',
        text: 'Wissenschaftler sagen: Haustiere machen uns glücklich. Sie helfen gegen Stress und Einsamkeit. Für ältere Menschen sind Tiere oft sehr wichtig. Hunde bringen ihre Besitzer nach draußen — das ist gut für die Gesundheit. Kinder lernen durch Tiere Verantwortung und Mitgefühl. In deutschen Städten gibt es heute viele Parks und Grünflächen, wo man mit Haustieren spazieren gehen kann.',
      },
      {
        headline: 'Tiere in der Wohnung: Schwierig für alle',
        text: 'Haustiere in der Wohnung zu halten ist oft nicht gut für das Tier. Ein Hund, der den ganzen Tag allein in einer kleinen Wohnung ist, leidet. Lärm, Allergien und Probleme mit Nachbarn sind häufig. Die Kosten werden oft unterschätzt: Futter, Tierarzt und Pflege kosten pro Jahr sehr viel Geld. Viele Tiere landen im Tierheim, weil die Besitzer die Verantwortung nicht erwartet haben.',
      },
      {
        headline: 'Katzen: Das ideale Haustier für die Stadt',
        text: 'Ob ein Haustier in der Stadt passt, hängt sehr vom Tier ab. Hunde brauchen viel Platz und Bewegung — das ist in kleinen Wohnungen schwierig. Katzen sind viel besser geeignet: Sie brauchen keinen Auslauf und beschäftigen sich selbst. Katzen sind das beliebteste Haustier in Deutschland. Mit einem Kratzbaum und etwas Aufmerksamkeit am Abend sind sie glücklich und angenehme Mitbewohner.',
      },
    ],
  },
  {
    theme: 'Smartphones für Kinder',
    cards: [
      {
        headline: 'Smartphones für Kinder: Sicherheit und Lernen',
        text: 'Ein Smartphone ist für Kinder heute oft sehr nützlich. Eltern können ihre Kinder jederzeit anrufen — das ist ein gutes Sicherheitsgefühl für beide. Lern-Apps machen das Lernen interessant und bereiten Kinder auf die digitale Welt vor. Wer früh lernt, verantwortungsvoll mit dem Handy umzugehen, kann später besser mit Medien umgehen. Wichtig ist, wie Eltern und Lehrer die Kinder dabei begleiten.',
      },
      {
        headline: 'Zu viel Bildschirm — Kinder brauchen keine Smartphones',
        text: 'Immer mehr Studien zeigen: Smartphones sind gefährlich für Kinder. Bildschirmzeit verdrängt Bewegung, Kreativität und echte Freundschaften. Mobbing im Internet und Handysucht treffen Kinder besonders stark. Die Weltgesundheitsorganisation empfiehlt für Kinder unter fünf Jahren gar keine Bildschirmzeit. Kinder brauchen echte Erlebnisse, Bewegung und persönliche Beziehungen — kein Handy.',
      },
      {
        headline: 'Erst ab 12: Ein vernünftiger Kompromiss',
        text: 'Weder ein totales Verbot noch unbegrenzte Nutzung — Experten empfehlen klare Regeln. Kinder unter 12 Jahren sollten kein eigenes Smartphone haben. Ältere Kinder können ein Handy bekommen, aber mit festen Regeln: begrenzte Bildschirmzeit und kein Zugang zu sozialen Medien vor dem 14. Geburtstag. Frankreich hat Handys an Schulen verboten — mit positiven Ergebnissen. Das Problem ist nicht das Handy, sondern fehlende Begleitung.',
      },
    ],
  },
  {
    theme: 'Kostenloser Nahverkehr',
    cards: [
      {
        headline: 'Kostenloses Fahren: Gut für Klima und alle',
        text: 'Kostenloser öffentlicher Nahverkehr könnte vieles verändern. Weniger Autos bedeuten weniger Stau, Lärm und CO₂. Menschen mit wenig Geld würden sehr davon profitieren. Luxemburg hat diesen Schritt schon gemacht — mit guten Ergebnissen. Wenn der Nahverkehr kostenlos ist, steigen mehr Menschen vom Auto um. Das ist gut für alle.',
      },
      {
        headline: 'Gratis-Tickets lösen das Problem nicht',
        text: 'Kostenloser Nahverkehr klingt gut, ist aber nicht so einfach. "Kostenlos" bedeutet nur: Jemand anderes zahlt — in diesem Fall die Steuerzahler. Studien zeigen, dass kostenlose Tickets vor allem Fußgänger und Radfahrer zum Umsteigen bringen — nicht Autofahrer. Das eigentliche Problem bleibt: Das Angebot auf dem Land ist zu klein, Busse und Bahnen sind zu voll und zu unzuverlässig. Mehr Qualität wäre wichtiger.',
      },
      {
        headline: 'Günstig statt gratis: Ein kluger Mittelweg',
        text: 'Zwischen kostenlosem Nahverkehr und vollen Preisen gibt es einen guten Mittelweg: günstige Tickets. Das Neun-Euro-Ticket hat gezeigt, dass niedrige Preise viele Menschen zum Umsteigen bringen. Ein günstiges Jahresticket — zum Beispiel 29 Euro pro Monat — wäre für die meisten erschwinglich und ein guter Grund, das Auto öfter stehen zu lassen. Der Preis ist ein Problem — aber er muss nicht null sein, um zu helfen.',
      },
    ],
  },
  {
    theme: 'Tempolimit auf der Autobahn',
    cards: [
      {
        headline: 'Tempolimit: Sicherer und besser für die Umwelt',
        text: 'Deutschland ist eines der wenigen Länder ohne Tempolimit auf der Autobahn. Das sollte sich ändern. Ein Limit von 130 km/h würde CO₂ sparen. Experten sind sich einig: Langsamer fahren bedeutet kürzere Bremswege und weniger schwere Unfälle. In Frankreich und Österreich gibt es seit vielen Jahren Tempolimits — ohne Probleme. Sicherheit ist wichtiger als Freiheit auf der Autobahn.',
      },
      {
        headline: 'Freie Fahrt: Warum ein Tempolimit falsch wäre',
        text: 'Ein Tempolimit auf deutschen Autobahnen wäre ein unnötiger Eingriff. Deutsche Autobahnen sind sehr sicher — sie sind besonders gut gebaut. Die CO₂-Einsparung wäre sehr klein — weniger als ein Prozent der deutschen Gesamtemissionen. Moderne Autos sind für hohe Geschwindigkeiten gebaut. Wer wirklich die Umwelt schützen will, sollte lieber weniger fliegen.',
      },
      {
        headline: 'Flexibles Tempolimit: Eine clevere Lösung',
        text: 'Entweder immer Tempolimit oder immer freie Fahrt — das ist zu einfach gedacht. Viele Experten empfehlen ein flexibles System: 130 km/h als normales Limit, aber Ausnahmen auf gut gebauten Strecken. Computer können das Limit je nach Wetter und Verkehr automatisch anpassen. Das gibt es in anderen Ländern schon. So wird niemand unnötig eingeschränkt, und trotzdem sind Sicherheit und Umwelt geschützt.',
      },
    ],
  },
  {
    theme: 'Die Viertagewoche',
    cards: [
      {
        headline: 'Vier Tage arbeiten, glücklicher leben',
        text: 'Die Viertagewoche funktioniert. Große Studien in Island und Großbritannien zeigen: Mitarbeiter arbeiten an vier Tagen genauso viel wie an fünf — aber sie fühlen sich viel besser. Weniger Erschöpfung, weniger Krankheitstage. Ein freier Tag mehr ist gut für die Familie und für die Gesundheit. Firmen können damit außerdem leichter gute Mitarbeiter finden.',
      },
      {
        headline: 'Vier Tage — gut gemeint, aber nicht für alle',
        text: 'Die Viertagewoche ist nicht für alle Berufe möglich. Im Krankenhaus, im Supermarkt oder in der Gastronomie muss jemand fünf oder sieben Tage da sein. Wenn man die gleiche Arbeit auf vier Tage verteilt, ist jeder Tag anstrengender. Für viele bedeutet das mehr Druck, nicht weniger. Deutschland kann es sich kaum leisten, weniger zu arbeiten als andere Länder.',
      },
      {
        headline: 'Flexible Arbeitszeit: Besser als die Viertagewoche',
        text: 'Statt einer festen Viertagewoche fordern immer mehr Experten mehr Flexibilität. Wer selbst entscheiden kann, wann und wie er arbeitet, ist produktiver und zufriedener. Ergebnisse zählen — nicht Anwesenheitszeit. Studien zeigen: Nicht die Anzahl der Arbeitstage ist entscheidend, sondern die Kontrolle über die eigene Zeit. Flexible Arbeitszeit ist für viele Berufe besser geeignet als eine feste Viertagewoche.',
      },
    ],
  },
  {
    theme: 'Studieren im Ausland',
    cards: [
      {
        headline: 'Im Ausland studieren: Eine tolle Erfahrung',
        text: 'Ein Auslandssemester ist eine der besten Erfahrungen im Studium. Man lernt eine andere Kultur und eine Sprache kennen. Arbeitgeber schätzen Auslandserfahrung sehr — sie zeigt, dass man selbstständig und offen ist. Programme wie Erasmus+ geben Geld dazu, damit es auch für Menschen mit wenig Geld möglich ist. Nach einem Auslandssemester sieht man die Welt anders.',
      },
      {
        headline: 'Auslandsstudium: Stressig und oft schwierig',
        text: 'Studium im Ausland wird oft zu positiv gesehen. Es gibt viele Schwierigkeiten: Sprachprobleme und viel Papierkram bei der Anerkennung von Kursen. Viele Studierende kommen mit Verzögerung zurück, weil ihre Kurse nicht anerkannt werden. Manchmal fühlen sie sich unter Druck gesetzt — "du musst ins Ausland". Aber gute Bildung ist auch in Deutschland möglich, ohne die Familie lange zu verlassen.',
      },
      {
        headline: 'Praktikum im Ausland: Die clevere Alternative',
        text: 'Wer internationale Erfahrungen machen will, muss nicht ein ganzes Jahr im Ausland studieren. Ein Praktikum im Ausland — drei bis sechs Monate — ist oft besser. Man sammelt praktische Berufserfahrung, verbessert die Sprache und lernt eine andere Arbeitskultur kennen. Das finanzielle Risiko ist kleiner. Für viele Arbeitgeber ist praktische Auslandserfahrung sogar wichtiger als ein ausländisches Studienzeugnis.',
      },
    ],
  },
  {
    theme: 'Fast Fashion',
    cards: [
      {
        headline: 'Günstige Mode: Für alle erschwinglich',
        text: 'Günstige Mode ist wichtig. Früher konnten sich nur reiche Menschen neue Kleidung kaufen. Heute kann jeder modisch gekleidet sein, ohne viel Geld auszugeben. Für Familien mit wenig Geld ist günstige Kleidung sehr wichtig. Außerdem verbessert sich die Branche: Immer mehr Anbieter nutzen recycelte Materialien. Wer günstig kauft und Kleidung lange trägt, handelt durchaus vernünftig.',
      },
      {
        headline: 'Fast Fashion: Schlecht für Umwelt und Menschen',
        text: 'Fast Fashion ist eine der schlimmsten Industrien für die Umwelt. Die Modeindustrie verursacht acht Prozent der weltweiten CO₂-Emissionen — mehr als alle Flugzeuge und Schiffe zusammen. Viele Kleidungsstücke werden nie getragen und landen auf Mülldeponien. Für eine Jeans braucht man bis zu 8.000 Liter Wasser. Näherinnen in armen Ländern arbeiten für sehr wenig Geld. Das ist kein faires System.',
      },
      {
        headline: 'Die Lösung: Secondhand statt Fast Fashion',
        text: 'Die Antwort auf Fast Fashion muss keine teure Designerkleidung sein. Secondhand ist eine gute Lösung. Auf Plattformen wie Vinted oder in lokalen Secondhand-Läden findet man modische Kleidung zu günstigen Preisen — ohne neue Ressourcen zu verbrauchen. Man spart Geld und hilft der Umwelt gleichzeitig. Laut einer Umfrage kaufen fast 70 Prozent der unter 30-Jährigen regelmäßig gebrauchte Kleidung.',
      },
    ],
  },
  {
    theme: 'Schuluniformen',
    cards: [
      {
        headline: 'Schuluniform: Gleiche Chancen für alle',
        text: 'In vielen Ländern gibt es Schuluniformen — und das hat gute Gründe. Kleidung ist an deutschen Schulen oft ein Statussymbol: Teure Schuhe und Marken erzeugen Druck und Mobbing. Eine Schuluniform macht alle gleich und schafft ein Gemeinschaftsgefühl. Morgens muss man nicht lange überlegen, was man anzieht. Studien aus Großbritannien zeigen: Schulen mit Uniformen haben oft weniger Mobbing und ein besseres Lernklima.',
      },
      {
        headline: 'Schuluniform: Sie schränkt die Persönlichkeit ein',
        text: 'Schuluniformen klingen nach Gleichheit, aber sie schränken die Persönlichkeit ein. Kleidung ist Teil der Identität, besonders für Jugendliche. Sie sollen lernen, eigene Entscheidungen zu treffen — auch beim Anziehen. Die Kosten sind für manche Familien höher als normale Alltagskleidung. Außerdem kann man soziale Unterschiede nicht wirklich verstecken: Schuhe, Taschen und Handys bleiben sichtbare Statussymbole.',
      },
      {
        headline: 'Kleidungsregeln statt Uniform: Ein guter Mittelweg',
        text: 'Weder strenge Uniform noch keine Regeln — viele Schulen machen es besser mit einem Dresscode. Klare Regeln wie "keine großen Logos, dezente Farben, angemessene Kleidung" schaffen ein ruhigeres Schulklima, ohne die Persönlichkeit einzuschränken. Jugendliche können trotzdem ihren eigenen Stil zeigen. Dieses Modell ist in Großbritannien verbreitet und wird von Eltern und Schülern besser akzeptiert als eine komplette Uniform.',
      },
    ],
  },
  {
    theme: 'Tierversuche in der Forschung',
    cards: [
      {
        headline: 'Tierversuche retten Menschenleben',
        text: 'Tierversuche haben in der Medizin viele Menschenleben gerettet. Insulin, Antibiotika und viele Medikamente gegen Krebs wurden durch Tierversuche entwickelt. Kein anderes Modell kann den menschlichen Körper vollständig ersetzen. Labors arbeiten heute nach strengen ethischen Regeln. Ohne Tierversuche könnten neue Medikamente nicht sicher auf den Markt kommen. Die Forschung sucht nach Alternativen, aber sie sind noch nicht gut genug.',
      },
      {
        headline: 'Tierversuche: Grausam und oft nutzlos',
        text: 'Jedes Jahr sterben in Deutschland fast drei Millionen Tiere in Laborversuchen. Aber 90 Prozent der Substanzen, die in Tierversuchen sicher wirken, funktionieren beim Menschen trotzdem nicht. Die Unterschiede zwischen Tieren und Menschen sind zu groß. Moderne Alternativmethoden liefern oft bessere Ergebnisse. Es ist Zeit, weniger auf Tierversuche zu setzen und neue Methoden zu fördern.',
      },
      {
        headline: 'Neue Methoden: Die Zukunft der Forschung',
        text: 'Die Frage ist nicht, ob wir Tierversuche sofort abschaffen, sondern wie wir schneller zu besseren Methoden kommen. Computermodelle und neue Labortechnologien können in vielen Bereichen schon heute genauso gut testen wie Tierversuche. Die EU investiert viel Geld in diese neuen Methoden. Ein klares Ziel für den schrittweisen Ausstieg aus Tierversuchen würde die Forschung in die richtige Richtung lenken.',
      },
    ],
  },
  {
    theme: 'Online-Shopping',
    cards: [
      {
        headline: 'Online-Shopping: Bequem und günstig',
        text: 'Online-Shopping macht das Leben einfacher. Man kann zu jeder Zeit von zu Hause aus einkaufen — auch nachts oder am Sonntag. Die Preise sind oft günstiger als im Geschäft, und man kann leicht vergleichen. Besonders für Menschen auf dem Land oder mit wenig Zeit ist das ideal. Die Ware kommt direkt nach Hause, und wenn etwas nicht passt, kann man es einfach zurückschicken.',
      },
      {
        headline: 'Online-Shopping: Schlecht für Städte und Umwelt',
        text: 'Online-Shopping hat auch viele Nachteile. Immer mehr kleine Geschäfte in den Innenstädten müssen schließen, weil die Menschen online kaufen. Das macht die Städte leer und unattraktiv. Außerdem entsteht viel Müll durch Verpackungen, und die vielen Lieferautos verschmutzen die Luft. Viele Pakete werden zurückgeschickt — das ist teuer und schlecht für die Umwelt. Im Geschäft kann man die Ware vorher anfassen und sofort mitnehmen.',
      },
      {
        headline: 'Beides kombinieren: online und im Geschäft',
        text: 'Man muss sich nicht zwischen online und Geschäft entscheiden. Viele Menschen schauen sich Produkte erst im Internet an und kaufen sie dann im Laden — oder umgekehrt. Für große oder wichtige Dinge geht man besser ins Geschäft und lässt sich beraten. Für einfache Sachen ist Online-Shopping praktisch. Wer bewusst einkauft und nicht alles bestellt, kann beide Vorteile nutzen und trotzdem die lokalen Geschäfte unterstützen.',
      },
    ],
  },
  {
    theme: 'E-Books oder gedruckte Bücher',
    cards: [
      {
        headline: 'E-Books: Praktisch und platzsparend',
        text: 'E-Books haben viele Vorteile. Auf einem kleinen E-Reader kann man Hunderte Bücher speichern — perfekt für den Urlaub. Man braucht kein schweres Buch mehr zu tragen. E-Books sind oft günstiger und sofort verfügbar: Man kauft ein Buch und kann gleich anfangen zu lesen. Man kann die Schrift größer machen und auch im Dunkeln lesen. Außerdem spart man Papier und schont so die Umwelt.',
      },
      {
        headline: 'Gedruckte Bücher: Das echte Leseerlebnis',
        text: 'Ein gedrucktes Buch ist durch nichts zu ersetzen. Viele Menschen lieben es, eine Seite umzublättern und den Geruch von Papier. Man bekommt keine Kopfschmerzen vom Bildschirm und ist nicht abgelenkt von Nachrichten. Ein gedrucktes Buch braucht keinen Strom und keine Batterie. Man kann es leicht verschenken oder weitergeben. Studien zeigen außerdem, dass man Texte auf Papier oft besser versteht und behält.',
      },
      {
        headline: 'Beides hat seinen Platz',
        text: 'E-Books und gedruckte Bücher schließen sich nicht aus. Viele Menschen nutzen E-Books auf Reisen oder für die Arbeit und lesen zu Hause lieber gedruckte Bücher. Es kommt auf die Situation an. Wichtig ist vor allem, dass man überhaupt liest — egal in welcher Form. Wer flexibel ist, kann die Vorteile beider Formate genießen.',
      },
    ],
  },
  {
    theme: 'Bargeldlos bezahlen',
    cards: [
      {
        headline: 'Ohne Bargeld: Schnell und modern',
        text: 'Mit Karte oder Handy zu bezahlen ist schnell und praktisch. Man muss kein Geld mehr zählen und kein Wechselgeld zurückbekommen. Das spart Zeit an der Kasse. Man muss auch nicht zur Bank gehen, um Geld abzuheben. Bei Diebstahl kann man die Karte sofort sperren — bei Bargeld ist das Geld einfach weg. In vielen Ländern ist bargeldloses Bezahlen schon ganz normal.',
      },
      {
        headline: 'Bargeld: Sicher und für alle da',
        text: 'Bargeld hat wichtige Vorteile. Man behält besser den Überblick über sein Geld, weil man sieht, wie viel man ausgibt. Beim Bezahlen mit Karte werden viele Daten gespeichert — das ist schlecht für den Datenschutz. Nicht alle Menschen haben eine Karte oder ein Smartphone, zum Beispiel ältere Menschen. Und wenn der Strom oder das Internet ausfällt, kann man nur noch mit Bargeld bezahlen.',
      },
      {
        headline: 'Beide Möglichkeiten anbieten',
        text: 'Am besten sollte man überall mit Karte und mit Bargeld bezahlen können. So kann jeder selbst entscheiden, was er lieber nutzt. Für kleine Beträge ist Bargeld oft praktisch, für große Beträge die Karte. Niemand sollte gezwungen werden, nur auf eine Art zu bezahlen. Ein Nebeneinander von beiden Möglichkeiten ist die fairste Lösung für alle.',
      },
    ],
  },
  {
    theme: 'Computerspiele',
    cards: [
      {
        headline: 'Computerspiele: Mehr als nur Zeitvertreib',
        text: 'Computerspiele werden oft kritisiert, aber sie haben viele Vorteile. Sie machen Spaß und helfen, nach einem stressigen Tag zu entspannen. Viele Spiele fördern logisches Denken, Reaktion und Kreativität. Online-Spiele verbinden Menschen aus der ganzen Welt — man spielt zusammen und findet Freunde. Manche Spiele sind sogar auf Englisch und helfen so beim Sprachenlernen. E-Sport ist heute ein richtiger Beruf geworden.',
      },
      {
        headline: 'Computerspiele: Gefahr von Sucht und Isolation',
        text: 'Zu viele Computerspiele können gefährlich sein. Manche Menschen, besonders Jugendliche, spielen so viel, dass sie Schule, Sport und echte Freunde vergessen. Sie sitzen stundenlang vor dem Bildschirm und bewegen sich zu wenig. Manche Spiele sind sehr gewalttätig. Außerdem kosten viele Spiele heute extra Geld, und Kinder geben oft zu viel aus. Sucht nach Computerspielen ist ein echtes Problem geworden.',
      },
      {
        headline: 'Mit Maß und Regeln spielen',
        text: 'Computerspiele sind weder nur gut noch nur schlecht — es kommt auf das richtige Maß an. Wer klare Zeiten festlegt und auch andere Hobbys hat, für den sind Spiele eine schöne Freizeitbeschäftigung. Besonders bei Kindern sollten Eltern darauf achten, welche Spiele gespielt werden und wie lange. Bewegung, Freunde und Schule müssen weiter wichtig bleiben. Mit guten Regeln sind Computerspiele kein Problem.',
      },
    ],
  },
  {
    theme: 'Künstliche Intelligenz im Alltag',
    cards: [
      {
        headline: 'KI: Eine große Hilfe im Alltag',
        text: 'Künstliche Intelligenz macht unser Leben einfacher. Sie hilft beim Übersetzen, beim Schreiben von Texten und beim Suchen von Informationen. In der Medizin kann KI Krankheiten früh erkennen und so Leben retten. Im Auto warnt sie vor Gefahren. Viele langweilige Aufgaben kann die KI übernehmen, sodass Menschen mehr Zeit für wichtige Dinge haben. KI ist ein nützliches Werkzeug für die Zukunft.',
      },
      {
        headline: 'KI: Wir verlieren die Kontrolle',
        text: 'Künstliche Intelligenz bringt auch große Gefahren. Viele Menschen haben Angst, dass die KI ihre Arbeitsplätze wegnimmt. Manche Texte und Bilder von der KI sind falsch, aber sehen echt aus — so verbreiten sich Lügen. Außerdem sammelt KI viele persönliche Daten. Wenn wir uns zu sehr auf die KI verlassen, verlernen wir vielleicht, selbst zu denken. Es ist gefährlich, wenn Maschinen wichtige Entscheidungen für uns treffen.',
      },
      {
        headline: 'KI nutzen, aber mit klaren Regeln',
        text: 'Künstliche Intelligenz wird nicht verschwinden — deshalb müssen wir lernen, gut mit ihr umzugehen. KI kann uns helfen, aber der Mensch muss die Kontrolle behalten. Wir brauchen klare Gesetze, die zum Beispiel den Datenschutz und die Sicherheit regeln. In der Schule sollte man lernen, die KI sinnvoll und kritisch zu nutzen. So können wir die Vorteile nutzen und die Risiken begrenzen.',
      },
    ],
  },
  {
    theme: 'Online-Unterricht oder Präsenzunterricht',
    cards: [
      {
        headline: 'Online lernen: Flexibel und bequem',
        text: 'Online-Unterricht hat viele Vorteile. Man kann von zu Hause aus lernen und spart die Zeit für den Weg zur Schule. Das ist besonders gut für Menschen, die weit weg wohnen oder arbeiten. Viele Kurse kann man aufnehmen und später noch einmal anschauen. Man kann in seinem eigenen Tempo lernen. Online-Kurse sind oft auch günstiger, und man kann an Kursen aus der ganzen Welt teilnehmen.',
      },
      {
        headline: 'Präsenzunterricht: Echter Kontakt zählt',
        text: 'Im Klassenzimmer lernt man oft besser als allein zu Hause. Man kann dem Lehrer sofort Fragen stellen und bekommt direkt eine Antwort. Der Kontakt zu anderen Lernenden ist wichtig: Man motiviert sich gegenseitig und macht Übungen zusammen. Besonders beim Sprechenlernen ist der persönliche Kontakt sehr wichtig. Zu Hause gibt es oft Ablenkungen, und manche Menschen verlieren die Motivation, wenn sie allein lernen.',
      },
      {
        headline: 'Die Mischung macht es: Blended Learning',
        text: 'Die beste Lösung ist oft eine Mischung aus beidem. Theorie und einfache Themen kann man gut online lernen. Für Diskussionen, Sprechübungen und Fragen trifft man sich im Klassenzimmer. So spart man Zeit und hat trotzdem den wichtigen persönlichen Kontakt. Viele Schulen und Universitäten nutzen heute dieses Modell. Es verbindet die Flexibilität des Online-Lernens mit den Vorteilen des Präsenzunterrichts.',
      },
    ],
  },
  {
    theme: 'Ehrenamt und freiwillige Arbeit',
    cards: [
      {
        headline: 'Ehrenamt: Gut für die Gesellschaft und für uns selbst',
        text: 'Freiwillige Arbeit ist für alle wertvoll. Menschen, die ehrenamtlich helfen, unterstützen andere — zum Beispiel ältere Menschen, Flüchtlinge oder Kinder. Gleichzeitig tut es einem selbst gut: Man lernt neue Leute kennen, sammelt Erfahrungen und fühlt sich nützlich. Viele Bereiche wie Sportvereine oder die Feuerwehr funktionieren nur, weil Menschen freiwillig helfen. Ehrenamt macht die Gesellschaft stärker und menschlicher.',
      },
      {
        headline: 'Ehrenamt: Eine Aufgabe für den Staat',
        text: 'Ehrenamt ist gut gemeint, aber es gibt Probleme. Viele wichtige Aufgaben werden von Freiwilligen gemacht, obwohl der Staat dafür verantwortlich sein sollte. So spart der Staat Geld auf Kosten der Helfer. Nicht jeder hat Zeit für ein Ehrenamt — wer viel arbeitet oder Kinder hat, kann das oft nicht. Manche Menschen fühlen sich auch unter Druck gesetzt zu helfen. Wichtige Arbeit sollte fair bezahlt werden.',
      },
      {
        headline: 'Ehrenamt fördern und anerkennen',
        text: 'Ehrenamt ist wichtig, aber Freiwillige sollten nicht allein gelassen werden. Der Staat sollte das Ehrenamt unterstützen — zum Beispiel mit Geld für Material oder mit Versicherungen. Auch Anerkennung ist wichtig: Wer hilft, sollte gelobt werden, etwa mit einem Zertifikat. Gleichzeitig muss der Staat seine eigenen Aufgaben erfüllen. So bleibt Ehrenamt eine freiwillige und schöne Sache und wird nicht zur Pflicht.',
      },
    ],
  },
  {
    theme: 'Urlaub im eigenen Land oder im Ausland',
    cards: [
      {
        headline: 'Urlaub im eigenen Land: Schön und nachhaltig',
        text: 'Urlaub im eigenen Land hat viele Vorteile. Man muss nicht weit fahren und spart so Zeit und Geld. Es gibt keine Sprachprobleme, und man kennt das Essen und die Kultur. Außerdem ist es besser für die Umwelt, weil man nicht fliegen muss. Man unterstützt die Wirtschaft im eigenen Land. Oft kennt man die schönen Orte direkt vor der Haustür gar nicht — es gibt viel zu entdecken.',
      },
      {
        headline: 'Urlaub im Ausland: Neue Welten entdecken',
        text: 'Eine Reise ins Ausland ist eine besondere Erfahrung. Man lernt fremde Kulturen, neue Sprachen und anderes Essen kennen. Das erweitert den eigenen Horizont und macht offener für andere Menschen. In vielen Ländern gibt es Sonne und Strand, die es zu Hause nicht gibt. Man kann berühmte Sehenswürdigkeiten besuchen. Solche Reisen bleiben oft das ganze Leben in Erinnerung.',
      },
      {
        headline: 'Auf die Reise kommt es an, nicht auf die Entfernung',
        text: 'Ob im eigenen Land oder im Ausland — beide Arten von Urlaub haben ihren Wert. Es kommt darauf an, was man möchte. Wer Ruhe und Erholung sucht, findet das auch in der Nähe. Wer Abenteuer und neue Kulturen will, fährt ins Ausland. Man kann beides kombinieren: mal eine große Reise, mal Urlaub in der Nähe. Wichtig ist, dass man sich erholt und schöne Momente erlebt.',
      },
    ],
  },
]

// ─── Teil 3 tasks — Gemeinsam etwas planen ────────────────────────────────────

const TEIL3_TASKS = [
  {
    task: 'Abschiedsfeier für eine Kollegin planen',
    situation: 'Eine Kollegin aus Ihrem Deutschkurs zieht in eine andere Stadt. Sie möchten zusammen eine Abschiedsfeier für sie organisieren.',
    points: ['Wann und wo soll die Feier stattfinden?', 'Wen möchten Sie einladen?', 'Was soll es zu essen und zu trinken geben?', 'Welches Geschenk kaufen Sie?', 'Wer übernimmt welche Aufgabe?'],
  },
  {
    task: 'Gemeinsamen Ausflug planen',
    situation: 'Sie möchten am Wochenende zusammen einen Tagesausflug machen.',
    points: ['Wohin möchten Sie fahren?', 'Wie kommen Sie dorthin (Auto, Zug, Bus)?', 'Was möchten Sie dort unternehmen?', 'Was müssen Sie mitnehmen?', 'Wie viel darf der Ausflug kosten?'],
  },
  {
    task: 'Geburtstagsgeschenk für einen Freund aussuchen',
    situation: 'Ein gemeinsamer Freund hat bald Geburtstag. Sie möchten ihm zusammen ein Geschenk kaufen.',
    points: ['Was könnte ihm gefallen?', 'Wie viel Geld möchten Sie ausgeben?', 'Wo kaufen Sie das Geschenk?', 'Wer kauft es und bis wann?', 'Wie und wann übergeben Sie das Geschenk?'],
  },
  {
    task: 'Gemeinsam für die Prüfung lernen',
    situation: 'Sie haben in vier Wochen die B1-Prüfung. Sie möchten zusammen einen Lernplan machen.',
    points: ['Wie oft und wann treffen Sie sich zum Lernen?', 'Wo lernen Sie (Bibliothek, Café, zu Hause)?', 'Welche Themen muss jeder noch üben?', 'Wie üben Sie das Sprechen?', 'Was machen Sie, wenn jemand keine Zeit hat?'],
  },
  {
    task: 'Picknick im Park organisieren',
    situation: 'Das Wetter soll am Samstag schön werden. Sie möchten mit Ihrem Kurs ein Picknick im Park machen.',
    points: ['In welchem Park treffen Sie sich und um wie viel Uhr?', 'Wer bringt was zu essen und zu trinken mit?', 'Welche Spiele oder Aktivitäten planen Sie?', 'Was machen Sie bei schlechtem Wetter?', 'Wie informieren Sie die anderen Kursteilnehmer?'],
  },
  {
    task: 'Neuen Mitbewohner suchen',
    situation: 'In Ihrer WG ist ein Zimmer frei geworden. Sie suchen zusammen einen neuen Mitbewohner.',
    points: ['Wie soll der neue Mitbewohner sein?', 'Wo veröffentlichen Sie die Anzeige?', 'Wie hoch soll die Miete sein?', 'Wann machen Sie die Besichtigungstermine?', 'Wie entscheiden Sie sich am Ende?'],
  },
  {
    task: 'Überraschungsparty organisieren',
    situation: 'Eine gute Freundin hat ihre B2-Prüfung bestanden. Sie möchten eine Überraschungsparty für sie organisieren.',
    points: ['Wo und wann findet die Party statt?', 'Wie locken Sie die Freundin dorthin, ohne dass sie etwas merkt?', 'Wen laden Sie ein?', 'Was brauchen Sie für die Party (Essen, Musik, Dekoration)?', 'Wer organisiert was?'],
  },
  {
    task: 'Gemeinsamen Sportkurs auswählen',
    situation: 'Sie möchten zusammen mehr Sport machen und suchen einen passenden Kurs.',
    points: ['Welche Sportart passt zu Ihnen beiden/allen?', 'Wie oft pro Woche möchten Sie trainieren?', 'Wann haben alle Zeit?', 'Wie viel darf der Kurs kosten?', 'Wo melden Sie sich an?'],
  },
  {
    task: 'Wochenendtrip in eine andere Stadt planen',
    situation: 'Sie haben ein verlängertes Wochenende frei und möchten zusammen eine deutsche Stadt besuchen.',
    points: ['Welche Stadt möchten Sie besuchen?', 'Wie reisen Sie und wo übernachten Sie?', 'Was möchten Sie dort besichtigen?', 'Wie hoch ist Ihr Budget?', 'Wer kümmert sich um die Buchungen?'],
  },
  {
    task: 'Internationalen Kochabend veranstalten',
    situation: 'Ihr Deutschkurs möchte einen Abend organisieren, an dem alle Gerichte aus ihren Heimatländern mitbringen.',
    points: ['Wann und wo findet der Kochabend statt?', 'Wer bringt welches Gericht mit?', 'Was brauchen Sie noch (Geschirr, Getränke, Musik)?', 'Wie teilen Sie die Kosten?', 'Wie laden Sie alle Teilnehmer ein?'],
  },
  {
    task: 'Hilfe für einen kranken Nachbarn organisieren',
    situation: 'Ein älterer Nachbar ist krank und braucht in den nächsten zwei Wochen Unterstützung.',
    points: ['Wie können Sie dem Nachbarn helfen (Einkaufen, Kochen, Apotheke)?', 'Wer hat wann Zeit?', 'Wie erstellen Sie einen Plan?', 'Was machen Sie in einem Notfall?', 'Wen können Sie noch um Hilfe bitten?'],
  },
  {
    task: 'Deutschen Filmabend planen',
    situation: 'Sie möchten mit Ihrem Kurs einen Filmabend mit deutschen Filmen organisieren, um das Hörverstehen zu üben.',
    points: ['Welchen Film schauen Sie (mit oder ohne Untertitel)?', 'Wo und wann findet der Filmabend statt?', 'Was gibt es zu essen und zu trinken?', 'Wie viele Personen laden Sie ein?', 'Sprechen Sie danach über den Film? Wie?'],
  },
  {
    task: 'Fahrradtour am Wochenende planen',
    situation: 'Sie möchten am Sonntag zusammen eine Fahrradtour machen.',
    points: ['Welche Route fahren Sie und wie lang soll sie sein?', 'Wo treffen Sie sich und um wie viel Uhr?', 'Was nehmen Sie mit (Essen, Werkzeug, Erste Hilfe)?', 'Was machen Sie, wenn jemand kein Fahrrad hat?', 'Wo machen Sie Pause?'],
  },
  {
    task: 'Sommerfest für den Sprachkurs organisieren',
    situation: 'Das Semester endet bald. Ihr Kurs möchte ein Sommerfest organisieren.',
    points: ['Wann und wo feiern Sie?', 'Wen laden Sie ein (auch Lehrer, Familien)?', 'Welches Programm planen Sie (Musik, Spiele, Reden)?', 'Wer bringt was mit?', 'Wie hoch sind die Kosten pro Person?'],
  },
  {
    task: 'Gemeinsam ein Zimmer renovieren',
    situation: 'Ein Freund ist umgezogen und braucht Hilfe beim Renovieren seines neuen Zimmers.',
    points: ['Wann haben Sie beide/alle Zeit zu helfen?', 'Was muss gemacht werden (streichen, Möbel aufbauen)?', 'Welches Material und Werkzeug brauchen Sie?', 'Wer kann was besonders gut?', 'Wie bedankt sich Ihr Freund (z. B. gemeinsames Essen)?'],
  },
  {
    task: 'Besuch aus dem Ausland — Programm planen',
    situation: 'Ein Freund aus Ihrem Heimatland besucht Sie für drei Tage. Sie planen zusammen das Programm.',
    points: ['Was zeigen Sie ihm in Ihrer Stadt?', 'Welches Essen soll er probieren?', 'Was unternehmen Sie am Abend?', 'Wie teuer darf das Programm sein?', 'Was machen Sie bei schlechtem Wetter?'],
  },
  {
    task: 'Spendenaktion organisieren',
    situation: 'Sie möchten mit Ihrem Kurs Geld für einen guten Zweck sammeln.',
    points: ['Für welchen Zweck sammeln Sie?', 'Wie sammeln Sie das Geld (Kuchenverkauf, Flohmarkt, Spendenlauf)?', 'Wann und wo findet die Aktion statt?', 'Wer übernimmt welche Aufgabe?', 'Wie informieren Sie andere Leute über die Aktion?'],
  },
  {
    task: 'Flohmarktstand organisieren',
    situation: 'Sie möchten zusammen auf dem Stadtflohmarkt alte Sachen verkaufen.',
    points: ['Was möchten Sie verkaufen?', 'Wann und wo findet der Flohmarkt statt?', 'Wie viel kostet ein Stand und wie teilen Sie die Kosten?', 'Wer steht wann am Stand?', 'Was machen Sie mit den Sachen, die nicht verkauft werden?'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PERSON_LABELS = ['A', 'B', 'C']

const CARD_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
]

function randomPick(arr, exclude) {
  let pick
  do {
    pick = arr[Math.floor(Math.random() * arr.length)]
  } while (arr.length > 1 && pick === exclude)
  return pick
}

// ─── Example dialogue (Gemini) ──────────────────────────────────────────────────

async function generateDialog(promptText) {
  if (!GEMINI_URL) throw new Error('no_api_key')
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2000 },
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

function teil2Prompt(debate, persons) {
  const cards = debate.cards.slice(0, persons)
  const speakers = PERSON_LABELS.slice(0, persons).join(', ')
  return `You are a German B1 teacher. Create a MODEL example dialogue for TELC B1 Sprechen Teil 2 "Gespräch über ein Thema".
Topic: ${debate.theme}
There are ${persons} speakers (${speakers}). Each has read a short article from a DIFFERENT perspective:
${cards.map((c, i) => `Speaker ${PERSON_LABELS[i]} — "${c.headline}": ${c.text}`).join('\n')}

Write a natural SPOKEN dialogue in German at a REALISTIC CEFR B1 level — like good B1 learners would really speak, NOT native speakers and NOT B2/C1. Each speaker first briefly summarizes their own article in their OWN simple words (1-2 sentences), then they discuss the topic together: share opinions, agree and disagree politely, ask each other questions, and give personal examples. STRICT LANGUAGE RULES: use simple everyday words and short sentences; use only basic connectors (und, aber, weil, denn, deshalb, dann, trotzdem, außerdem); avoid rare or abstract vocabulary, idioms, Passiv and complicated grammar. Use typical spoken B1 phrases (Ich finde, dass …; Das sehe ich anders …; Wie ist das bei dir?). Keep each turn 1-3 sentences. 10-14 turns total, alternating speakers.

Return ONLY valid JSON (no markdown, no extra text):
{"dialog":[{"speaker":"A","text":"..."},{"speaker":"B","text":"..."}]}`
}

function teil3Prompt(teil3, persons) {
  const speakers = PERSON_LABELS.slice(0, persons).join(', ')
  return `You are a German B1 teacher. Create a MODEL example dialogue for TELC B1 Sprechen Teil 3 "Gemeinsam etwas planen".
Task: ${teil3.task}
Situation: ${teil3.situation}
There are ${persons} speakers (${speakers}). They must discuss and agree on ALL of these points:
${teil3.points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Write a natural SPOKEN dialogue in German at a REALISTIC CEFR B1 level — like good B1 learners would really speak, NOT native speakers and NOT B2/C1. The speakers make suggestions, react to each other, negotiate, and reach a concrete agreement that covers EVERY point above. STRICT LANGUAGE RULES: use simple everyday words and short sentences; use only basic connectors (und, aber, weil, denn, deshalb, dann, trotzdem, außerdem); avoid rare or abstract vocabulary, idioms, Passiv and complicated grammar. Use typical planning phrases (Ich schlage vor, dass …; Wie wäre es, wenn …?; Einverstanden!; Das finde ich gut, weil …). End with one turn that briefly summarizes the agreed plan. Keep each turn 1-3 sentences. 10-14 turns total, alternating speakers.

Return ONLY valid JSON (no markdown, no extra text):
{"dialog":[{"speaker":"A","text":"..."},{"speaker":"B","text":"..."}]}`
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Sprechen() {
  const [tab, setTab] = useState('practice')

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Sprechen</h1>
      <p className="text-base text-gray-400 mb-8">TELC B1 Speaking Practice</p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['practice', 'Practice'], ['tips', 'Speaking Tips']].map(([key, label]) => (
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

      {tab === 'practice' ? <PracticeTab /> : <TipsTab />}
    </div>
  )
}

// ─── Practice tab ─────────────────────────────────────────────────────────────

function PracticeTab() {
  const [persons, setPersons] = useState(2)
  const [debate, setDebate] = useState(null)
  const [teil3, setTeil3] = useState(null)

  const generate = () => {
    setDebate(d => randomPick(TEIL2_DEBATES, d))
    setTeil3(t => randomPick(TEIL3_TASKS, t))
  }

  return (
    <div className="space-y-5">
      {/* Setup card */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-sm font-semibold text-gray-500 mb-3">How many people are practicing?</p>
        <div className="flex gap-2 mb-5">
          {[2, 3].map(n => (
            <button
              key={n}
              onClick={() => setPersons(n)}
              className={`flex-1 py-3 rounded-2xl text-base font-semibold transition-all ${
                persons === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {n} people
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          {debate ? 'Generate new topics' : 'Generate topics'}
        </button>
      </div>

      {debate && (
        <>
          {/* Teil 2 — article cards */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">TELC B1 · Sprechen · Teil 2</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                Gespräch über ein Thema
              </span>
            </div>
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Thema: {debate.theme}</h2>
              <p className="text-sm text-gray-500 mb-5">
                Jede Person liest ihren Text, berichtet kurz darüber und tauscht sich dann gemeinsam über das Thema aus.
              </p>

              <div className={`grid gap-4 mb-5 ${persons === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {debate.cards.slice(0, persons).map((card, i) => {
                  const color = CARD_COLORS[i]
                  return (
                    <div key={i} className={`border ${color.border} rounded-2xl overflow-hidden`}>
                      <div className={`flex items-center gap-2 px-4 py-2.5 ${color.bg} border-b ${color.border}`}>
                        <span className={`text-xs font-bold uppercase tracking-widest ${color.text}`}>
                          Karte {PERSON_LABELS[i]}
                        </span>
                        <span className="text-xs text-gray-400">· Person {PERSON_LABELS[i]}</span>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{card.headline}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{card.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Vorbereitungszeit: ca. 2 Minuten. Dauer: <strong className="text-gray-700">ca. 5 Minuten</strong>.
                </p>
              </div>

              <DialogBlock
                key={`t2-${debate.theme}-${persons}`}
                persons={persons}
                buildPrompt={() => teil2Prompt(debate, persons)}
              />
            </div>
          </div>

          {/* Teil 3 card */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">TELC B1 · Sprechen · Teil 3</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                Gemeinsam etwas planen
              </span>
            </div>
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{teil3.task}</h2>
              <p className="text-base text-gray-700 leading-relaxed mb-5">
                {teil3.situation} Planen Sie {persons === 2 ? 'zu zweit' : 'zu dritt'}, was Sie machen wollen.
              </p>
              <p className="text-sm font-semibold text-gray-500 mb-3">Besprechen Sie folgende Punkte:</p>
              <ul className="space-y-2.5 mb-6">
                {teil3.points.map((p, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-gray-400 font-medium mt-0.5 select-none flex-shrink-0">–</span>
                    <span className="text-base text-gray-800 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-dashed border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Machen Sie Vorschläge und reagieren Sie auf die Vorschläge der anderen. Finden Sie am Ende eine gemeinsame Lösung. Dauer: <strong className="text-gray-700">ca. 5 Minuten</strong>.
                </p>
              </div>

              <DialogBlock
                key={`t3-${teil3.task}-${persons}`}
                persons={persons}
                buildPrompt={() => teil3Prompt(teil3, persons)}
              />
            </div>
          </div>

          {/* Role assignment */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Roles for this round</p>
            <div className={`grid gap-3 ${persons === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {PERSON_LABELS.slice(0, persons).map((label, i) => (
                <div key={label} className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center mx-auto mb-2 ${CARD_COLORS[i].badge}`}>
                    {label}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {i === 0
                      ? 'Reads Karte A. Summarizes their article first and opens the discussion.'
                      : i === 1
                        ? 'Reads Karte B. Summarizes their article and makes the first suggestion in Teil 3.'
                        : 'Reads Karte C. Summarizes their article and helps bring the discussion to a conclusion.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Example dialogue block ─────────────────────────────────────────────────────

function DialogBlock({ persons, buildPrompt }) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [dialog, setDialog] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    setStatus('loading')
    setError(null)
    try {
      const result = await generateDialog(buildPrompt())
      setDialog(result.dialog || [])
      setStatus('done')
    } catch (e) {
      setError(e.message === 'no_api_key' ? 'api_key' : e.message)
      setStatus('error')
    }
  }

  if (status === 'done' && dialog) {
    return (
      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Beispieldialog — Example dialogue</p>
          <button onClick={load} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Regenerate
          </button>
        </div>
        <div className="space-y-3">
          {dialog.map((turn, i) => {
            const ci = PERSON_LABELS.indexOf(turn.speaker)
            const color = CARD_COLORS[ci >= 0 ? ci : 0]
            return (
              <div key={i} className="flex gap-3">
                <span className={`w-8 h-8 rounded-full flex-shrink-0 font-bold text-sm flex items-center justify-center ${color.badge}`}>
                  {turn.speaker}
                </span>
                <p className="text-sm text-gray-800 leading-relaxed bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-2.5 flex-1">
                  {turn.text}
                </p>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4 italic">
          AI-generated model dialogue. Use it as inspiration — your own examples and reactions score best.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      {error === 'api_key' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 mb-3">
          <strong>API key missing.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file and rebuild.
        </div>
      )}
      {error && error !== 'api_key' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 mb-3">
          Gemini error: {error}. Please try again.
        </div>
      )}
      <button
        onClick={load}
        disabled={status === 'loading' || !GEMINI_API_KEY}
        className="w-full py-3.5 border-2 border-indigo-200 text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Beispieldialog wird erstellt …
          </>
        ) : '💬 Show example dialogue'}
      </button>
    </div>
  )
}

// ─── Tips tab ─────────────────────────────────────────────────────────────────

function TipsTab() {
  return (
    <div className="space-y-5">

      {/* Exam structure */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">TELC B1 Sprechen — Exam Structure (75 pts)</h2>
        <div className="space-y-3">
          {[
            { teil: 'Teil 1', name: 'Kontaktaufnahme', time: '~2–3 min', desc: 'Introduce yourself: name, origin, family, work/study, languages, hobbies. The examiner may ask one or two follow-up questions.' },
            { teil: 'Teil 2', name: 'Gespräch über ein Thema', time: '~5 min', desc: 'Each participant receives a short article on the same topic — but from a different angle. Summarize your article, listen to your partner\'s summary, then discuss the topic freely and share your own opinions and experiences.' },
            { teil: 'Teil 3', name: 'Gemeinsam etwas planen', time: '~5 min', desc: 'You receive a planning task. Make suggestions, react to your partner\'s ideas, negotiate, and agree on a concrete plan together.' },
          ].map(t => (
            <div key={t.teil} className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="text-indigo-600 font-bold">{t.teil}</span>
                <span className="font-bold text-gray-900">{t.name}</span>
                <span className="text-gray-400 text-xs">{t.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Preparation time: 20 minutes (with notes allowed). The exam itself takes ~15 minutes and is usually done in pairs.
        </p>
      </div>

      {/* Teil 1 deep-dive */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-indigo-600 font-bold">Teil 1</span>
          <h2 className="text-base font-bold text-gray-800">Kontaktaufnahme — sich vorstellen</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          You introduce yourself to your partner. This part is fixed and easy to prepare — learn a few solid sentences and you start the exam with confidence.
        </p>

        {/* Sie oder du? */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
          <p className="text-sm font-bold text-amber-800 mb-1.5">Sie oder du? 🤔</p>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Your exam partner is another learner, usually around your age, so <strong>„du" is normal and accepted</strong> in Teil 1–3. If your partner is clearly older or you feel unsure, <strong>„Sie" is the safe choice</strong> and never wrong.
          </p>
          <p className="text-xs text-amber-900/80 leading-relaxed mt-2">
            The one real rule: <strong>pick one and stay consistent</strong>. Mixing „du" and „Sie" with the same person is the most common mistake. Decide in the first sentence — e.g. <em>„Sollen wir uns duzen?"</em> — and keep it for the whole exam. With the <strong>examiner</strong>, always use „Sie".
          </p>
        </div>

        {/* What to mention */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Mention these points:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['Name', 'Ich heiße … / Mein Name ist …'],
            ['Herkunft', 'Ich komme aus … / Ich bin in … geboren.'],
            ['Wohnort', 'Ich wohne jetzt in / seit … in …'],
            ['Familie', 'Ich bin verheiratet / ledig / habe … Kinder.'],
            ['Beruf / Studium', 'Ich arbeite als … / Ich studiere …'],
            ['Sprachen', 'Ich spreche … und lerne Deutsch seit …'],
            ['Hobbys', 'In meiner Freizeit … / Ich interessiere mich für …'],
            ['Warum Deutsch?', 'Ich lerne Deutsch, weil …'],
          ].map(([label, ex]) => (
            <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-xs font-bold text-gray-700">{label}</p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{ex}</p>
            </div>
          ))}
        </div>

        {/* How to ask du/Sie */}
        <p className="text-sm font-semibold text-gray-800 mb-2">How to ask „du" or „Sie":</p>
        <div className="space-y-2 mb-4">
          {[
            ['Sollen wir „du" sagen?', 'Shall we say „du"? (simplest)'],
            ['Wollen wir uns duzen?', 'Shall we use „du" with each other?'],
            ['Ist es okay für dich, wenn wir uns duzen?', 'Is it okay with you if we use „du"?'],
            ['Können wir uns duzen oder lieber siezen?', 'Can we use „du", or rather „Sie"?'],
            ['Gerne, sag einfach „du" zu mir.', 'Sure, just say „du" to me. (answer)'],
            ['Ja, lass uns „du" sagen.', 'Yes, let\'s say „du". (answer)'],
          ].map(([de, en]) => (
            <div key={de} className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-sm font-medium text-indigo-700">{de}</p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{en}</p>
            </div>
          ))}
        </div>

        {/* Opening the conversation */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Starting & greeting:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Hallo, ich freue mich, dich kennenzulernen.',
            'Darf ich anfangen?',
            'Möchtest du anfangen oder soll ich?',
            'Schön, dass wir zusammen die Prüfung machen.',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-indigo-50 text-indigo-700">{p}</span>
          ))}
        </div>

        {/* Asking your partner */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Asking your partner back:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Und du, wie heißt du?',
            'Woher kommst du?',
            'Was machst du beruflich?',
            'Wie lange lernst du schon Deutsch?',
            'Was sind deine Hobbys?',
            'Hast du Familie hier?',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-green-50 text-green-700">{p}</span>
          ))}
        </div>

        {/* If you don't understand / closing */}
        <p className="text-sm font-semibold text-gray-800 mb-2">If you don't understand & closing:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Kannst du das bitte wiederholen?',
            'Wie bitte? Das habe ich nicht verstanden.',
            'Was bedeutet das genau?',
            'Es war schön, dich kennenzulernen.',
            'Danke für das Gespräch!',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-rose-50 text-rose-700">{p}</span>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-1">💡 Quick tips</p>
          <ul className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
            <li>• Don't just recite a list — speak in full sentences and connect ideas with <em>und, aber, weil, deshalb</em>.</li>
            <li>• <strong>Ask your partner questions too</strong> — Teil 1 is a small conversation, not a monologue.</li>
            <li>• Prepare 5–6 sentences you can say smoothly; it calms your nerves and makes a strong first impression.</li>
            <li>• A friendly greeting and a smile count: <em>„Hallo, ich freue mich."</em></li>
          </ul>
        </div>
      </div>

      {/* ── Teil 2 deep-dive ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-indigo-600 font-bold">Teil 2</span>
          <h2 className="text-base font-bold text-gray-800">Gespräch über ein Thema</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          You and your partner each get a short text on the same topic, but from a different angle. First summarize your text, listen to your partner's summary, then discuss and give your own opinion.
        </p>

        {/* Step structure */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-4">
          <p className="text-sm font-bold text-indigo-800 mb-2">How to structure it ✅</p>
          <ol className="space-y-1.5 text-xs text-indigo-900/80 leading-relaxed list-decimal list-inside">
            <li><strong>Summarize your text</strong> in 2–3 sentences (what is it about?).</li>
            <li><strong>Say the main opinion</strong> of your text.</li>
            <li><strong>Listen</strong> to your partner and react to their text.</li>
            <li><strong>Give your own opinion</strong> with a reason and an example.</li>
            <li><strong>Ask your partner</strong> what they think.</li>
          </ol>
        </div>

        {/* How to START — the key tip the user asked for */}
        <p className="text-sm font-semibold text-gray-800 mb-2">How to start — summarize your text:</p>
        <div className="space-y-2 mb-4">
          {[
            ['In meinem Text geht es um …', 'My text is about …'],
            ['Mein Text handelt von …', 'My text is about / deals with …'],
            ['In meinem Text / Artikel steht, dass …', 'In my text/article it says that …'],
            ['Der Text sagt, dass …', 'The text says that …'],
            ['In meinem Text wird über … gesprochen.', 'My text talks about …'],
            ['Es geht um das Thema …', 'It is about the topic …'],
          ].map(([de, en]) => (
            <div key={de} className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-sm font-medium text-indigo-700">{de}</p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{en}</p>
            </div>
          ))}
        </div>

        {/* Reporting the text's opinion */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Reporting the text's opinion:</p>
        <div className="space-y-2 mb-4">
          {[
            ['Die Person / Der Autor meint, dass …', 'The person/author thinks that …'],
            ['Laut meinem Text …', 'According to my text …'],
            ['Im Text steht, dass … ein Vorteil / Nachteil ist.', 'The text says that … is an advantage/disadvantage.'],
            ['Der Text ist für / gegen …', 'The text is for/against …'],
          ].map(([de, en]) => (
            <div key={de} className="bg-slate-50 rounded-xl px-3 py-2">
              <p className="text-sm font-medium text-indigo-700">{de}</p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{en}</p>
            </div>
          ))}
        </div>

        {/* Reacting to partner's text */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Reacting to your partner's text:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'In deinem Text geht es um etwas anderes.',
            'Dein Text sagt …, aber mein Text sagt …',
            'Das ist interessant! In meinem Text steht …',
            'Mein Text hat eine andere Meinung.',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-sky-50 text-sky-700">{p}</span>
          ))}
        </div>

        {/* Giving opinion */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Giving your own opinion:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Ich finde, dass …',
            'Meiner Meinung nach …',
            'Ich bin der Meinung, dass …',
            'Ich denke / glaube, dass …',
            'Aus meiner Sicht …',
            'Ich habe die Erfahrung gemacht, dass …',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-indigo-50 text-indigo-700">{p}</span>
          ))}
        </div>

        {/* Agreeing & disagreeing */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Agreeing & disagreeing:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Da stimme ich dir zu.',
            'Das sehe ich genauso.',
            'Du hast recht.',
            'Das stimmt, aber …',
            'Da bin ich anderer Meinung.',
            'Das sehe ich ein bisschen anders, weil …',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-green-50 text-green-700">{p}</span>
          ))}
        </div>

        {/* Asking partner */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Bringing your partner in:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Und was meinst du dazu?',
            'Wie ist das bei dir?',
            'Hast du damit Erfahrungen gemacht?',
            'Was steht in deinem Text?',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-rose-50 text-rose-700">{p}</span>
          ))}
        </div>
      </div>

      {/* ── Teil 3 deep-dive ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-indigo-600 font-bold">Teil 3</span>
          <h2 className="text-base font-bold text-gray-800">Gemeinsam etwas planen</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          You get a planning task with points. Make suggestions, react to your partner's ideas, and agree on a concrete plan together. The goal is a real decision at the end.
        </p>

        {/* Step structure */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
          <p className="text-sm font-bold text-amber-800 mb-2">How to structure it ✅</p>
          <ol className="space-y-1.5 text-xs text-amber-900/80 leading-relaxed list-decimal list-inside">
            <li><strong>Make a suggestion</strong> for the first point.</li>
            <li><strong>React</strong> to your partner's idea (agree or suggest something else).</li>
            <li><strong>Go through all points</strong> together — take turns.</li>
            <li><strong>Agree</strong> on a decision for each point.</li>
            <li><strong>Summarize the final plan</strong> at the end.</li>
          </ol>
        </div>

        {/* Making suggestions */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Making suggestions:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Ich schlage vor, dass wir …',
            'Wie wäre es, wenn wir …?',
            'Wir könnten doch …',
            'Was hältst du davon, wenn …?',
            'Vielleicht sollten wir …',
            'Hast du eine Idee?',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-amber-50 text-amber-700">{p}</span>
          ))}
        </div>

        {/* Reacting to suggestions */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Reacting to suggestions:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Das ist eine gute Idee!',
            'Einverstanden!',
            'Ja, das machen wir so.',
            'Das finde ich nicht so gut, weil …',
            'Ich weiß nicht, ob das klappt …',
            'Können wir nicht lieber …?',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-rose-50 text-rose-700">{p}</span>
          ))}
        </div>

        {/* Reaching a decision */}
        <p className="text-sm font-semibold text-gray-800 mb-2">Reaching a decision & summarizing:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Gut, dann machen wir das so.',
            'Wir sind uns einig.',
            'Also, wir treffen uns am … um … Uhr.',
            'Zusammenfassend können wir sagen, dass …',
            'Dann ist alles geplant!',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-green-50 text-green-700">{p}</span>
          ))}
        </div>
      </div>

      {/* ── If you don't understand (Teil 2 & 3) ─────────────── */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-1">If you don't understand (Teil 2 & 3)</h2>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Never stay silent — asking is normal and even shows good communication skills.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Entschuldigung, kannst du das bitte wiederholen?',
            'Wie bitte? Das habe ich nicht verstanden.',
            'Was bedeutet das genau?',
            'Kannst du das anders sagen?',
            'Meinst du, dass …?',
          ].map(p => (
            <span key={p} className="text-sm px-3 py-1.5 rounded-xl font-medium bg-sky-50 text-sky-700">{p}</span>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Common Mistakes to Avoid</h2>
        <ul className="space-y-3">
          {[
            ['Giving a monologue', 'Teil 2 and 3 are conversations, not presentations. Ask your partner questions and react to their answers — interaction is scored.'],
            ['Ignoring your partner\'s article', 'In Teil 2, listen carefully to what others summarize and refer to it: "Das sehe ich anders als in deinem Text …"'],
            ['One-word answers', 'Always extend: give a reason (weil …), an example (zum Beispiel …) or a personal experience.'],
            ['Not reaching a decision in Teil 3', 'The goal is a concrete plan. Summarize at the end: "Also, wir treffen uns am Samstag um 10 Uhr am Bahnhof."'],
            ['Memorized speeches', 'Examiners notice rehearsed monologues. Learn phrases and structures, not full scripts.'],
            ['Silence when you don\'t understand', 'Ask! "Können Sie das bitte wiederholen?" is much better than a wrong answer or silence.'],
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
