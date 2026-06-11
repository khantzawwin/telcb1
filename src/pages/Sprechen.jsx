import { useState } from 'react'

// ─── Teil 2 debates — each person gets a different perspective article ──────────

const TEIL2_DEBATES = [
  {
    theme: 'Alleine reisen',
    cards: [
      {
        headline: 'Allein reisen: Freiheit pur',
        text: 'Immer mehr Menschen entscheiden sich für Solotrips — und das aus gutem Grund. Wer allein reist, kann seinen Urlaub komplett nach eigenen Wünschen planen: kein Warten, keine Kompromisse. Man lernt sich selbst besser kennen und ist viel offener für neue Bekanntschaften. Studien zeigen, dass Alleinreisende kommunikativer sind als Gruppenreisende. Laut einer Umfrage des Deutschen Reiseverbands gaben 78 Prozent der Befragten an, ein Solotrip habe ihr Selbstbewusstsein deutlich gestärkt.',
      },
      {
        headline: 'Allein auf Reisen — riskant und einsam?',
        text: 'Allein in fremde Länder zu fahren klingt abenteuerlich, birgt aber Risiken. Wer allein reist, muss alle Probleme selbst lösen: ein verpasster Zug oder eine Erkrankung können schnell zur Belastung werden. Sicherheitsexperten warnen besonders Frauen vor bestimmten Reisezielen. Dazu kommt die Einsamkeit: Schöne Erlebnisse verlieren an Wert, wenn niemand dabei ist. Und finanziell ist Alleinreisen teurer — Einzelzimmer kosten bis zu 40 Prozent mehr als in der Gruppe.',
      },
      {
        headline: 'Sicher allein reisen: So klappt\'s',
        text: 'Alleinreisen ist weder per se gefährlich noch immer paradiesisch — es kommt auf die Vorbereitung an. Wer gut plant, Reiseziele sorgfältig auswählt und lokale Kontakte knüpft, erlebt das Beste beider Welten: die Freiheit des Solotrips und die Sicherheit eines organisierten Urlaubs. Reise-Apps, Online-Communities und Hostels mit Gemeinschaftsbereichen machen es heute leichter denn je, allein zu reisen und trotzdem Menschen kennenzulernen. Entscheidend ist nicht ob, sondern wie gut man vorbereitet ist.',
      },
    ],
  },
  {
    theme: 'Homeoffice',
    cards: [
      {
        headline: 'Homeoffice: Mehr Freiheit, mehr Leistung',
        text: 'Seit der Pandemie hat das Homeoffice einen festen Platz in der Arbeitswelt gefunden — zu Recht. Studien zeigen, dass Mitarbeiter zu Hause produktiver arbeiten: weniger Unterbrechungen, kein Pendelstress, mehr Konzentration. Familien profitieren von der Flexibilität, berufliche und private Aufgaben besser zu kombinieren. Eine Umfrage des Instituts für Arbeitsmarktforschung ergab, dass 68 Prozent der Beschäftigten im Homeoffice zufriedener mit ihrer Work-Life-Balance sind als ihre Kollegen im Büro.',
      },
      {
        headline: 'Homeoffice: Isolation statt Integration',
        text: 'So praktisch das Homeoffice klingt — die Risiken werden oft unterschätzt. Viele Beschäftigte berichten von Einsamkeit, fehlender Trennung zwischen Arbeit und Freizeit und ständiger Erreichbarkeit. Besonders junge Mitarbeiter leiden unter mangelndem Austausch mit Kollegen. Kreative Teamarbeit funktioniert am besten im persönlichen Gespräch. Studien zeigen außerdem, dass Heimarbeiter seltener befördert werden. Für Eltern kleiner Kinder ist konzentriertes Arbeiten zu Hause oft kaum möglich.',
      },
      {
        headline: 'Hybrid-Modell: Das Beste aus beiden Welten',
        text: 'Weder reines Homeoffice noch tägliches Büro — das Hybrid-Modell setzt sich immer mehr durch. Zwei bis drei Tage im Büro ermöglichen persönlichen Austausch und Teamarbeit. Die restlichen Tage zu Hause bieten Konzentration und Flexibilität. Laut einer Studie des Fraunhofer-Instituts bevorzugen 74 Prozent der Beschäftigten diese Kombination. Auch Unternehmen profitieren: Sie können Bürofläche reduzieren und gleichzeitig die Teamkultur erhalten. Das Hybrid-Modell ist für viele der pragmatischste Weg nach vorn.',
      },
    ],
  },
  {
    theme: 'Soziale Medien',
    cards: [
      {
        headline: 'Soziale Medien: Verbunden mit der Welt',
        text: 'Facebook, Instagram und Co. werden oft kritisiert — dabei bieten sie enorme Vorteile. Soziale Medien ermöglichen es, Kontakt zu Freunden und Familie weltweit zu halten und Neuigkeiten sofort zu erfahren. Für viele kleine Unternehmen sind sie unverzichtbar: kostenlose Werbung, direkter Kundenkontakt, schnelles Feedback. Gesellschaftlich spielen sie eine wichtige Rolle: Bürgerbewegungen können über soziale Medien Millionen mobilisieren, wie zuletzt die Klimabewegung gezeigt hat.',
      },
      {
        headline: 'Soziale Medien: Sucht, Neid und Fehlinformation',
        text: 'Soziale Medien haben eine Schattenseite, die immer deutlicher wird. Studien belegen, dass regelmäßige Nutzung bei Jugendlichen zu Angstzuständen, Schlafproblemen und negativem Körperbild führt. Algorithmen bevorzugen emotionalen, oft falschen Inhalt — Fehlinformation verbreitet sich viermal schneller als korrekte Nachrichten. Viele Nutzer verbringen täglich über drei Stunden auf Plattformen, ohne es zu merken. Suchtforscher vergleichen das Design sozialer Medien offen mit dem von Spielautomaten.',
      },
      {
        headline: 'Soziale Medien brauchen strengere Regeln',
        text: 'Die Debatte endet oft in Extremen: vollständige Ablehnung oder unkritische Begeisterung. Dabei liegt die Lösung in klaren gesetzlichen Regeln für Plattformen. Die EU hat mit dem Digital Services Act bereits einen wichtigen Schritt gemacht — Plattformen müssen Falschinformationen bekämpfen und für Minderjährige bessere Schutzmaßnahmen einführen. Soziale Medien können ein wertvolles Werkzeug sein, wenn sie verantwortungsvoll betrieben werden. Regulierung statt Verbote ist der richtige Ansatz.',
      },
    ],
  },
  {
    theme: 'Vegane Ernährung',
    cards: [
      {
        headline: 'Vegan essen: Gut für Mensch und Erde',
        text: 'Der Trend zur veganen Ernährung hat handfeste Vorteile. Wer auf tierische Produkte verzichtet, senkt laut Studien sein Risiko für Herzerkrankungen und Diabetes deutlich. Gleichzeitig ist vegane Ernährung klimafreundlich: Die Tierhaltung verursacht mehr Treibhausgasemissionen als der gesamte Verkehrssektor. Moderne vegane Produkte sind vielfältig, lecker und in fast jedem Supermarkt erhältlich. Wer gut plant, kann sich vollwertig und gesund ernähren — ohne auf Genuss zu verzichten.',
      },
      {
        headline: 'Vegan: Nährstoffmangel und hohe Kosten',
        text: 'Eine rein vegane Ernährung klingt gesund, birgt aber Risiken. Ohne sorgfältige Planung fehlen wichtige Nährstoffe wie Vitamin B12, Eisen und Omega-3-Fettsäuren — dauerhafter Mangel kann zu ernsthaften Erkrankungen führen. Vegane Ersatzprodukte sind oft teuer und stark verarbeitet. Für Menschen mit niedrigem Einkommen ist eine ausgewogene vegane Ernährung kaum erschwinglich. Für Kinder und ältere Menschen kann der vollständige Verzicht ohne ärztliche Begleitung gefährlich sein.',
      },
      {
        headline: 'Weniger Fleisch — aber nicht gleich vegan',
        text: 'Müssen wir wirklich komplett auf tierische Produkte verzichten? Ernährungsexperten sagen: Nein. Eine flexitarische Ernährung — weniger Fleisch, mehr Gemüse, aber kein vollständiger Verzicht — ist für die meisten realistischer und gesünder. Wer einmal pro Woche auf Fleisch verzichtet, reduziert seinen CO₂-Fußabdruck bereits erheblich. Regional und saisonal einzukaufen ist oft umweltfreundlicher als importierte Sojaprodukte. Der Mittelweg zwischen Genuss und Verantwortung ist oft der nachhaltigste.',
      },
    ],
  },
  {
    theme: 'Elektroautos',
    cards: [
      {
        headline: 'Elektroautos: Die Zukunft des Fahrens',
        text: 'Elektroautos sind der wichtigste Schritt zur Reduzierung von CO₂-Emissionen im Verkehr. In Städten verbessern sie die Luftqualität spürbar. Die Technologie entwickelt sich rasant — moderne E-Autos schaffen 400 bis 600 Kilometer pro Ladung. Betriebskosten sind deutlich günstiger: Strom kostet weniger als Benzin, Wartung ist einfacher. Viele Länder fördern den Kauf mit Prämien. Die Zukunft gehört dem Elektromotor — das ist keine Frage mehr des Ob, sondern des Wann.',
      },
      {
        headline: 'Elektroautos: Teuer, ladeabhängig, nicht wirklich grün',
        text: 'Elektroautos gelten als Lösung für die Klimakrise — doch die Realität ist komplizierter. Die Produktion einer Batterie verursacht enorme CO₂-Mengen und verbraucht seltene Rohstoffe wie Kobalt, deren Abbau oft unter schlechten Bedingungen stattfindet. Das Ladenetz ist noch unzureichend, auf langen Strecken bleibt Reichweitenangst ein reales Problem. Der Kaufpreis liegt deutlich über dem von Verbrennern. Wenn der Strom aus Kohle kommt, ist die Ökobilanz kaum besser.',
      },
      {
        headline: 'Statt Elektroauto: lieber den Nahverkehr stärken',
        text: 'Die Diskussion dreht sich zu sehr um das Auto — und zu wenig darum, ob wir überhaupt so viele Autos brauchen. Investitionen in Bus, Bahn und Fahrradwege wären klimafreundlicher als der massenhafte Umstieg auf Elektroautos. Ein gut ausgebauter Nahverkehr kommt allen zugute — nicht nur denen, die sich ein neues Auto leisten können. Städte wie Wien oder Amsterdam zeigen, dass eine autoarme Infrastruktur funktioniert und die Lebensqualität steigert.',
      },
    ],
  },
  {
    theme: 'Stadt- oder Landleben',
    cards: [
      {
        headline: 'Großstadtleben: Alles nah, alles möglich',
        text: 'Das Leben in der Großstadt bietet Chancen, die auf dem Land undenkbar sind: Kulturangebote, kurze Wege zur Arbeit und ein breites Netzwerk an Kontakten. Öffentliche Verkehrsmittel machen ein Auto überflüssig. Jobangebote sind vielfältiger, Gehälter meist höher. Gerade für junge Menschen ist die Stadt der Ort, an dem man sich entfalten, neue Ideen ausprobieren und internationale Kontakte knüpfen kann. Kein Wunder, dass immer mehr Menschen in Ballungszentren ziehen.',
      },
      {
        headline: 'Raus aufs Land: Ruhe, Natur, Gemeinschaft',
        text: 'Immer mehr Menschen entscheiden sich bewusst für das Landleben — und bereuen es selten. Günstigere Mieten ermöglichen den Traum vom eigenen Haus. Kinder wachsen in der Natur auf, mit weniger Lärm und mehr Platz. Mit Homeoffice ist Pendeln in die Stadt oft gar nicht mehr nötig. Studien zeigen, dass Landbewohner im Schnitt gesünder und zufriedener sind als Stadtbewohner — weniger Stress, bessere Luft und ein stärkeres Gemeinschaftsgefühl.',
      },
      {
        headline: 'Kleinstädte: Das Beste aus Stadt und Land',
        text: 'Wer sich zwischen Großstadt und tiefem Land nicht entscheiden kann, übersieht oft eine dritte Option: die Kleinstadt. Mit 20.000 bis 100.000 Einwohnern bieten Kleinstädte viele Vorteile beider Welten — kulturelles Angebot, bezahlbares Wohnen und echte Gemeinschaft. Der öffentliche Nahverkehr ist ausreichend, Natur ist nah, der Stress einer Metropole bleibt fern. Laut einer aktuellen Umfrage ist die Lebenszufriedenheit in deutschen Mittelstädten überdurchschnittlich hoch.',
      },
    ],
  },
  {
    theme: 'Haustiere in der Stadt',
    cards: [
      {
        headline: 'Haustiere machen glücklich — auch in der Großstadt',
        text: 'Wissenschaftliche Studien belegen: Haustiere senken Stress, reduzieren den Blutdruck und schützen vor Einsamkeit. Für ältere Menschen sind Tiere oft der wichtigste soziale Kontakt. Hunde bringen ihre Besitzer regelmäßig nach draußen — das fördert Bewegung und soziale Begegnungen. Auch für Kinder ist der Umgang mit Tieren wertvoll: Sie lernen Verantwortung und Empathie. In deutschen Städten gibt es heute viele Grünflächen, die das Halten von Haustieren gut möglich machen.',
      },
      {
        headline: 'Tiere in der Wohnung: Belastung für alle',
        text: 'Haustiere in der Stadt zu halten ist für das Tier oft alles andere als artgerecht. Ein Hund, der zehn Stunden allein in einer kleinen Wohnung verbringt, leidet. Lärm, Allergien und Konflikte mit Nachbarn sind häufige Folgen. Kosten werden unterschätzt: Futter, Tierarzt und Pflege summieren sich schnell auf mehrere Tausend Euro pro Jahr. Viele Tiere landen nach wenigen Monaten im Tierheim, weil Besitzer die Verantwortung unterschätzt haben.',
      },
      {
        headline: 'Katzen: Das ideale Haustier für Stadtmenschen',
        text: 'Die Frage, ob Haustiere in der Stadt sinnvoll sind, hängt stark von der Tierart ab. Während Hunde in kleinen Wohnungen leiden können, sind Katzen wesentlich anpassungsfähiger. Sie brauchen keinen Auslauf, beschäftigen sich weitgehend selbst und sind auch für Berufstätige gut geeignet. Statistiken zeigen, dass Katzen das beliebteste Haustier Deutschlands sind. Mit einem Kratzbaum, Spielzeug und etwas Aufmerksamkeit am Abend sind sie glücklich und bereichern das Leben ihrer Besitzer.',
      },
    ],
  },
  {
    theme: 'Smartphones für Kinder',
    cards: [
      {
        headline: 'Smartphones für Kinder: Sicherheit und Bildung',
        text: 'Ein Smartphone ist für Kinder heute oft eine Notwendigkeit. Eltern können ihre Kinder jederzeit erreichen — ein wichtiges Sicherheitsgefühl für beide Seiten. Lern-Apps vermitteln Wissen spielerisch und bereiten Kinder auf die digitale Arbeitswelt vor. Wer früh einen verantwortungsvollen Umgang lernt, kann später kritischer mit Medien umgehen. Entscheidend ist nicht das Gerät selbst, sondern wie Eltern und Lehrer den Umgang begleiten und klare Grenzen setzen.',
      },
      {
        headline: 'Zu viel Bildschirm — Kinder brauchen keine Smartphones',
        text: 'Immer mehr Studien warnen vor den Risiken von Smartphones für Kinder. Bildschirmzeit verdrängt Bewegung, Kreativspiel und echte soziale Kontakte. Cybermobbing und Social-Media-Sucht treffen Kinder besonders hart — ihr Gehirn kann mit diesen Reizen noch nicht umgehen. Die Weltgesundheitsorganisation empfiehlt für Kinder unter fünf Jahren keine Bildschirmzeit. Experten sind sich einig: Kinder brauchen echte Erfahrungen, Bewegung und persönliche Beziehungen.',
      },
      {
        headline: 'Erst ab 12: Ein sinnvoller Kompromiss',
        text: 'Weder ein generelles Verbot noch unbeschränkter Zugang — viele Experten empfehlen ein gestaffeltes Modell: Kinder unter 12 Jahren sollten kein eigenes Smartphone besitzen, ältere dagegen schon, aber mit klaren Regeln. Bildschirmzeitbeschränkungen und keine sozialen Medien vor dem 14. Lebensjahr sind entscheidend. Frankreich hat 2023 Smartphones an Schulen vollständig verboten — mit positiven Rückmeldungen von Eltern und Lehrern. Technik ist nicht das Problem — fehlende Begleitung ist es.',
      },
    ],
  },
  {
    theme: 'Kostenloser Nahverkehr',
    cards: [
      {
        headline: 'Kostenloses Fahren: Gut für Klima und Gesellschaft',
        text: 'Ein kostenloser öffentlicher Nahverkehr könnte die Mobilität grundlegend verändern. Weniger Autos bedeuten weniger Stau, Lärm und CO₂. Menschen mit niedrigem Einkommen würden enorm entlastet. Städte wie Luxemburg haben diesen Schritt bereits gewagt — mit positiven Ergebnissen. Ein barrierefreies Nahverkehrsangebot ohne Hemmschwelle beim Ticketkauf ist der effektivste Weg zur echten Verkehrswende. Die Investition rechnet sich langfristig durch gesparte Straßeninfrastruktur.',
      },
      {
        headline: 'Gratisbusse lösen das Problem nicht',
        text: 'Die Idee des kostenlosen Nahverkehrs klingt gut, ist aber trügerisch: Kostenlos bedeutet nicht umsonst. Die Finanzierung müsste durch Steuergelder erfolgen und belastet andere Bereiche wie Bildung. Studien zeigen, dass kostenlose Tickets vor allem Fußgänger zum Umsteigen bewegen — nicht Autofahrer. Das eigentliche Problem bleibt: Das Angebot auf dem Land ist zu gering, Fahrzeuge überfüllt, Verbindungen unzuverlässig. Investitionen in Qualität würden mehr bringen.',
      },
      {
        headline: 'Günstig statt gratis: Ein kluger Kompromiss',
        text: 'Der Streit zwischen kostenlosem Nahverkehr und vollem Ticketpreis verdeckt eine pragmatische Lösung: starke Subventionierung. Das Neun-Euro-Ticket hat gezeigt, dass niedrige Preise die Nutzung drastisch steigern — ohne das System zu überlasten. Ein Jahresticket für rund 29 Euro im Monat wäre fair: erschwinglich für alle, finanzierbar und Anreiz genug, auf das Auto zu verzichten. Der Preis ist eine Barriere — muss aber nicht auf null sinken, um zu wirken.',
      },
    ],
  },
  {
    theme: 'Tempolimit auf der Autobahn',
    cards: [
      {
        headline: 'Tempolimit: Sicherer, sauberer, stressfreier',
        text: 'Deutschland ist eines der wenigen Länder ohne generelles Tempolimit auf der Autobahn — das sollte sich ändern. Ein Limit von 130 km/h würde den CO₂-Ausstoß spürbar senken. Sicherheitsexperten sind sich einig: Niedrigere Geschwindigkeit bedeutet kürzere Bremswege und weniger tödliche Unfälle. In Frankreich und Österreich gibt es seit Jahrzehnten Tempolimits, ohne dass der Autoverkehr darunter gelitten hat. Das Argument der persönlichen Freiheit zählt wenig, wenn es um Menschenleben geht.',
      },
      {
        headline: 'Freie Fahrt: Warum ein Tempolimit falsch wäre',
        text: 'Ein generelles Tempolimit auf deutschen Autobahnen wäre ein unnötiger Eingriff in die persönliche Freiheit. Deutsche Autobahnen sind statistisch sicherer als viele Straßen mit Tempolimit, weil sie besonders gut ausgebaut sind. Die CO₂-Einsparung wäre minimal — weniger als ein Prozent der deutschen Gesamtemissionen. Moderne Autos sind auf Autobahngeschwindigkeit ausgelegt. Wer die Umwelt schützen will, sollte lieber auf Flugreisen verzichten.',
      },
      {
        headline: 'Flexibles Tempolimit: Eine intelligente Lösung',
        text: 'Das Entweder-oder — generelles Tempolimit oder freie Fahrt — greift zu kurz. Viele Experten sprechen sich für ein situationsabhängiges Limit aus: 130 km/h als Richtwert, aber Ausnahmen auf ausgewählten, gut ausgebauten Strecken. Intelligente Verkehrssysteme können Limits je nach Wetterlage, Tageszeit und Verkehrsaufkommen automatisch anpassen. In anderen europäischen Ländern ist das bereits Standard. So wird weder die Freiheit der Fahrer pauschal eingeschränkt, noch werden Sicherheit und Umwelt ignoriert.',
      },
    ],
  },
  {
    theme: 'Die Viertagewoche',
    cards: [
      {
        headline: 'Vier Tage arbeiten, glücklicher leben',
        text: 'Die Viertagewoche ist mehr als eine utopische Idee — sie funktioniert. Großangelegte Studien in Island und Großbritannien zeigen: Mitarbeiter sind an vier Tagen genauso produktiv wie an fünf, leiden aber deutlich weniger unter Burnout. Ein freier Tag mehr verbessert die Work-Life-Balance und stärkt Familien. Unternehmen profitieren durch weniger Krankheitstage. Angesichts des Fachkräftemangels könnte die Viertagewoche ein entscheidender Vorteil im Wettbewerb um Talente werden.',
      },
      {
        headline: 'Vier Tage — gut gemeint, schlecht durchdacht',
        text: 'Die Viertagewoche ist für viele Branchen nicht umsetzbar. Im Gesundheitswesen, im Handel oder in der Gastronomie hängt die Versorgung davon ab, dass jemand präsent ist — fünf oder sieben Tage. Wenn Arbeit auf vier Tage verdichtet wird, steigt der Druck pro Tag erheblich. Für Führungskräfte bedeutet das oft, dass Mails abends bearbeitet werden. In global vernetzten Märkten kann Deutschland es sich kaum leisten, weniger zu arbeiten als die Konkurrenz.',
      },
      {
        headline: 'Flexible Arbeitszeit: Besser als die Viertagewoche',
        text: 'Statt einer starren Viertagewoche fordern immer mehr Experten echte Flexibilität. Wer morgens früher anfängt und nachmittags die Kinder abholt, oder in Projektphasen mehr und in ruhigen Zeiten weniger arbeitet, ist produktiver und zufriedener. Vertrauensarbeitszeit — Ergebnisse statt Anwesenheit messen — ist für viele Branchen der bessere Ansatz. Studien zeigen: Nicht die Anzahl der Arbeitstage ist entscheidend, sondern die Kontrolle über die eigene Zeit.',
      },
    ],
  },
  {
    theme: 'Studieren im Ausland',
    cards: [
      {
        headline: 'Im Ausland studieren: Mehr als nur ein Abschluss',
        text: 'Ein Auslandssemester ist eine der wertvollsten Investitionen in die eigene Zukunft. Man lernt nicht nur die Sprache, sondern auch eine andere Kultur und internationale Denkweisen kennen. Arbeitgeber schätzen Auslandserfahrung enorm — sie zeigt Eigeninitiative und interkulturelle Kompetenz. Programme wie Erasmus+ machen es durch Stipendien finanziell möglich. Wer im Ausland studiert hat, blickt offener auf die Welt und hat oft ein weltweites Netzwerk aufgebaut.',
      },
      {
        headline: 'Auslandsstudium: Teuer, stressig, oft überschätzt',
        text: 'Ein Studium im Ausland wird häufig romantisiert — die Realität ist ernüchternder. Sprachbarrieren und bürokratische Hürden bei der Anerkennung von Studienleistungen sind echte Herausforderungen. Viele kehren mit verzögertem Abschluss zurück, weil Kurse nicht anerkannt werden. Sozialer Druck — "du musst ins Ausland" — führt dazu, dass manche gehen, obwohl sie es nicht wollen. Hochwertige Bildung ist auch in Deutschland möglich, ohne Familie für Jahre zu verlassen.',
      },
      {
        headline: 'Praktikum im Ausland: Die clevere Alternative',
        text: 'Wer internationale Erfahrung will, muss nicht jahrelang im Ausland studieren. Ein Praktikum oder eine Ausbildungsphase im Ausland — drei bis sechs Monate — bietet oft mehr praktischen Nutzen bei weniger finanziellem Risiko. Man sammelt Berufserfahrung, verbessert Sprachkenntnisse und lernt eine andere Arbeitskultur kennen, ohne den eigenen Abschluss zu gefährden. Für Arbeitgeber ist praktische Auslandserfahrung oft wertvoller als ein ausländisches Studienzeugnis.',
      },
    ],
  },
  {
    theme: 'Fast Fashion',
    cards: [
      {
        headline: 'Günstige Mode: Ein Recht für alle',
        text: 'Mode war lange ein Luxusgut, das sich nur wohlhabende Menschen leisten konnten. Fast Fashion hat das verändert: Heute kann jeder stilvoll gekleidet sein, ohne ein Vermögen auszugeben. Für Familien mit kleinem Budget ist günstige Kleidung eine Notwendigkeit. Außerdem entwickelt sich die Branche: Viele Anbieter setzen auf recycelte Materialien und transparentere Lieferketten. Wer günstig kauft und Kleidung lange trägt, handelt durchaus vernünftig.',
      },
      {
        headline: 'Fast Fashion: Ein System auf Kosten der Erde',
        text: 'Fast Fashion ist eine der umweltschädlichsten Industrien der Welt. Die Modeindustrie verursacht acht Prozent der globalen CO₂-Emissionen — mehr als Luft- und Schifffahrt zusammen. Tonnenweise Kleidung landet ungetragen auf Deponien in Ghana oder Chile. Für eine Jeans werden bis zu 8.000 Liter Wasser verbraucht. Näherinnen in Bangladesch arbeiten für Hungerlöhne. Wer Fast Fashion kauft, finanziert ein System, das auf Ausbeutung und Wegwerfkultur basiert.',
      },
      {
        headline: 'Die Lösung: Secondhand statt Fast Fashion',
        text: 'Die Antwort auf Fast Fashion muss keine teure Designerkleidung sein. Der Secondhand-Markt boomt: Auf Plattformen wie Vinted oder in lokalen Läden findet man modische Kleidung zu günstigen Preisen, ohne neue Ressourcen zu verbrauchen. Wer secondhand kauft, spart Geld, reduziert Müll und schont die Umwelt. Der Trend ist besonders bei jungen Menschen angekommen: Laut einer Umfrage kaufen 68 Prozent der unter 30-Jährigen regelmäßig gebrauchte Kleidung. Nachhaltig und erschwinglich ist kein Widerspruch.',
      },
    ],
  },
  {
    theme: 'Schuluniformen',
    cards: [
      {
        headline: 'Schuluniform: Gleiche Chancen für alle',
        text: 'In vielen Ländern sind Schuluniformen selbstverständlich — aus guten Gründen. Kleidung ist an deutschen Schulen ein täglicher Statusmarker: Teure Markenschuhe erzeugen Druck und Mobbing. Eine Schuluniform beseitigt diese Unterschiede und schafft Gemeinschaft. Für Eltern und Kinder entfällt der morgendliche Stress der Kleiderwahl. Studien aus Großbritannien und Japan zeigen: Schulen mit Uniformen haben oft ein ruhigeres Lernklima und weniger Mobbing.',
      },
      {
        headline: 'Schuluniform: Einschränkung statt Gleichheit',
        text: 'Schuluniformen klingen nach Gleichheit — schränken aber die Persönlichkeitsentwicklung ein. Kleidung ist Teil der Identität, besonders in der Jugend. Jugendliche sollen lernen, eigene Entscheidungen zu treffen — das gelingt nicht in Uniform. Die Anschaffungskosten sind für manche Familien höher als normale Alltagskleidung. Soziale Unterschiede lassen sich mit einer Uniform kaum verstecken: Schuhe, Taschen und Accessoires bleiben Statussymbole.',
      },
      {
        headline: 'Dresscode statt Uniform: Ein vernünftiger Mittelweg',
        text: 'Weder eine strenge Schuluniform noch völlig ungeregelte Kleidung — viele Schulen setzen erfolgreich auf Dresscodes. Klare Regeln (keine Logos, dezente Farben, angemessene Kleidung) schaffen ein ruhigeres Schulumfeld, ohne die Persönlichkeitsentwicklung zu unterdrücken. Jugendliche können innerhalb des Rahmens ihren eigenen Stil ausdrücken. Dieses Modell ist in Großbritannien weit verbreitet und wird von Eltern und Schülern deutlich besser akzeptiert als eine vollständige Uniform.',
      },
    ],
  },
  {
    theme: 'Tierversuche in der Forschung',
    cards: [
      {
        headline: 'Tierversuche retten Menschenleben',
        text: 'Tierversuche haben in der Medizingeschichte Millionen von Menschenleben gerettet. Insulin, Antibiotika und viele Krebstherapien wurden durch Tierversuche entwickelt. Kein anderes Modell kann den komplexen menschlichen Organismus vollständig ersetzen. Moderne Labore unterliegen strengen ethischen Regeln. Ohne Tierversuche könnten neue Medikamente nicht sicher auf den Markt gebracht werden. Die Forschung arbeitet intensiv an Alternativen — aber diese sind noch nicht reif genug.',
      },
      {
        headline: 'Tierversuche: Grausam und oft nutzlos',
        text: 'Jedes Jahr sterben in Deutschland fast drei Millionen Tiere in Laborversuchen — oft für Ergebnisse, die auf den Menschen kaum übertragbar sind. 90 Prozent der Substanzen, die in Tierversuchen als sicher gelten, scheitern trotzdem in klinischen Tests. Die genetischen Unterschiede zwischen Mäusen und Menschen sind zu groß. Moderne Alternativen liefern oft präzisere Ergebnisse. Es ist Zeit, die Abhängigkeit von Tierversuchen zu beenden.',
      },
      {
        headline: 'Digitale Modelle: Die Zukunft der Forschung',
        text: 'Die Frage ist nicht ob wir Tierversuche sofort abschaffen, sondern wie wir den Übergang zu besseren Methoden beschleunigen. Computergestützte Modelle, Organoide aus menschlichen Stammzellen und KI-gestützte Wirkstofftests liefern in vielen Bereichen bereits präzisere Ergebnisse als Tierversuche. Die EU investiert Milliarden in die Entwicklung solcher Alternativen. Ein klares Zieldatum für den schrittweisen Ausstieg aus Tierversuchen würde die Forschung in die richtige Richtung lenken.',
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

      {/* Phrase banks */}
      {[
        {
          title: 'Giving your opinion',
          color: 'bg-indigo-50 text-indigo-700',
          phrases: [
            'Ich finde, dass …',
            'Meiner Meinung nach …',
            'Ich bin der Meinung, dass …',
            'Ich denke / glaube, dass …',
            'Für mich ist es wichtig, dass …',
            'Aus meiner Sicht …',
          ],
        },
        {
          title: 'Agreeing & disagreeing',
          color: 'bg-green-50 text-green-700',
          phrases: [
            'Da stimme ich dir / Ihnen zu.',
            'Das sehe ich genauso.',
            'Du hast / Sie haben recht.',
            'Das stimmt, aber …',
            'Da bin ich anderer Meinung.',
            'Das sehe ich ein bisschen anders, weil …',
          ],
        },
        {
          title: 'Making suggestions (Teil 3)',
          color: 'bg-amber-50 text-amber-700',
          phrases: [
            'Ich schlage vor, dass wir …',
            'Wie wäre es, wenn wir …?',
            'Wir könnten doch …',
            'Was hältst du davon, wenn …?',
            'Hast du eine bessere Idee?',
            'Vielleicht sollten wir …',
          ],
        },
        {
          title: 'Reacting to suggestions (Teil 3)',
          color: 'bg-rose-50 text-rose-700',
          phrases: [
            'Das ist eine gute Idee!',
            'Einverstanden!',
            'Ja, das machen wir so.',
            'Das finde ich nicht so gut, weil …',
            'Ich weiß nicht, ob das klappt …',
            'Können wir nicht lieber …?',
          ],
        },
        {
          title: 'Keeping the conversation going',
          color: 'bg-sky-50 text-sky-700',
          phrases: [
            'Und was meinst du dazu?',
            'Wie ist das bei dir?',
            'Hast du damit Erfahrungen gemacht?',
            'Entschuldigung, können Sie das bitte wiederholen?',
            'Was bedeutet das genau?',
            'Also, zusammenfassend können wir sagen …',
          ],
        },
      ].map(group => (
        <div key={group.title} className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">{group.title}</h2>
          <div className="flex flex-wrap gap-2">
            {group.phrases.map(p => (
              <span key={p} className={`text-sm px-3 py-1.5 rounded-xl font-medium ${group.color}`}>{p}</span>
            ))}
          </div>
        </div>
      ))}

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
