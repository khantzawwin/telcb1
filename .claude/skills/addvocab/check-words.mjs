// Check that words in public/notes.md parse into Vocab cards.
// Usage (from the repo root): node .claude/skills/addvocab/check-words.mjs "der Verbrecher" "verurteilen"
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const { parseNotes, buildCardList } = await import(resolve(root, 'src/utils/parseNotes.js'))
const cards = buildCardList(parseNotes(readFileSync(resolve(root, 'public/notes.md'), 'utf8')))

const words = process.argv.slice(2)
let missing = 0
for (const w of words) {
  const hits = cards.filter(c => c.word.toLowerCase() === w.toLowerCase())
  if (!hits.length) {
    missing++
    console.log(`✗ ${w} — not found as a card`)
  } else {
    for (const c of hits) console.log(`✓ ${c.word} — ${c.translation} · ${c.level} · ${c.lessonTitle}${c.example ? '' : ' · (no example)'}`)
  }
}
console.log(`${cards.length} cards total${missing ? ` · ${missing} missing` : ''}`)
process.exit(missing ? 1 : 0)
