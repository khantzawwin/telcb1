# TELC B1 Trainer

A personal web app for preparing for the **telc Deutsch B1** exam. It turns a single Markdown notes file into an interactive study tool with spaced-repetition flashcards, grammar drills, verb practice, and AI-assisted writing and speaking feedback.

Built with React + Vite, styled with Tailwind, and backed by Firebase (Auth + Firestore + Hosting). It's a PWA, so it can be installed on a phone and used like a native app.

## Features

- **Dashboard** — daily study sessions (morning / evening slots) and a snapshot of cards due for review.
- **Vocabulary & Flashcards** — spaced-repetition (SRS) review built from the notes; progress is saved per user.
- **Grammar** — a rotating grammar topic each day with rules, tables, and multiple-choice exercises. Content is authored in `notes.md`; exercises live in `src/utils/grammarExercises.js`.
- **Verben mit Präpositionen** — fill-in-the-blank drills for verb + preposition collocations, with a reference list.
- **`werden` deep-dive** — a dedicated page covering every use of *werden* (full verb, future, passive, probability, Konjunktiv II) with a reference section and practice quiz.
- **Connectors** — practice for German connectors / conjunctions.
- **Writing** — guided writing tasks with **AI feedback** (Google Gemini).
- **Speaking (Sprechen)** — speaking prompts with **AI feedback** (Google Gemini).
- **Google sign-in**, per-user progress, and offline-capable PWA.

## Tech stack

| Area | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 |
| Auth / DB / Hosting | Firebase (Google Auth, Firestore, Hosting) |
| AI feedback | Google Gemini (`gemini-2.5-flash-lite`) |
| PWA | vite-plugin-pwa |

## Getting started

### Prerequisites

- Node.js 20+
- A Firebase project (Firestore in **production** mode + Google sign-in enabled)
- A Google Gemini API key (optional — only needed for Writing & Speaking feedback)

### Setup

```bash
git clone https://github.com/<your-username>/telcb1.git
cd telcb1
npm install
```

Create a `.env.local` file from the example and fill in your Firebase config (see `.env.example`):

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# Optional — enables AI feedback in Writing & Speaking
VITE_GEMINI_API_KEY=...
```

### Run locally

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Study content

All lesson content (vocabulary and grammar) lives in a single Markdown file, `public/notes.md`, which is fetched and parsed at runtime (`src/utils/parseNotes.js`). The canonical source is kept outside the repo and copied in with:

```bash
./sync-notes.sh   # copies the source notes.md into public/, then commit & push
```

Grammar exercises are hand-written in `src/utils/grammarExercises.js`, keyed by the slugified grammar topic title.

## Firestore data model

Per-user data is stored under `users/{uid}/...`:

- `meta/cardProgress` — SRS progress for every flashcard
- `sessions/{YYYY-MM-DD}` — daily session completion (flashcards, verbs, writing, `werden`, …)
- `grammar/{YYYY-MM-DD}` — daily grammar practice result
- `writing/{YYYY-MM-DD}` — writing task submissions

Security rules (`firestore.rules`) restrict every document to its owner:

```
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the app and deploys it to **Firebase Hosting**. The Firebase config and Gemini key are provided as GitHub repository secrets (same names as the `VITE_*` variables above), plus a `FIREBASE_SERVICE_ACCOUNT` secret for the deploy step.

To deploy Firestore rules (not part of the hosting workflow):

```bash
firebase deploy --only firestore:rules
```

## Project structure

```
src/
  pages/        Dashboard, Vocabulary, Flashcards, Grammar, Verben,
                Werden, Connectors, Writing, Sprechen, Login
  components/   Layout (nav shell), ProtectedRoute
  contexts/     Auth, Notes, NavGuard
  utils/        parseNotes, grammarExercises, srs
  firebase.js   Firebase app / Auth / Firestore init
public/
  notes.md      All lesson content (source of study material)
```

## License

[MIT](LICENSE) © khantzawwin
