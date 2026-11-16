#!/bin/bash
# Syncs the latest notes from the Claude Projects folder into the web app.
# Run this whenever notes.md is updated, then commit and push.

set -e

SRC="/Users/kzw/Documents/Claude/Projects/Telc_B1_Notes/notes.md"
DEST="$(dirname "$0")/public/notes.md"

cp "$SRC" "$DEST"
echo "✓ Synced notes.md ($(wc -l < "$DEST") lines)"
(cd "$(dirname "$0")" && node scripts/vocab-dates.mjs)
echo ""
echo "Next: git add public/notes.md public/vocab-dates.json && git commit -m 'update notes' && git push"
