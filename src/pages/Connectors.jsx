import { useState } from 'react'

// ─── Exercise data ─────────────────────────────────────────────────────────────

const EXERCISES = [
  // ── und ──────────────────────────────────────────────────────────────────────
  { id: 'c_01', group: 'A – und', question: 'Ich lerne jeden Tag Deutsch, ___ ich mache viele Übungen.', options: ['und', 'aber', 'denn', 'oder'], answer: 'und', explanation: 'und simply adds information. Both clauses keep normal Pos. 2 word order — no contrast or reason.' },
  { id: 'c_02', group: 'A – und', question: 'Sie kocht das Abendessen, ___ er wäscht danach ab.', options: ['und', 'aber', 'oder', 'denn'], answer: 'und', explanation: 'und adds a second action. No contrast, no reason — just addition.' },

  // ── oder ─────────────────────────────────────────────────────────────────────
  { id: 'c_03', group: 'A – oder', question: 'Möchtest du heute ins Kino gehen, ___ hast du keine Lust?', options: ['oder', 'und', 'aber', 'denn'], answer: 'oder', explanation: 'oder offers a choice between two alternatives.' },
  { id: 'c_04', group: 'A – oder', question: 'Fahren wir mit dem Zug, ___ nehmen wir das Auto?', options: ['oder', 'und', 'aber', 'sondern'], answer: 'oder', explanation: 'oder presents two options — either one is possible.' },

  // ── aber ─────────────────────────────────────────────────────────────────────
  { id: 'c_05', group: 'A – aber', question: 'Ich möchte dir helfen, ___ ich habe leider keine Zeit.', options: ['aber', 'denn', 'sondern', 'oder'], answer: 'aber', explanation: 'aber = but (simple contrast). No negation needed.' },
  { id: 'c_06', group: 'A – aber', question: 'Das Hotel war teuer, ___ das Zimmer war sehr schön.', options: ['aber', 'denn', 'sondern', 'und'], answer: 'aber', explanation: 'aber contrasts two facts: expensive (negative) + beautiful room (positive).' },
  { id: 'c_07', group: 'A – aber', question: 'Er ist sehr klug, ___ manchmal macht er komische Fehler.', options: ['aber', 'denn', 'sondern', 'oder'], answer: 'aber', explanation: 'aber = but. No negation in first clause → aber (not sondern).' },
  { id: 'c_08', group: 'A – aber', question: 'Ich esse gerne Schokolade, ___ ich muss leider auf Zucker achten.', options: ['aber', 'sondern', 'denn', 'oder'], answer: 'aber', explanation: 'aber = but. Simple contrast. No nicht/kein in first clause → aber, not sondern.' },

  // ── denn ─────────────────────────────────────────────────────────────────────
  { id: 'c_09', group: 'A – denn', question: 'Ich bleibe heute zu Hause, ___ ich bin krank.', options: ['denn', 'weil', 'obwohl', 'damit'], answer: 'denn', explanation: 'denn = because (Hauptsatz). "ich bin" = Pos. 2 word order. With weil it would be "weil ich krank bin" (verb last).' },
  { id: 'c_10', group: 'A – denn', question: 'Wir gehen früh schlafen, ___ wir haben morgen einen wichtigen Termin.', options: ['denn', 'weil', 'deshalb', 'damit'], answer: 'denn', explanation: 'denn keeps normal Pos. 2 order ("wir haben"). If it were weil: "weil wir … haben" (verb last).' },

  // ── deshalb / deswegen / darum ────────────────────────────────────────────────
  { id: 'c_11', group: 'B – deshalb', question: 'Er hat den Zug verpasst. ___ kam er zu spät zur Arbeit.', options: ['Deshalb', 'Obwohl', 'Damit', 'Nachdem'], answer: 'Deshalb', explanation: 'deshalb starts the second sentence (Position 1) and causes verb-subject inversion. Reason → consequence.' },
  { id: 'c_12', group: 'B – deswegen', question: 'Es ist sehr kalt draußen. ___ ziehe ich meinen Wintermantel an.', options: ['Deswegen', 'Trotzdem', 'Obwohl', 'Damit'], answer: 'Deswegen', explanation: 'deswegen = therefore. Almost identical to deshalb. Cold outside → wear coat.' },
  { id: 'c_13', group: 'B – darum', question: 'Sie hat die Prüfung nicht bestanden. ___ muss sie sie wiederholen.', options: ['Darum', 'Obwohl', 'Weil', 'Damit'], answer: 'Darum', explanation: 'darum = therefore. Same family as deshalb and deswegen. Reason (failed) → consequence (must repeat).' },
  { id: 'c_14', group: 'B – deshalb', question: 'Sie hat viel Stress. ___ geht sie einmal pro Woche zum Sport.', options: ['Deshalb', 'Weil', 'Obwohl', 'Damit'], answer: 'Deshalb', explanation: 'deshalb starts a new sentence (Pos. 1). Stress (reason) → sport (consequence).' },

  // ── trotzdem ─────────────────────────────────────────────────────────────────
  { id: 'c_15', group: 'B – trotzdem', question: 'Es regnet stark. ___ geht er ohne Schirm spazieren.', options: ['Trotzdem', 'Deshalb', 'Darum', 'Denn'], answer: 'Trotzdem', explanation: 'trotzdem = nevertheless. Rain (negative) → but the action still happens anyway.' },
  { id: 'c_16', group: 'B – trotzdem', question: 'Ich bin sehr müde. ___ lerne ich noch eine Stunde Deutsch.', options: ['Trotzdem', 'Deswegen', 'Deshalb', 'Damit'], answer: 'Trotzdem', explanation: 'trotzdem: despite tiredness, studying continues. Contrast, not consequence.' },

  // ── sondern ───────────────────────────────────────────────────────────────────
  { id: 'c_17', group: 'B – sondern', question: 'Er wohnt nicht in Berlin, ___ in Hamburg.', options: ['sondern', 'aber', 'oder', 'denn'], answer: 'sondern', explanation: 'sondern = but rather. First clause has "nicht" (negation) → must use sondern, not aber.' },
  { id: 'c_18', group: 'B – sondern', question: 'Ich trinke keinen Kaffee, ___ Tee.', options: ['sondern', 'aber', 'oder', 'und'], answer: 'sondern', explanation: 'sondern after negation (keinen). It replaces the negated thing with the actual thing.' },
  { id: 'c_19', group: 'B – sondern', question: 'Das ist nicht mein Problem, ___ deins.', options: ['sondern', 'aber', 'denn', 'weil'], answer: 'sondern', explanation: 'sondern corrects a false statement: not mine → but yours. "nicht" triggers sondern.' },
  { id: 'c_20', group: 'B – sondern', question: 'Sie lernt nicht nur Deutsch, ___ auch Englisch und Spanisch.', options: ['sondern', 'aber', 'oder', 'und'], answer: 'sondern', explanation: 'nicht nur … sondern auch = not only … but also. "nicht nur" contains a negation → sondern.' },

  // ── aber vs sondern ───────────────────────────────────────────────────────────
  { id: 'c_21', group: 'A/B – aber vs sondern', question: 'Er ist Arzt, ___ er hat nie Zeit für seine Familie.', options: ['aber', 'sondern', 'denn', 'oder'], answer: 'aber', explanation: 'aber = but (simple contrast). No negation in first clause → aber, NOT sondern.' },
  { id: 'c_22', group: 'A/B – aber vs sondern', question: 'Das Essen war lecker, ___ die Portion war zu klein.', options: ['aber', 'sondern', 'denn', 'weil'], answer: 'aber', explanation: 'aber contrasts two facts. No nicht/kein in first clause → aber.' },

  // ── weil ─────────────────────────────────────────────────────────────────────
  { id: 'c_23', group: 'C – weil', question: 'Sie ist sehr glücklich, ___ sie eine neue Arbeit gefunden hat.', options: ['weil', 'denn', 'deshalb', 'damit'], answer: 'weil', explanation: 'weil (Nebensatz) — "hat" is at the end of the clause. With denn it would stay in Pos. 2.' },
  { id: 'c_24', group: 'C – weil', question: 'Ich lerne Deutsch, ___ ich in Deutschland leben möchte.', options: ['weil', 'damit', 'obwohl', 'wenn'], answer: 'weil', explanation: 'weil = because. "möchte" at end of clause confirms Nebensatz word order.' },
  { id: 'c_25', group: 'C – weil', question: 'Er geht nicht zur Party, ___ er krank ist.', options: ['weil', 'denn', 'deshalb', 'obwohl'], answer: 'weil', explanation: 'weil: "ist" at end of clause = Nebensatz. With denn: "denn er ist krank" (Pos. 2).' },

  // ── denn vs weil (tricky) ─────────────────────────────────────────────────────
  { id: 'c_26', group: 'A/C – denn vs weil', question: 'Ich nehme einen Regenschirm mit, ___ es heute regnen soll.', options: ['weil', 'denn', 'deshalb', 'damit'], answer: 'weil', explanation: '"soll" is at end of clause → Nebensatz word order → weil. With denn: "denn es soll heute regnen" (Pos. 2).' },
  { id: 'c_27', group: 'A/C – denn vs weil', question: 'Wir gehen jetzt nach Hause, ___ es wird dunkel.', options: ['denn', 'weil', 'obwohl', 'trotzdem'], answer: 'denn', explanation: '"wird" is in Position 2 = normal Hauptsatz order → denn. With weil: "weil es dunkel wird" (verb last).' },

  // ── dass ─────────────────────────────────────────────────────────────────────
  { id: 'c_28', group: 'C – dass', question: 'Ich hoffe, ___ du bald gesund wirst.', options: ['dass', 'ob', 'weil', 'wenn'], answer: 'dass', explanation: 'dass after hoffen, glauben, denken, sagen, finden. Introduces a known fact or opinion.' },
  { id: 'c_29', group: 'C – dass', question: 'Sie sagt, ___ sie morgen nicht kommen kann.', options: ['dass', 'ob', 'wenn', 'weil'], answer: 'dass', explanation: 'dass after sagen introduces reported speech or a stated fact.' },
  { id: 'c_30', group: 'C – dass', question: 'Es ist schade, ___ du nicht dabei sein kannst.', options: ['dass', 'ob', 'wenn', 'weil'], answer: 'dass', explanation: 'dass after expressions of emotion (es ist schade / toll / wichtig). Introduces a known fact.' },
  { id: 'c_31', group: 'C – dass', question: 'Ich denke, ___ du völlig Recht hast.', options: ['dass', 'ob', 'weil', 'damit'], answer: 'dass', explanation: 'dass after denken — introduces an opinion or thought.' },
  { id: 'c_32', group: 'C – dass', question: 'Es freut mich, ___ du die Prüfung bestanden hast.', options: ['dass', 'ob', 'wenn', 'weil'], answer: 'dass', explanation: 'dass after emotions (es freut mich, es ist schön). The fact is known and stated.' },

  // ── ob ───────────────────────────────────────────────────────────────────────
  { id: 'c_33', group: 'C – ob', question: 'Ich weiß nicht, ___ er heute kommt.', options: ['ob', 'dass', 'wenn', 'falls'], answer: 'ob', explanation: 'ob = whether. Indirect yes/no question: "Kommt er heute?" → Ich weiß nicht, ob er heute kommt.' },
  { id: 'c_34', group: 'C – ob', question: 'Sie fragt, ___ ich mit ihr ins Kino gehen möchte.', options: ['ob', 'dass', 'wenn', 'weil'], answer: 'ob', explanation: 'ob introduces an indirect yes/no question. Original: "Möchtest du mit mir ins Kino gehen?"' },
  { id: 'c_35', group: 'C – ob', question: 'Ich frage mich, ___ das wirklich eine gute Idee ist.', options: ['ob', 'dass', 'weil', 'wenn'], answer: 'ob', explanation: 'ob = whether. "Ich frage mich" = I wonder → introduces doubt or an indirect yes/no question.' },
  { id: 'c_36', group: 'C – ob/dass', question: 'Ich weiß nicht, ___ er die Prüfung bestanden hat.', options: ['ob', 'dass', 'wenn', 'weil'], answer: 'ob', explanation: 'ob = whether. The speaker does not know if he passed or not — indirect yes/no question.' },

  // ── wenn ─────────────────────────────────────────────────────────────────────
  { id: 'c_37', group: 'C – wenn', question: '___ ich Zeit habe, gehe ich gern spazieren.', options: ['Wenn', 'Als', 'Ob', 'Weil'], answer: 'Wenn', explanation: 'wenn = whenever (general condition or repeated situation). Not "als" — this is not a single past event.' },
  { id: 'c_38', group: 'C – wenn', question: '___ du mir hilfst, schaffe ich die Prüfung.', options: ['Wenn', 'Als', 'Ob', 'Falls'], answer: 'Wenn', explanation: 'wenn = if (future condition). The helping is a possible future situation.' },
  { id: 'c_39', group: 'C – wenn', question: 'Immer ___ ich Musik höre, fühle ich mich besser.', options: ['wenn', 'als', 'ob', 'dass'], answer: 'wenn', explanation: '"Immer" (always) signals repetition. Something that happens every time → wenn.' },
  { id: 'c_40', group: 'C – wenn', question: '___ du die Prüfung bestehst, machen wir ein großes Fest!', options: ['Wenn', 'Als', 'Ob', 'Weil'], answer: 'Wenn', explanation: 'wenn = if (future condition). Passing the exam is a future possibility, not a past event.' },

  // ── als ──────────────────────────────────────────────────────────────────────
  { id: 'c_41', group: 'C – als', question: '___ ich jung war, spielte ich jeden Tag Fußball.', options: ['Als', 'Wenn', 'Ob', 'Weil'], answer: 'Als', explanation: 'als = when (one past period or event). Being young describes a specific past period → als.' },
  { id: 'c_42', group: 'C – als', question: '___ er das Ergebnis hörte, war er sehr überrascht.', options: ['Als', 'Wenn', 'Ob', 'Dass'], answer: 'Als', explanation: 'als = when (single past moment). Hearing the result was one specific past event → als.' },
  { id: 'c_43', group: 'C – als', question: '___ ich gestern nach Hause kam, war niemand da.', options: ['Als', 'Wenn', 'Ob', 'Damit'], answer: 'Als', explanation: 'als for a specific single past moment. Coming home yesterday = one occurrence → als.' },

  // ── als vs wenn (tricky) ─────────────────────────────────────────────────────
  { id: 'c_44', group: 'C – als vs wenn', question: 'Früher, ___ wir in Urlaub fuhren, hat es immer geregnet.', options: ['wenn', 'als', 'ob', 'weil'], answer: 'wenn', explanation: '"Immer" + "früher" = something that happened repeatedly in the past → wenn (not als, which is for one single event).' },

  // ── obwohl ────────────────────────────────────────────────────────────────────
  { id: 'c_45', group: 'C – obwohl', question: '___ er sehr müde war, hat er die ganze Nacht gearbeitet.', options: ['Obwohl', 'Weil', 'Damit', 'Nachdem'], answer: 'Obwohl', explanation: 'obwohl = although. Despite being tired, he worked all night — contradiction.' },
  { id: 'c_46', group: 'C – obwohl', question: 'Sie geht zur Arbeit, ___ sie Fieber hat.', options: ['obwohl', 'weil', 'damit', 'wenn'], answer: 'obwohl', explanation: 'obwohl = although. You would expect someone with a fever NOT to go to work, but she does.' },

  // ── trotzdem vs obwohl (tricky) ───────────────────────────────────────────────
  { id: 'c_47', group: 'B/C – trotzdem vs obwohl', question: '___ das Wetter schlecht war, haben wir einen langen Spaziergang gemacht.', options: ['Obwohl', 'Trotzdem', 'Deshalb', 'Weil'], answer: 'Obwohl', explanation: 'obwohl = although (Nebensatz). The verb "war" is at the end of the subordinate clause.' },
  { id: 'c_48', group: 'B/C – trotzdem vs obwohl', question: 'Das Wetter war schlecht. ___ haben wir einen langen Spaziergang gemacht.', options: ['Trotzdem', 'Obwohl', 'Deshalb', 'Weil'], answer: 'Trotzdem', explanation: 'trotzdem = nevertheless (Position 1). Same meaning as obwohl, but written as a new sentence with inverted word order.' },

  // ── während ───────────────────────────────────────────────────────────────────
  { id: 'c_49', group: 'C – während', question: '___ mein Vater kocht, höre ich Musik.', options: ['Während', 'Bevor', 'Nachdem', 'Als'], answer: 'Während', explanation: 'während = while. Two actions happen simultaneously: father cooking + listening to music.' },
  { id: 'c_50', group: 'C – während', question: 'Er hört Musik, ___ er die Hausaufgaben macht.', options: ['während', 'bevor', 'nachdem', 'weil'], answer: 'während', explanation: 'während = while. Both actions — music AND homework — happen at the same time.' },

  // ── bevor ─────────────────────────────────────────────────────────────────────
  { id: 'c_51', group: 'C – bevor', question: '___ ich ins Bett gehe, putze ich mir die Zähne.', options: ['Bevor', 'Nachdem', 'Seitdem', 'Während'], answer: 'Bevor', explanation: 'bevor = before. Brushing teeth happens before going to bed.' },
  { id: 'c_52', group: 'C – bevor', question: '___ du gehst, vergiss nicht, die Tür abzuschließen.', options: ['Bevor', 'Nachdem', 'Als', 'Während'], answer: 'Bevor', explanation: 'bevor = before. Locking the door should happen before leaving.' },

  // ── nachdem ────────────────────────────────────────────────────────────────────
  { id: 'c_53', group: 'C – nachdem', question: '___ ich gegessen habe, mache ich einen Spaziergang.', options: ['Nachdem', 'Bevor', 'Während', 'Damit'], answer: 'Nachdem', explanation: 'nachdem = after. The walk happens after eating is completed. Note the Perfekt in the nachdem clause.' },
  { id: 'c_54', group: 'C – nachdem', question: '___ er das Studium abgeschlossen hatte, suchte er eine Stelle.', options: ['Nachdem', 'Bevor', 'Seitdem', 'Als'], answer: 'Nachdem', explanation: 'nachdem = after. Job search started after finishing the degree (Plusquamperfekt in nachdem clause).' },
  { id: 'c_55', group: 'C – nachdem', question: 'Ich rufe dich an, ___ ich am Bahnhof angekommen bin.', options: ['nachdem', 'bevor', 'während', 'seitdem'], answer: 'nachdem', explanation: 'nachdem = after. The call happens AFTER arriving at the station — sequential events.' },

  // ── damit ─────────────────────────────────────────────────────────────────────
  { id: 'c_56', group: 'C – damit', question: 'Ich lerne jeden Tag Vokabeln, ___ ich beim Sprechen sicherer werde.', options: ['damit', 'sodass', 'weil', 'obwohl'], answer: 'damit', explanation: 'damit = so that (goal). The studying has a specific intended goal: to become more confident speaking.' },
  { id: 'c_57', group: 'C – damit', question: 'Er spricht langsam, ___ alle ihn gut verstehen können.', options: ['damit', 'sodass', 'weil', 'obwohl'], answer: 'damit', explanation: 'damit = goal/intention. He speaks slowly WITH THE INTENTION that everyone understands — future goal.' },
  { id: 'c_58', group: 'C – damit', question: 'Ich mache das Fenster zu, ___ es nicht so kalt wird.', options: ['damit', 'sodass', 'weil', 'falls'], answer: 'damit', explanation: 'damit = so that (intended goal). Closing the window has a desired purpose. The outcome is intended, not yet achieved.' },

  // ── sodass ─────────────────────────────────────────────────────────────────────
  { id: 'c_59', group: 'C – sodass', question: 'Sie hat so viel geübt, ___ sie die Prüfung mit Auszeichnung bestanden hat.', options: ['sodass', 'damit', 'weil', 'obwohl'], answer: 'sodass', explanation: 'sodass = so that (actual result). Passing with distinction already happened — it is the real consequence.' },
  { id: 'c_60', group: 'C – sodass', question: 'Es hat die ganze Nacht geregnet, ___ die Straßen überschwemmt wurden.', options: ['sodass', 'damit', 'obwohl', 'weil'], answer: 'sodass', explanation: 'sodass = actual consequence. Flooded streets are the real result of the rain, not an intention.' },

  // ── damit vs sodass (tricky) ──────────────────────────────────────────────────
  { id: 'c_61', group: 'C – damit vs sodass', question: 'Sie spart Geld, ___ sie nächstes Jahr reisen kann.', options: ['damit', 'sodass', 'weil', 'obwohl'], answer: 'damit', explanation: 'damit = intended future goal. Saving → goal: travel next year. The goal has NOT yet happened.' },
  { id: 'c_62', group: 'C – damit vs sodass', question: 'Er hat sehr laut geschrien, ___ alle Nachbarn aufgewacht sind.', options: ['sodass', 'damit', 'obwohl', 'weil'], answer: 'sodass', explanation: 'sodass = actual result. The waking of neighbors was a real consequence, not an intended goal.' },

  // ── indem ─────────────────────────────────────────────────────────────────────
  { id: 'c_63', group: 'C – indem', question: 'Man verbessert sein Deutsch, ___ man viel liest.', options: ['indem', 'damit', 'obwohl', 'weil'], answer: 'indem', explanation: 'indem = by doing. Describes the METHOD: how to improve German — by reading a lot.' },
  { id: 'c_64', group: 'C – indem', question: 'Er hat mir geholfen, ___ er meine Aufgaben geduldig erklärt hat.', options: ['indem', 'damit', 'weil', 'sodass'], answer: 'indem', explanation: 'indem = by doing. The method of helping was explaining the tasks patiently.' },
  { id: 'c_65', group: 'C – indem', question: 'Man spart Energie, ___ man das Licht ausschaltet, wenn man geht.', options: ['indem', 'damit', 'sodass', 'weil'], answer: 'indem', explanation: 'indem = by doing. The method of saving energy: by switching off the light.' },

  // ── falls ─────────────────────────────────────────────────────────────────────
  { id: 'c_66', group: 'C – falls', question: '___ du Fragen hast, kannst du mich jederzeit anrufen.', options: ['Falls', 'Wenn', 'Ob', 'Weil'], answer: 'Falls', explanation: 'falls = in case. Signals a possible (not certain) future situation. Emphasises possibility more than wenn.' },
  { id: 'c_67', group: 'C – falls', question: '___ es morgen regnet, nehmen wir lieber ein Taxi.', options: ['Falls', 'Als', 'Ob', 'Damit'], answer: 'Falls', explanation: 'falls = in case. Used for uncertain future situations. The rain is possible, not certain.' },

  // ── seitdem ────────────────────────────────────────────────────────────────────
  { id: 'c_68', group: 'C – seitdem', question: '___ ich Yoga mache, schlafe ich viel besser.', options: ['Seitdem', 'Als', 'Wenn', 'Bevor'], answer: 'Seitdem', explanation: 'seitdem = since then. Yoga started at some point in the past, and sleeping better continues until now.' },
  { id: 'c_69', group: 'C – seitdem', question: '___ sie aufgehört hat zu rauchen, fühlt sie sich viel gesünder.', options: ['Seitdem', 'Als', 'Nachdem', 'Bevor'], answer: 'Seitdem', explanation: 'seitdem = since. Stopping smoking started a new ongoing state that continues until now.' },

  // ── sowohl … als auch ─────────────────────────────────────────────────────────
  { id: 'c_70', group: 'D – sowohl … als auch', question: 'Er spricht ___ Englisch als auch Spanisch fließend.', options: ['sowohl', 'weder', 'entweder', 'je'], answer: 'sowohl', explanation: 'sowohl … als auch = both … and. "als auch" is already shown — start with "sowohl".' },
  { id: 'c_71', group: 'D – sowohl … als auch', question: 'Das Buch ist sowohl interessant ___ sehr lehrreich.', options: ['als auch', 'noch', 'oder', 'desto'], answer: 'als auch', explanation: 'sowohl … als auch: "als auch" completes the pair after "sowohl". Combines two positive qualities.' },

  // ── weder … noch ─────────────────────────────────────────────────────────────
  { id: 'c_72', group: 'D – weder … noch', question: 'Ich trinke ___ Kaffee noch Tee — nur Wasser.', options: ['weder', 'sowohl', 'entweder', 'je'], answer: 'weder', explanation: 'weder … noch = neither … nor. "noch" is already shown — start with "weder". Both things are negated.' },
  { id: 'c_73', group: 'D – weder … noch', question: 'Das Wetter war weder schön ___ warm.', options: ['noch', 'als auch', 'oder', 'desto'], answer: 'noch', explanation: 'weder … noch: "noch" completes the pair. Neither nice NOR warm.' },

  // ── entweder … oder ───────────────────────────────────────────────────────────
  { id: 'c_74', group: 'D – entweder … oder', question: '___ du entschuldigst dich, oder ich spreche nicht mehr mit dir.', options: ['Entweder', 'Weder', 'Sowohl', 'Je'], answer: 'Entweder', explanation: 'entweder … oder = either … or. "oder" is already shown — start with "entweder". A clear two-way choice.' },
  { id: 'c_75', group: 'D – entweder … oder', question: 'Wir fahren entweder mit dem Zug ___ wir nehmen das Fahrrad.', options: ['oder', 'noch', 'als auch', 'desto'], answer: 'oder', explanation: 'entweder … oder: "oder" completes the pair. Choice between two options.' },

  // ── je … desto ────────────────────────────────────────────────────────────────
  { id: 'c_76', group: 'D – je … desto', question: '___ mehr man übt, desto besser spricht man Deutsch.', options: ['Je', 'Entweder', 'Sowohl', 'Weder'], answer: 'Je', explanation: 'je … desto = the more … the more. "desto" is shown — start with "je". Both parts use comparatives.' },
  { id: 'c_77', group: 'D – je … desto', question: 'Je früher du anfängst, ___ einfacher wird es.', options: ['desto', 'oder', 'noch', 'als auch'], answer: 'desto', explanation: 'je … desto: "desto" completes the pair. The earlier you start, the easier it becomes.' },
  { id: 'c_78', group: 'D – je … desto', question: '___ länger man wartet, desto schwieriger wird die Situation.', options: ['Je', 'Entweder', 'Weder', 'Sowohl'], answer: 'Je', explanation: 'je … desto = the longer … the more difficult. Both parts use comparative adjectives (länger, schwieriger).' },

  // ── Mixed / review ────────────────────────────────────────────────────────────
  { id: 'c_79', group: 'Review', question: 'Früher, ___ wir in Urlaub fuhren, hat es immer geregnet.', options: ['wenn', 'als', 'ob', 'weil'], answer: 'wenn', explanation: '"Immer" + "früher" = something that happened repeatedly in the past → wenn (not als, which is for one single event).' },
  { id: 'c_80', group: 'Review', question: 'Ich bin nicht sicher, ___ das die richtige Entscheidung war.', options: ['ob', 'dass', 'wenn', 'weil'], answer: 'ob', explanation: 'ob after uncertainty (nicht sicher, nicht wissen). The answer to the underlying question would be yes or no.' },
]

// ─── Reference data ────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'A',
    title: 'Hauptsatz-Konnektoren',
    rule: 'Verb stays in Position 2',
    ruleEx: 'Satz 1  ·  Konnektor  ·  [Verb Pos. 2]  ·  …',
    chipBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    ruleBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    items: [
      {
        word: 'und',
        meaning: 'and',
        example: 'Ich lerne Deutsch, und ich mache jeden Tag Übungen.',
        tip: 'Adds information. No word-order change in either clause.',
      },
      {
        word: 'oder',
        meaning: 'or',
        example: 'Möchtest du Tee, oder möchtest du Kaffee?',
        tip: 'Choice or alternative.',
      },
      {
        word: 'aber',
        meaning: 'but',
        example: 'Ich möchte kommen, aber ich habe keine Zeit.',
        tip: 'Simple contrast.',
        question: 'Are two ideas different?',
      },
      {
        word: 'denn',
        meaning: 'because',
        example: 'Ich bleibe zu Hause, denn ich bin krank.',
        tip: 'Same meaning as weil, but the verb stays in Position 2.',
        compare: [
          { label: 'denn  →  Pos. 2', example: 'denn ich bin krank' },
          { label: 'weil  →  Verb last', example: 'weil ich krank bin' },
        ],
      },
    ],
  },
  {
    id: 'B',
    title: 'Hauptsatz-Konnektoren (Position 1)',
    rule: 'Connector pushes verb before subject',
    ruleEx: 'Konnektor  ·  [VERB]  ·  Subjekt  ·  …',
    chipBg: 'bg-teal-100 text-teal-700 border-teal-200',
    ruleBg: 'bg-teal-50 border-teal-200 text-teal-800',
    items: [
      {
        word: 'deshalb',
        meaning: 'therefore',
        example: 'Ich bin krank. Deshalb bleibe ich zu Hause.',
        tip: 'Reason → consequence.',
      },
      {
        word: 'deswegen',
        meaning: 'because of that',
        example: 'Der Bus hatte Verspätung. Deswegen bin ich zu spät gekommen.',
        tip: 'Almost identical to deshalb.',
      },
      {
        word: 'darum',
        meaning: 'therefore',
        example: 'Es regnet. Darum nehme ich einen Regenschirm mit.',
        tip: 'Same family as deshalb / deswegen.',
      },
      {
        word: 'trotzdem',
        meaning: 'nevertheless',
        example: 'Ich bin müde. Trotzdem lerne ich Deutsch.',
        tip: 'Something negative happened, but the action still happens.',
        compare: [
          { label: 'obwohl  →  Nebensatz', example: 'Obwohl ich müde bin, lerne ich.' },
          { label: 'trotzdem  →  Pos. 1', example: 'Ich bin müde. Trotzdem lerne ich.' },
        ],
      },
      {
        word: 'sondern',
        meaning: 'but rather / but instead',
        example: 'Ich trinke nicht Kaffee, sondern Tee.',
        tip: 'The first clause MUST contain a negation: nicht · kein · keine · keinen',
        trap: {
          correct: 'Er wohnt nicht in Berlin, sondern in Hamburg.',
          wrong: 'Er wohnt in Berlin, sondern in Hamburg.',
        },
        examTip: 'Trigger: not A → B instead  →  choose sondern.',
      },
    ],
  },
  {
    id: 'C',
    title: 'Nebensatz-Konnektoren',
    rule: 'Verb goes to the END of the clause',
    ruleEx: 'Hauptsatz  ·  Konnektor  ·  …  ·  [VERB]',
    chipBg: 'bg-amber-100 text-amber-700 border-amber-200',
    ruleBg: 'bg-amber-50 border-amber-200 text-amber-800',
    items: [
      {
        word: 'weil',
        meaning: 'because',
        example: 'Ich bleibe zu Hause, weil ich krank bin.',
        question: 'Why?',
        trap: {
          correct: 'weil ich krank bin',
          wrong: 'weil ich bin krank',
        },
      },
      {
        word: 'dass',
        meaning: 'that',
        example: 'Ich glaube, dass Deutsch interessant ist.',
        commonVerbs: ['glauben', 'denken', 'hoffen', 'sagen', 'finden'],
      },
      {
        word: 'ob',
        meaning: 'whether / if',
        example: 'Ich weiß nicht, ob er kommt.',
        tip: 'Indirect yes/no question.',
      },
      {
        word: 'wenn',
        meaning: 'if / whenever',
        example: 'Wenn ich Zeit habe, gehe ich joggen.',
        use: ['condition', 'future situation', 'repeated actions'],
      },
      {
        word: 'als',
        meaning: 'when',
        example: 'Als ich klein war, spielte ich Fußball.',
        tip: 'One completed event in the past.',
        shortcut: 'Past + one time  →  als',
      },
      {
        word: 'obwohl',
        meaning: 'although',
        example: 'Obwohl ich müde bin, lerne ich.',
        tip: 'Contradiction — the expected opposite did NOT happen.',
      },
      {
        word: 'während',
        meaning: 'while',
        example: 'Während ich lerne, höre ich Musik.',
        tip: 'Two actions happening at the same time.',
      },
      {
        word: 'bevor',
        meaning: 'before',
        example: 'Bevor ich esse, wasche ich meine Hände.',
        tip: 'Action not yet completed at that point in time.',
      },
      {
        word: 'nachdem',
        meaning: 'after',
        example: 'Nachdem ich gegessen habe, gehe ich spazieren.',
        tip: 'Action already completed before the next one starts.',
      },
      {
        word: 'damit',
        meaning: 'so that (goal)',
        example: 'Ich lerne Deutsch, damit ich die Prüfung bestehe.',
        question: 'For what purpose?',
        tip: 'Expresses a goal or intention.',
      },
      {
        word: 'sodass',
        meaning: 'so that (result)',
        example: 'Ich habe viel gelernt, sodass ich die Prüfung bestanden habe.',
        question: 'What was the result?',
        compare: [
          { label: 'damit  →  goal', example: 'Ich lerne, damit ich bestehe.' },
          { label: 'sodass  →  result', example: 'Ich lernte viel, sodass ich bestand.' },
        ],
      },
      {
        word: 'indem',
        meaning: 'by doing',
        example: 'Man lernt Deutsch, indem man jeden Tag übt.',
        question: 'How / by what means?',
        tip: 'Describes the method or way of doing something.',
      },
      {
        word: 'falls',
        meaning: 'in case / if',
        example: 'Falls es regnet, bleiben wir zu Hause.',
        tip: 'Very similar to wenn. Used for possible future situations.',
      },
      {
        word: 'seitdem',
        meaning: 'since then',
        example: 'Seitdem ich in Deutschland wohne, spreche ich mehr Deutsch.',
        tip: 'Starting point in the past → action continues until now.',
      },
    ],
  },
  {
    id: 'D',
    title: 'Double Connectors',
    rule: 'Two-part connectors — very useful for B1 writing',
    chipBg: 'bg-rose-100 text-rose-700 border-rose-200',
    ruleBg: 'bg-rose-50 border-rose-200 text-rose-800',
    items: [
      {
        word: 'sowohl … als auch',
        meaning: 'both … and',
        example: 'Ich spreche sowohl Deutsch als auch Englisch.',
        tip: 'Adds two positive things.',
      },
      {
        word: 'weder … noch',
        meaning: 'neither … nor',
        example: 'Ich trinke weder Kaffee noch Tee.',
        tip: 'Neither one nor the other — both negated.',
      },
      {
        word: 'entweder … oder',
        meaning: 'either … or',
        example: 'Wir fahren entweder mit dem Zug oder mit dem Auto.',
        tip: 'A choice between exactly two options.',
      },
      {
        word: 'je … desto',
        meaning: 'the more … the more',
        example: 'Je mehr ich übe, desto besser spreche ich Deutsch.',
        tip: 'As one thing increases, the other increases too.',
      },
    ],
  },
]

const QUICK_TABLE = [
  { meaning: 'and', connectors: ['und'] },
  { meaning: 'or', connectors: ['oder'] },
  { meaning: 'but', connectors: ['aber'] },
  { meaning: 'not A but B', connectors: ['sondern'] },
  { meaning: 'because', connectors: ['weil', 'denn'] },
  { meaning: 'therefore', connectors: ['deshalb', 'deswegen', 'darum'] },
  { meaning: 'nevertheless', connectors: ['trotzdem'] },
  { meaning: 'that', connectors: ['dass'] },
  { meaning: 'whether', connectors: ['ob'] },
  { meaning: 'if / whenever', connectors: ['wenn'] },
  { meaning: 'in case', connectors: ['falls'] },
  { meaning: 'when (past, once)', connectors: ['als'] },
  { meaning: 'although', connectors: ['obwohl'] },
  { meaning: 'while', connectors: ['während'] },
  { meaning: 'before', connectors: ['bevor'] },
  { meaning: 'after', connectors: ['nachdem'] },
  { meaning: 'so that (goal)', connectors: ['damit'] },
  { meaning: 'so that (result)', connectors: ['sodass'] },
  { meaning: 'by doing', connectors: ['indem'] },
  { meaning: 'since then', connectors: ['seitdem'] },
  { meaning: 'both … and', connectors: ['sowohl … als auch'] },
  { meaning: 'neither … nor', connectors: ['weder … noch'] },
  { meaning: 'either … or', connectors: ['entweder … oder'] },
  { meaning: 'the more … the more', connectors: ['je … desto'] },
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

export default function Connectors() {
  const [tab, setTab] = useState('exercise')
  const [refSection, setRefSection] = useState('A')

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Konnektoren</h1>
      <p className="text-base text-gray-400 mb-8">TELC B1 · 27 connectors · 30 questions per session from a pool of {EXERCISES.length}</p>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 w-fit">
        {[['exercise', 'Exercise'], ['reference', 'Reference']].map(([key, label]) => (
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

      {tab === 'exercise' ? (
        <ExerciseTab />
      ) : (
        <>
          <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
            {[...SECTIONS.map(s => s.id), 'Table'].map(key => (
              <button
                key={key}
                onClick={() => setRefSection(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  refSection === key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          {refSection === 'Table'
            ? <QuickTable />
            : <SectionView section={SECTIONS.find(s => s.id === refSection)} />
          }
        </>
      )}
    </div>
  )
}

// ─── Exercise tab ─────────────────────────────────────────────────────────────

const SESSION_SIZE = 30

function ExerciseTab() {
  const [questions, setQuestions] = useState(() => shuffle(EXERCISES).slice(0, SESSION_SIZE))
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
    setQuestions(shuffle(EXERCISES).slice(0, SESSION_SIZE))
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
          {pct >= 90 ? 'Excellent! You have a strong grasp of German connectors.' :
           pct >= 70 ? 'Good work! Review the tricky pairs in the Reference tab.' :
           'Keep practicing! Focus on the word order rules in sections A, B, and C.'}
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
      <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
        <span>Question {index + 1} of {questions.length}</span>
        <span>{score} correct</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${(index / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{q.group}</span>
        </div>
        <div className="px-6 pt-6 pb-5">
          <p className="text-lg text-gray-900 font-medium leading-relaxed mb-6">
            {q.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[4rem] mx-1 border-b-2 text-center font-bold px-1 ${
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
                  className={`py-3 px-2 rounded-2xl text-sm font-medium transition-all ${style}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

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

// ─── Section view ─────────────────────────────────────────────────────────────

function SectionView({ section }) {
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl px-5 py-4 border ${section.ruleBg}`}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-50">Rule</p>
        <p className="text-sm font-bold">{section.rule}</p>
        {section.ruleEx && (
          <p className="text-xs font-mono mt-1.5 opacity-60 tracking-wide">{section.ruleEx}</p>
        )}
      </div>

      {section.items.map(item => (
        <ConnectorCard key={item.word} item={item} section={section} />
      ))}
    </div>
  )
}

// ─── Connector card ───────────────────────────────────────────────────────────

function ConnectorCard({ item, section }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
        <span className={`text-lg font-bold px-4 py-1 rounded-2xl border ${section.chipBg}`}>
          {item.word}
        </span>
        <span className="text-sm text-gray-400">{item.meaning}</span>
      </div>

      <div className="px-6 pb-5 space-y-3">
        <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-gray-100">
          <p className="text-sm italic text-gray-700 leading-relaxed">{item.example}</p>
        </div>

        {item.question && (
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Question:</span> {item.question}
          </p>
        )}

        {item.tip && (
          <p className="text-xs text-gray-500 leading-relaxed">{item.tip}</p>
        )}

        {item.commonVerbs && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Common verbs used with dass:</p>
            <div className="flex flex-wrap gap-1.5">
              {item.commonVerbs.map(v => (
                <span key={v} className={`text-xs font-medium px-2.5 py-0.5 rounded-lg border ${section.chipBg}`}>{v}</span>
              ))}
            </div>
          </div>
        )}

        {item.use && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Use for:</p>
            <div className="flex flex-wrap gap-1.5">
              {item.use.map(u => (
                <span key={u} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-lg">{u}</span>
              ))}
            </div>
          </div>
        )}

        {item.shortcut && (
          <div className={`rounded-2xl px-4 py-2.5 border ${section.ruleBg}`}>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5 opacity-50">Exam shortcut</p>
            <p className="text-sm font-semibold">{item.shortcut}</p>
          </div>
        )}

        {item.compare && (
          <div className="grid grid-cols-2 gap-2">
            {item.compare.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                <p className="text-sm font-mono text-gray-800 leading-relaxed">{c.example}</p>
              </div>
            ))}
          </div>
        )}

        {item.trap && (
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <span className="text-red-400 text-xs font-bold mt-0.5 flex-shrink-0">✗</span>
              <p className="text-sm font-mono text-red-600">{item.trap.wrong}</p>
            </div>
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <span className="text-green-500 text-xs font-bold mt-0.5 flex-shrink-0">✓</span>
              <p className="text-sm font-mono text-green-700">{item.trap.correct}</p>
            </div>
          </div>
        )}

        {item.examTip && (
          <div className="bg-amber-50 rounded-2xl px-4 py-3 border border-amber-200">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-0.5">Exam tip</p>
            <p className="text-xs text-amber-700 leading-relaxed">{item.examTip}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Quick table ──────────────────────────────────────────────────────────────

function QuickTable() {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-800">Quick Decision Table</p>
        <p className="text-xs text-gray-400 mt-0.5">Find the right connector by meaning. Useful during the writing section of the exam.</p>
      </div>
      <div className="divide-y divide-gray-50">
        {QUICK_TABLE.map(({ meaning, connectors }) => (
          <div key={meaning} className="flex items-center px-6 py-3 gap-4">
            <span className="text-sm text-gray-500 min-w-[10rem] flex-shrink-0">{meaning}</span>
            <div className="flex flex-wrap gap-1.5">
              {connectors.map(c => (
                <span key={c} className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 px-3 py-0.5 rounded-xl">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
