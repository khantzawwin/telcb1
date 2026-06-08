export function parseNotes(markdown) {
  const lessons = []
  const lessonBlocks = markdown.split(/\n(?=## (?:Lektion|Klasse))/).filter(Boolean)

  for (const block of lessonBlocks) {
    const lessonMatch = block.match(/^## Lektion (\d+)\s*[—-]\s*(.+)/)
    const klasseMatch = block.match(/^## Klasse K(\d+)\s*[—-]\s*(.+)/)
    if (!lessonMatch && !klasseMatch) continue

    const lessonNum = lessonMatch
      ? parseInt(lessonMatch[1])
      : parseInt(klasseMatch[1]) + 100 // K3 → 103, K5 → 105, etc.
    const lessonTitle = (lessonMatch || klasseMatch)[2].trim()

    const vocabulary = parseVocabulary(block)
    const grammar = parseGrammar(block)

    lessons.push({ number: lessonNum, title: lessonTitle, vocabulary, grammar })
  }

  lessons.sort((a, b) => a.number - b.number)
  return lessons
}

function parseVocabulary(block) {
  const vocabMatch = block.match(/### Vocabulary([\s\S]*?)(?=\n### |$)/)
  if (!vocabMatch) return []

  const vocabText = vocabMatch[1]
  const words = []

  // Split by category headers
  const categories = vocabText.split(/\n#### /)
  for (const cat of categories) {
    if (!cat.trim()) continue
    const catLine = cat.split('\n')[0].trim().toLowerCase()
    let type = 'other'
    if (catLine.includes('noun')) type = 'noun'
    else if (catLine.includes('verb')) type = 'verb'
    else if (catLine.includes('adjective') || catLine.includes('adverb')) type = 'adjective'
    else if (catLine.includes('phrase') || catLine.includes('expression')) type = 'phrase'

    // Split entries by horizontal rule
    const entries = cat.split(/\n---+\n/)
    for (const entry of entries) {
      const word = parseWordEntry(entry.trim(), type)
      if (word) words.push(word)
    }
  }

  return words
}

function parseWordEntry(text, type) {
  if (!text || text.length < 5) return null

  // Match: **word** (optional info) — *translation*
  const headerMatch = text.match(/^\*\*(.+?)\*\*(.+?)?[—–-]\s*\*(.+?)\*/)
  if (!headerMatch) return null

  const rawWord = headerMatch[1].trim()
  const info = (headerMatch[2] || '').trim()
  const translation = headerMatch[3].trim()

  // Extract example sentences (lines starting with >)
  const exampleLines = text.match(/^> (.+)/gm) || []
  const examples = []
  for (let i = 0; i < exampleLines.length; i += 2) {
    const german = exampleLines[i]?.replace(/^> /, '').trim()
    const english = exampleLines[i + 1]?.replace(/^> \*?\(/, '').replace(/\)\*?$/, '').trim()
    if (german) examples.push({ german, english: english || '' })
  }

  // Extract bullet notes
  const notes = (text.match(/^- .+/gm) || []).map(l => l.replace(/^- /, '').trim())

  return {
    id: rawWord.toLowerCase().replace(/[^a-zäöüß]/gi, '_'),
    word: rawWord,
    translation,
    info,
    type,
    notes,
    examples,
  }
}

function parseGrammar(block) {
  const grammarMatch = block.match(/### Grammar([\s\S]*?)(?=\n## |$)/)
  if (!grammarMatch) return []

  const grammarText = grammarMatch[1]
  const topics = []

  const topicBlocks = grammarText.split(/\n#### /).filter(s => s.trim())
  for (const tb of topicBlocks) {
    const titleLine = tb.split('\n')[0].trim()
    if (!titleLine || titleLine.includes('No grammar')) continue

    const body = tb.slice(titleLine.length).trim()

    // Extract example sentences
    const exampleLines = tb.match(/^> .+/gm) || []
    const examples = []
    for (let i = 0; i < exampleLines.length; i += 2) {
      const german = exampleLines[i]?.replace(/^> /, '').trim()
      const english = exampleLines[i + 1]?.replace(/^> \*?\(?/, '').replace(/\)?\*?$/, '').trim()
      if (german && !german.startsWith('*')) examples.push({ german, english: english || '' })
    }

    topics.push({ id: slugify(titleLine), title: titleLine, body, examples })
  }

  return topics
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// Build flat card list for SRS — one card per vocabulary word
export function buildCardList(lessons) {
  const cards = []
  for (const lesson of lessons) {
    for (const word of lesson.vocabulary) {
      if (!word.word || !word.translation) continue
      cards.push({
        id: `l${lesson.number}_${word.id}`,
        word: word.word,
        translation: word.translation,
        type: word.type,
        lesson: lesson.number,
        lessonTitle: lesson.title,
        info: word.info,
        notes: word.notes,
        example: word.examples[0]?.german || '',
        exampleTranslation: word.examples[0]?.english || '',
      })
    }
  }
  return cards
}

// Build flat grammar topic list
export function buildGrammarList(lessons) {
  const topics = []
  for (const lesson of lessons) {
    for (const g of lesson.grammar) {
      topics.push({
        ...g,
        lesson: lesson.number,
        lessonTitle: lesson.title,
      })
    }
  }
  return topics
}
