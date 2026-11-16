// Records the date each vocab card was added to the website, in public/vocab-dates.json.
// Dates already in the file are kept. A new card gets the git-blame date of its
// headword line (today, if the line isn't committed yet).
// Run from the repo root: node scripts/vocab-dates.mjs  (sync-notes.sh runs it for you)
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { parseNotes, buildCardList } from '../src/utils/parseNotes.js'

const NOTES = 'public/notes.md'
const OUT = 'public/vocab-dates.json'

const text = readFileSync(NOTES, 'utf8')
const lines = text.split('\n')
const cards = buildCardList(parseNotes(text))
const dates = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}

const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
let blame = null
function blameDates() {
  if (blame) return blame
  try {
    blame = execSync(`git blame --date=short -c ${NOTES}`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
      .split('\n')
      .map(l => l.match(/\d{4}-\d{2}-\d{2}/)?.[0] || today)
  } catch {
    blame = []
  }
  return blame
}

// Cards come in file order, so search forward from the last match
const find = (from, ok) => { for (let k = from; k < lines.length; k++) if (ok(lines[k])) return k; return -1 }
let added = 0, cursor = 0
for (const c of cards) {
  const head = l => l.startsWith(`**${c.word}**`)
  let i = find(cursor, l => head(l) && l.includes(c.translation))
  if (i < 0) i = find(cursor, head)
  if (i >= 0) cursor = i + 1
  if (dates[c.id]) continue
  dates[c.id] = (i >= 0 && blameDates()[i]) || today
  added++
}

const sorted = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(OUT, JSON.stringify(sorted, null, 1) + '\n')
console.log(`✓ Vocab dates: ${added} new, ${Object.keys(sorted).length} total`)
