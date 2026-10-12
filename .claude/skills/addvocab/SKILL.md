---
name: addvocab
description: Add German vocabulary to the TELC trainer. Use when the user runs /addvocab or pastes new German words (with or without definitions/examples) to add to their notes, Vocab list and flashcards.
---

# /addvocab — add words to the notes, Vocab and flashcards

The user pastes German words, often with a rough definition or an example sentence from class.
Turn each one into a clean notes entry, using the **better** definition and example when theirs can be improved.

## Where words live
- **Source of truth:** `/Users/kzw/Documents/Claude/Projects/Telc_B1_Notes/notes.md`. Always edit this file, never only `public/notes.md`.
- `./sync-notes.sh` copies it to `public/notes.md`, which the app parses with `src/utils/parseNotes.js`.
  Every `**headword** … — *translation*` line under `### Vocabulary` becomes a Vocab entry and a flashcard.

## Steps

1. **Back up first:** copy the notes file to the scratchpad before editing.

2. **Check for duplicates:** grep the notes for each headword, e.g. `grep -n '^\*\*der Verbrecher\*\*'`.
   If a word is already there, don't add it again. Tell the user where it already is, and add a new meaning or example to that entry only if theirs adds something.

3. **Work out each word:**
   - **Nouns:** article, plural, and the female form if one exists (`der Lehrer` → `die Lehrerin, pl. -innen`).
   - **Verbs:** Perfekt (`hat/ist` + Partizip II), required preposition and case (`sich gewöhnen an + Akk.`), and whether it's reflexive or separable.
   - **English meaning:** pick the one that fits **the user's sentence or class context**, not just the first dictionary meaning (e.g. *Eisbrecher* in class = icebreaker activity, not the ship). List other common meanings as ① ② bullets.
   - When unsure about a meaning, spelling (e.g. *wohlfühlen* vs *wohl fühlen*), plural or Perfekt auxiliary, check with WebSearch (Duden, Wiktionary, verbformen). Cite the sources in the final reply.

4. **Definitions and examples: keep or improve:**
   - Keep the user's example when it's correct and natural, because it comes from their class.
   - Fix grammar mistakes (e.g. *mit Menschen kämpfe* → *kämpfen*) and **tell the user what you changed and why**.
   - If their sentence doesn't actually use the word, move it to the word it does use, or write a better B1-level example.
   - If a word has no example, write one: short, everyday and TELC-relevant.
   - Every example gets an English translation on the next line.

5. **Choose the section:**
   - By default, append to the **last `## Klasse K<n>` section** at the end of the file, under the right `#### Nouns` / `#### Verbs` / `#### Adjectives` / `#### Phrases` heading. Create the heading if it's missing.
   - If the user names a new class or topic, or the words clearly belong together as a new topic, create a new section `## Klasse K<n+2> — <Deutsches Thema> (<English topic>)`. Classes go up in odd numbers: K13, K15, K17 …
   - Never edit or reorder other parts of the file. The notes are also maintained by another agent.

6. **Write each entry in exactly this format.** The parser depends on it:

   ```markdown
   **der Verbrecher** (pl. die Verbrecher) — *criminal* — (female: die Verbrecherin, pl. -innen)
   - Related: *das Verbrechen* = crime
   - (more bullets: other meanings, collocations, opposites, ⚠️ pitfalls)

   > Die Polizei hat den Verbrecher verhaftet.
   > *(The police arrested the criminal.)*

   ---
   ```

   ```markdown
   **verurteilen** — *to sentence / to convict (in court)*
   - Perfekt: **hat verurteilt**
   - *jemanden zu + Dat. verurteilen* → *zu drei Jahren Haft verurteilen*

   > Nur der Richter kann einen Verbrecher verurteilen.
   > *(Only the judge can sentence a criminal.)*

   ---
   ```

   Rules:
   - The headword line starts with `**…**`, then optional info, then ` — *translation*`.
   - Bullets start with `- `.
   - The example is two `> ` lines (German, then `*(English)*`).
   - Each entry ends with `---`.
   - Don't start any other line with `**word** … — *…*`, or it will be read as a separate word.

7. **Sync and verify:**
   ```bash
   cd /Users/kzw/Documents/GitHub/telcb1 && ./sync-notes.sh
   node .claude/skills/addvocab/check-words.mjs "der Verbrecher" "verurteilen"
   ```
   Every word must show `✓`. If one shows `✗`, fix its headword line and run the check again.

8. **Reply with:**
   - a table: Word | Meaning chosen | Example;
   - a short list of what you changed in their definitions/examples and why;
   - any duplicates you skipped;
   - Sources (if you searched).

   **Don't commit or push** unless the user asks. A push to main deploys automatically through the GitHub Action, so never run `firebase deploy`.
