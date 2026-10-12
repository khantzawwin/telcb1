// Grammar is organised by theme, not by lesson. Each notes topic (ID from
// parseNotes.js slugify) belongs to exactly one theme, or to Writing/Speaking.
// Topics not listed anywhere show up under "Weitere Themen" so new notes
// topics are never lost — add them to a theme here.

export const THEMES = [
  {
    id: 'konnektoren',
    title: 'Konnektoren & Nebensätze',
    drill: { to: '/grammar/konnektoren/practice', sessionKey: 'connectors' },
    topics: [
      'als_vs_wenn_when_in_german',
      'kausale_konnektoren_deshalb_deswegen_darum_daher',
      'damit_so_that_final_clause_purpose_nebensatz',
      'obwohl_although_concessive_clause_nebensatz_and_obwohl_vs_trotzdem',
      'temporale_konnektoren_seit_bis_bevor_w_hrend_temporal_subordinate_clauses',
      'seit_vor_bis_bevor_w_hrend_zeitw_rter_richtig_verwenden',
      'nachdem_after',
      'dass_so_dass_sodass_consequence_result_clauses',
      'indem_by_doing_by_means_of',
      'ohne_ohne_dass_an_statt_an_statt_dass',
      'wegen_trotz_genitiv_alternatives_to_weil_obwohl',
      'zweiteilige_konnektoren_weder_noch_sowohl_als_auch_nicht_nur_sondern_auch',
      'entweder_oder_either_or',
      'zwar_aber_admittedly_but_it_s_true_but',
      'je_komparativ_desto_umso_komparativ',
    ],
  },
  {
    id: 'verben',
    title: 'Verben mit Präpositionen',
    drill: { to: '/grammar/verben/practice', sessionKey: 'verben' },
    topics: ['verben_mit_pr_positionen'],
  },
  {
    id: 'werden',
    title: 'werden, Passiv & Futur',
    drill: { to: '/grammar/werden/practice', sessionKey: 'werden' },
    topics: [
      'wurde_w_rde_wird_worden_geworden_die_formen_von_werden',
      'das_passiv_the_passive_voice',
      'passiv_pr_sens_mit_modalverb_passive_present_with_modal_verb',
      'die_zukunft_ausdr_cken_pr_sens_futur_i_expressing_the_future',
    ],
  },
  {
    id: 'konjunktiv',
    title: 'Konjunktiv II & Bedingungen',
    drill: {
      to: '/grammar/konjunktiv/practice',
      sessionKey: 'konjunktiv',
      title: 'Konjunktiv II: Wünsche & Bitten (wäre, hätte, könnte …)',
    },
    topics: [
      'war_w_re_hatte_h_tte_indikativ_oder_konjunktiv_ii',
      'modalverben_im_konjunktiv_ii_modal_verbs_in_subjunctive_ii',
      'wenn_reale_irreale_bedingung_real_unreal_conditions',
      'irreale_bedingungen_in_der_vergangenheit_was_w_re_gewesen_wenn_unreal_past_conditions',
      'irrealer_vergleich_mit_als_ob_unreal_comparison',
    ],
  },
  {
    id: 'relativ',
    title: 'Relativsätze',
    topics: [
      'relativpronomen_relative_pronouns',
      'relativpronomen_dessen_deren_denen_genitive_dative_plural',
      'relativs_tze_mit_was_und_wo_relative_clauses_with_was_and_wo',
    ],
  },
  {
    id: 'vergangenheit',
    title: 'Zeitformen der Vergangenheit',
    drill: {
      to: '/grammar/vergangenheit/practice',
      sessionKey: 'vergangenheit',
      title: 'Perfekt, Präteritum, Plusquamperfekt & unregelmäßige Verben',
    },
    topics: ['die_drei_vergangenheitsformen_perfekt_pr_teritum_plusquamperfekt'],
  },
  {
    id: 'adjektive',
    title: 'Adjektive',
    topics: [
      'adjektivdeklination_3_typen_adjective_declension_3_types',
      'komparativ_superlativ_comparison_of_adjectives',
      'adjektiv_nomen_adjektivische_substantive',
    ],
  },
  {
    id: 'pronomen',
    title: 'Pronomen & Artikel',
    topics: [
      'personalpronomen_deklination_nach_f_llen_ich_mich_mir',
      'possessivartikel_possessivpronomen_mein_dein_sein',
    ],
  },
  {
    id: 'infinitiv',
    title: 'Infinitiv: zu, lassen, brauchen',
    topics: [
      'infinitiv_mit_zu_infinitive_with_zu',
      'lassen_infinitiv',
      'brauchen_nicht_keine_nur_zu_infinitiv',
    ],
  },
  {
    id: 'fehler',
    title: 'Häufige Fehler',
    topics: ['das_oder_dass_seit_oder_seid_h_ufig_verwechselte_w_rter'],
  },
]

export const WRITING_TOPICS = ['formelle_halbformelle_e_mail_schreiben_writing_formal_semi_formal_emails']
export const SPEAKING_TOPICS = ['redemittel_tatsachen_und_meinungen_diskutieren_discussing_facts_opinions']

const OTHER = { id: 'weitere', title: 'Weitere Themen', topics: [] }

// Themes with resolved topic objects (in theme order). Unmapped notes topics
// go into "Weitere Themen", which is only included when non-empty.
export function groupTopics(grammarTopics) {
  const byId = Object.fromEntries(grammarTopics.map(t => [t.id, t]))
  const placed = new Set([...WRITING_TOPICS, ...SPEAKING_TOPICS])

  const themes = THEMES.map(theme => {
    const items = theme.topics.filter(id => byId[id]).map(id => byId[id])
    items.forEach(t => placed.add(t.id))
    return { ...theme, items }
  })

  if (import.meta.env?.DEV && grammarTopics.length) {
    const missing = [...THEMES.flatMap(t => t.topics), ...WRITING_TOPICS, ...SPEAKING_TOPICS].filter(id => !byId[id])
    if (missing.length) console.warn('[grammarThemes] mapped topic IDs not in notes:', missing)
  }

  const other = grammarTopics.filter(t => !placed.has(t.id))
  if (other.length) themes.push({ ...OTHER, items: other })
  return themes
}

// Where a topic lives: its theme, or the Writing/Speaking page
export function topicHome(grammarTopics, topicId) {
  if (WRITING_TOPICS.includes(topicId)) return { to: '/writing', label: 'Writing', items: [] }
  if (SPEAKING_TOPICS.includes(topicId)) return { to: '/sprechen', label: 'Speaking', items: [] }
  const theme = groupTopics(grammarTopics).find(th => th.items.some(t => t.id === topicId))
  return theme
    ? { to: `/grammar#${theme.id}`, label: theme.title, items: theme.items }
    : { to: '/grammar', label: 'Grammar', items: [] }
}
