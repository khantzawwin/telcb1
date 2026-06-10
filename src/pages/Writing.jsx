import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { getTodayKey } from '../utils/srs'

// ─── Gemini setup ─────────────────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = GEMINI_API_KEY
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
  : null

// ─── Writing prompts (30 days) ────────────────────────────────────────────────

const PROMPTS = [
  // ── Formal ────────────────────────────────────────────────────────────────
  {
    id: 1, type: 'formal', title: 'Language Course Enquiry',
    situation: 'You saw an advertisement for a German course at Sprachschule Berliner Tor. Write an email asking for information.',
    addressee: 'Sprachschule Berliner Tor',
    points: ['Introduce yourself and state why you are writing','Ask about the course schedule and duration','Enquire about the fees and any available discounts','Ask whether the course suits B1-level learners','Ask how and when you can register'],
  },
  {
    id: 2, type: 'formal', title: 'Hotel Complaint',
    situation: 'You stayed at Hotel Seeblick last week and were unhappy with your experience. Write a complaint letter to the hotel manager.',
    addressee: 'the hotel manager of Hotel Seeblick',
    points: ['Explain when you stayed and what you booked','Describe the first problem you encountered (e.g. room not ready, noise)','Describe a second problem (e.g. breakfast quality, staff behaviour)','Say how these problems affected your stay','State what you expect as compensation'],
  },
  {
    id: 3, type: 'formal', title: 'Job Application',
    situation: 'You saw a vacancy for a part-time office assistant at a local company. Write a letter applying for the position.',
    addressee: 'the personnel department',
    points: ['State where you saw the advertisement and which position you are applying for','Briefly introduce your educational background','Describe your relevant work experience','Explain why you are interested in this particular company','State your availability and how they can contact you'],
  },
  {
    id: 4, type: 'formal', title: 'Appointment at the Ausländerbehörde',
    situation: 'You need to extend your residence permit. Write an email to the Ausländerbehörde requesting an appointment.',
    addressee: 'the Ausländerbehörde (Immigration Office)',
    points: ['State the purpose of your email clearly','Provide your personal details (name, date of birth, nationality)','Explain when your current permit expires','Ask for an appointment and mention preferred dates','Ask what documents you need to bring'],
  },
  {
    id: 5, type: 'formal', title: 'Refund Request',
    situation: 'You ordered a jacket from an online shop but received the wrong item. Write a formal complaint and refund request.',
    addressee: 'the customer service department of Modehaus Online',
    points: ['Give your order number and the date of purchase','Describe exactly what you received and what the problem is','Explain that you have already tried to resolve this (e.g. called the hotline)','Request a refund or the correct item','Ask for a response within a reasonable time frame'],
  },
  {
    id: 6, type: 'formal', title: 'Heating Problem — Letter to Landlord',
    situation: 'The heating in your apartment has not been working for two weeks in winter. Write a formal letter to your landlord.',
    addressee: 'your landlord, Herr Maier',
    points: ['Describe the problem and how long it has existed','Explain how this is affecting your daily life','Mention that you have already reported it (e.g. by phone)','Request that the problem be fixed by a specific date','Ask for a written confirmation that the repair will be carried out'],
  },
  {
    id: 7, type: 'formal', title: 'Train Delay Complaint',
    situation: 'Your train was cancelled causing you to miss an important appointment. Write a complaint to the railway company.',
    addressee: 'Deutsche Bahn Kundenservice',
    points: ['State the date, train number and route affected','Describe what happened (cancellation / long delay)','Explain what consequences you suffered (missed appointment, extra costs)','Mention any assistance you did or did not receive from staff','Request compensation in line with EU passenger rights'],
  },
  {
    id: 8, type: 'formal', title: 'Health Insurance Query',
    situation: 'You received a bill for a doctor\'s visit that you believe should be covered by your insurance. Write to your health insurer.',
    addressee: 'your health insurance company (AOK)',
    points: ['Explain that you received an unexpected invoice','Provide the date and details of the medical treatment','State your insurance number and insured status','Argue why you believe the treatment should be covered','Request clarification and ask them to settle the invoice directly'],
  },
  {
    id: 9, type: 'formal', title: 'Apartment Rental Enquiry',
    situation: 'You saw an apartment advertised online and are interested. Write a formal enquiry to the landlord.',
    addressee: 'the landlord advertising the apartment',
    points: ['Introduce yourself briefly (profession, how many people will live there)','Ask about the exact size, floor and condition of the apartment','Ask about the total monthly costs including utilities (Nebenkosten)','Enquire whether pets are allowed','Request a viewing appointment and provide your contact details'],
  },
  {
    id: 10, type: 'formal', title: 'Parking Permit Application',
    situation: 'You recently moved to a new district and need a residential parking permit. Write to the local council.',
    addressee: 'the Straßenverkehrsamt (traffic authority)',
    points: ['State your name, new address and vehicle registration number','Explain when you moved to the area','Ask about the procedure and requirements for getting a permit','Ask how long the permit will be valid and what it costs','Ask how long the application process takes'],
  },

  // ── Semi-formal ────────────────────────────────────────────────────────────
  {
    id: 11, type: 'halbformal', title: 'Email to Teacher — Missed Exam',
    situation: 'You were ill and could not take your German exam last week. Write an email to your teacher.',
    addressee: 'your German teacher, Frau Schmidt',
    points: ['Apologise for missing the exam and explain you were ill','Mention that you have a medical certificate (Attest)','Ask whether you can take the exam at a later date','Enquire about what material you missed in class','Thank her for her understanding'],
  },
  {
    id: 12, type: 'halbformal', title: 'Doctor\'s Appointment Request',
    situation: 'You need to see a doctor for a check-up. Write an email to the practice to request an appointment.',
    addressee: 'the medical practice of Dr. Müller',
    points: ['State who you are and that you are a patient of the practice','Explain the reason for your visit (regular check-up, specific symptom)','Mention any days or times that you cannot make','Ask if there is an appointment available soon','Provide your phone number for confirmation'],
  },
  {
    id: 13, type: 'halbformal', title: 'Neighbour — Shared Garden',
    situation: 'You and your neighbour share a garden but there is a disagreement about its use. Write a polite email to resolve it.',
    addressee: 'your neighbour, Herr Fischer',
    points: ['Greet him and explain the purpose of your email','Describe the issue (e.g. noise, rubbish, use of space)','Acknowledge that there may be a misunderstanding','Suggest a fair solution or compromise','Propose a time to discuss the matter in person'],
  },
  {
    id: 14, type: 'halbformal', title: 'Joining a Sports Club',
    situation: 'You want to join a local football club. Write an email to the club secretary.',
    addressee: 'the secretary of FC Grüntal',
    points: ['Introduce yourself and explain that you would like to join','Describe your experience and current fitness level','Ask about training times and locations','Enquire about the membership fee and registration process','Ask whether there is a trial session (Schnuppertraining) available'],
  },
  {
    id: 15, type: 'halbformal', title: 'Library Membership',
    situation: 'You moved to a new city and want to join the local library. Write an enquiry email.',
    addressee: 'the city library (Stadtbibliothek Grünau)',
    points: ['Introduce yourself and state that you recently moved to the area','Ask what types of membership are available and the cost','Ask which services are available (e.g. e-books, study rooms)','Enquire whether you can also borrow items in other languages','Ask how to register and whether you need to come in person'],
  },
  {
    id: 16, type: 'halbformal', title: 'Request for Flexible Working Hours',
    situation: 'You need to change your working hours temporarily due to a family situation. Write to your employer.',
    addressee: 'your employer, Frau Hoffmann',
    points: ['Explain politely that you have a private/family situation to handle','State which hours or days you would need to change and for how long','Suggest how your tasks could still be completed on time','Offer alternatives (e.g. working from home, making up hours later)','Thank her for her understanding and offer to discuss it in person'],
  },
  {
    id: 17, type: 'halbformal', title: 'Volunteering at Community Centre',
    situation: 'You would like to volunteer at the local Bürgerhaus. Write an email expressing your interest.',
    addressee: 'the coordinator of Bürgerhaus Westend',
    points: ['Introduce yourself and explain your interest in volunteering','Describe any relevant skills or experience you have','Ask what types of volunteer work are currently available','Enquire about the time commitment expected','Ask about the next steps to get involved'],
  },
  {
    id: 18, type: 'halbformal', title: 'Landlord — Repair Request',
    situation: 'The washing machine in your rented apartment is broken. Write a polite email to your landlord.',
    addressee: 'your landlord, Frau Becker',
    points: ['Describe what the problem is and when it started','Explain how it is affecting your daily life','Mention whether you have tried anything to fix it','Request that a repair technician be sent as soon as possible','Ask her to confirm when this can happen'],
  },
  {
    id: 19, type: 'halbformal', title: 'Schedule Change at Language School',
    situation: 'Your language course schedule has changed and it conflicts with your work. Write to the course coordinator.',
    addressee: 'the course coordinator at your language school',
    points: ['Explain that the new schedule is a problem for you','Describe the conflict (e.g. work, childcare)','Ask whether you can switch to a different group or time slot','Ask what will happen to the lessons you will miss','Ask for a quick response so you can plan ahead'],
  },
  {
    id: 20, type: 'halbformal', title: 'Child\'s Absence from School',
    situation: 'Your child was ill and missed three days of school. Write an email to the class teacher.',
    addressee: 'the class teacher, Herr Weber',
    points: ['Apologise for the absence and explain the reason','State the exact dates your child was absent','Mention that you are enclosing the medical certificate','Ask what work was missed and how your child can catch up','Thank the teacher for their support'],
  },

  // ── Informal ──────────────────────────────────────────────────────────────
  {
    id: 21, type: 'informal', title: 'New Apartment',
    situation: 'You recently moved into a new apartment. Write a letter to your friend Lena telling her about it.',
    addressee: 'your friend Lena',
    points: ['Describe the apartment (size, location, what you like about it)','Tell her about the moving process — was it difficult?','Mention something about your new neighbourhood','Invite her to visit and describe what you could do together','Ask how she is and what is new in her life'],
  },
  {
    id: 22, type: 'informal', title: 'Holiday Plans',
    situation: 'You are planning a holiday and want to invite your cousin Erik to join you.',
    addressee: 'your cousin Erik',
    points: ['Tell him where you are planning to go and when','Explain why you chose this destination','Describe what you would like to do there','Ask if he can come and when he needs to decide','Tell him the approximate cost and ask him to confirm soon'],
  },
  {
    id: 23, type: 'informal', title: 'Birthday Party Invitation',
    situation: 'You are organising a birthday party and want to invite your friend Mia.',
    addressee: 'your friend Mia',
    points: ['Tell her about the party (date, time, location)','Explain the type of celebration (e.g. dinner, outdoor BBQ)','Say who else will be coming','Tell her if she should bring anything (food, a gift, etc.)','Ask her to confirm whether she can come and by when'],
  },
  {
    id: 24, type: 'informal', title: 'Starting a New Job',
    situation: 'You recently started a new job and want to tell your friend Max about it.',
    addressee: 'your friend Max',
    points: ['Describe your new workplace and what you do','Tell him what you like most about the new job','Mention one challenge or difficulty you have encountered','Say how the new job compares to your previous one','Ask Max about his own work situation and how he is doing'],
  },
  {
    id: 25, type: 'informal', title: 'Learning German',
    situation: 'You have been learning German for several months. Write to your friend Sofia about your progress.',
    addressee: 'your friend Sofia',
    points: ['Explain why you started learning German','Describe how you study (courses, apps, reading, etc.)','Tell her what you find most difficult','Share a funny or embarrassing language mistake you made','Ask whether she would also like to learn a foreign language and which one'],
  },
  {
    id: 26, type: 'informal', title: 'Recommending a City',
    situation: 'You visited Leipzig last month and loved it. Write to your friend Ben recommending it.',
    addressee: 'your friend Ben',
    points: ['Explain when and why you went there','Describe what you liked most about the city','Recommend at least two specific things to do or see','Give practical tips (accommodation, transport, best time to go)','Suggest that you both visit together some time'],
  },
  {
    id: 27, type: 'informal', title: 'Flatmate Problem',
    situation: 'You are having a problem with your flatmate and want advice from your friend Anna.',
    addressee: 'your friend Anna',
    points: ['Describe the living situation briefly (flat-share, how long you have lived together)','Explain what the problem is','Say how this is affecting your daily life','Describe what you have already tried to solve it','Ask for her advice and opinion'],
  },
  {
    id: 28, type: 'informal', title: 'Weekend Plans',
    situation: 'You are planning an exciting weekend and want to invite your friend Jonas.',
    addressee: 'your friend Jonas',
    points: ['Explain what you are planning for the weekend','Say why you chose these activities','Ask if Jonas would like to join you','Give him the practical details (when, where to meet, what to bring)','Ask if he has any suggestions or preferences'],
  },
  {
    id: 29, type: 'informal', title: 'New Hobby',
    situation: 'You recently started a new hobby and are really enthusiastic about it. Write to your friend Clara.',
    addressee: 'your friend Clara',
    points: ['Introduce the hobby and explain how you discovered it','Describe what you enjoy most about it','Say how much time you spend on it and whether it is expensive','Mention whether you have met new people through this hobby','Ask Clara if she has any hobbies she is passionate about'],
  },
  {
    id: 30, type: 'informal', title: 'Daily Life in Germany',
    situation: 'Your pen pal Ana from Spain asked about your daily life in Germany. Write back to her.',
    addressee: 'your pen pal Ana',
    points: ['Describe your typical weekday (work/study, routine)','Tell her about something specific to life in Germany that surprised you','Describe your neighbourhood and what it is like to live there','Mention what you miss about your home country (or what you love about Germany)','Ask Ana questions about her daily life to keep the conversation going'],
  },
]

// ─── Gemini evaluation ────────────────────────────────────────────────────────

async function evaluateWithGemini(prompt, userText) {
  if (!GEMINI_URL) throw new Error('no_api_key')

  const systemPrompt = `You are an official TELC B1 German exam examiner. Evaluate the student's letter strictly using the TELC B1 Schreiben Teil 1 marking scheme (45 points total).

WRITING TASK:
Type: ${prompt.type} (${prompt.type === 'formal' ? 'Formell' : prompt.type === 'informal' ? 'Informell' : 'Halbformell'})
Situation: ${prompt.situation}
Addressee: ${prompt.addressee}

Required content points (student must address all 5):
${prompt.points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

STUDENT'S RESPONSE:
${userText}

SCORING GUIDE:
1. INHALT (Content) — 15 points: Score each of the 5 content points 0–3 (3=fully addressed, 2=partially, 1=barely, 0=missing).
2. KOMMUNIKATIVE GESTALTUNG (Communication) — 15 points: Rate salutation (0–3), structure (0–3), register consistency (0–3), connectors (0–3), clarity (0–3).
3. FORMALE RICHTIGKEIT (Accuracy) — 15 points: Rate grammar (0–5), vocabulary (0–5), spelling/punctuation (0–5).

Return ONLY valid JSON exactly like this (no markdown, no extra text):
{
  "inhalt": {
    "score": <0-15>,
    "points": [
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence>"},
      {"point": "<exact bullet text>", "score": <0-3>, "comment": "<one sentence>"}
    ]
  },
  "kommunikation": {
    "score": <0-15>,
    "salutation": <0-3>,
    "structure": <0-3>,
    "register": <0-3>,
    "connectors": <0-3>,
    "clarity": <0-3>,
    "feedback": "<2-3 sentences>"
  },
  "genauigkeit": {
    "score": <0-15>,
    "grammar": <0-5>,
    "vocabulary": <0-5>,
    "spelling": <0-5>,
    "errors": ["<correction or tip>"],
    "feedback": "<2-3 sentences>"
  },
  "total": <0-45>,
  "level": "<A2|B1-|B1|B1+|B2>",
  "summary": "<2-3 encouraging sentences in English>"
}`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1800 },
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function Writing() {
  const { user } = useAuth()
  const [tab, setTab] = useState('practice')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)
  const [loadingPrev, setLoadingPrev] = useState(true)

  const todayKey = getTodayKey()
  const todayPrompt = PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length]
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  // Load any existing submission for today
  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid, 'writing', todayKey))
      .then(snap => {
        if (snap.exists()) {
          const d = snap.data()
          setText(d.text || '')
          setFeedback(d.result || null)
        }
      })
      .finally(() => setLoadingPrev(false))
  }, [user, todayKey])

  const handleSubmit = async () => {
    if (!text.trim() || wordCount < 30) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await evaluateWithGemini(todayPrompt, text)
      setFeedback(result)
      await setDoc(doc(db, 'users', user.uid, 'writing', todayKey), {
        promptId: todayPrompt.id,
        promptTitle: todayPrompt.title,
        text,
        result,
        submittedAt: new Date().toISOString(),
      })
    } catch (e) {
      if (e.message === 'no_api_key') {
        setError('api_key')
      } else {
        setError(e.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingPrev) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Schreiben</h1>
      <p className="text-base text-gray-400 mb-8">TELC B1 Writing Practice</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
        {[['practice', 'Daily Practice'], ['tips', 'Writing Tips']].map(([key, label]) => (
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

      {tab === 'practice' ? (
        <PracticeTab
          prompt={todayPrompt}
          text={text}
          setText={setText}
          wordCount={wordCount}
          submitting={submitting}
          feedback={feedback}
          error={error}
          onSubmit={handleSubmit}
          onReset={() => { setFeedback(null); setText('') }}
        />
      ) : (
        <TipsTab />
      )}
    </div>
  )
}

// ─── Practice tab ─────────────────────────────────────────────────────────────

function PracticeTab({ prompt, text, setText, wordCount, submitting, feedback, error, onSubmit, onReset }) {
  const TYPE_META = {
    formal:     { label: 'Formell',      color: 'bg-indigo-100 text-indigo-700' },
    halbformal: { label: 'Halbformell',  color: 'bg-amber-100  text-amber-700'  },
    informal:   { label: 'Informell',    color: 'bg-green-100  text-green-700'  },
  }
  const meta = TYPE_META[prompt.type]
  const wordOk = wordCount >= 80 && wordCount <= 150
  const wordLow = wordCount > 0 && wordCount < 80

  return (
    <div className="space-y-5">
      {/* Prompt card */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-sm font-semibold text-gray-700">{prompt.title}</span>
        </div>
        <p className="text-base text-gray-700 mb-5 leading-relaxed">{prompt.situation}</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">You must address all 5 points:</p>
        <ol className="space-y-2">
          {prompt.points.map((p, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">{p}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Text area or feedback */}
      {!feedback ? (
        <>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your Letter</span>
              <span className={`text-xs font-semibold tabular-nums ${
                wordOk ? 'text-green-600' : wordLow ? 'text-amber-500' : wordCount > 150 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {wordCount} words {wordOk ? '✓' : '(aim for 80–150)'}
              </span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Begin your ${prompt.type === 'formal' ? 'formal' : prompt.type === 'informal' ? 'informal' : 'semi-formal'} letter here…\n\nRemember to use an appropriate greeting and closing.`}
              className="w-full px-5 py-4 text-base text-gray-900 leading-relaxed resize-none focus:outline-none min-h-[280px]"
            />
          </div>

          {error === 'api_key' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
              <strong>API key missing.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file and rebuild.
            </div>
          )}
          {error && error !== 'api_key' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
              Gemini error: {error}. Please try again.
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={wordCount < 30 || submitting || !GEMINI_API_KEY}
            className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gemini is evaluating…
              </>
            ) : 'Submit for AI Feedback'}
          </button>
        </>
      ) : (
        <FeedbackPanel feedback={feedback} onReset={onReset} text={text} prompt={prompt} />
      )}
    </div>
  )
}

// ─── Feedback panel ───────────────────────────────────────────────────────────

function FeedbackPanel({ feedback, onReset, text, prompt }) {
  const { inhalt, kommunikation, genauigkeit, total, level, summary } = feedback
  const pct = Math.round((total / 45) * 100)
  const grade = total >= 36 ? 'Bestanden ✓' : total >= 27 ? 'Knapp' : 'Nicht bestanden'
  const gradeColor = total >= 36 ? 'text-green-600' : total >= 27 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="space-y-5">
      {/* Score hero */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">Total Score</p>
            <p className="text-5xl font-bold">{total}<span className="text-2xl text-indigo-300 font-normal"> / 45</span></p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${total >= 36 ? 'text-green-300' : total >= 27 ? 'text-amber-300' : 'text-red-300'}`}>{grade}</p>
            <p className="text-indigo-200 text-sm mt-1">Level: {level}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="bg-indigo-500 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-indigo-200 text-xs mt-2">{pct}% — Pass mark is 80% (36/45)</p>
      </div>

      {/* Three score cards */}
      <div className="grid grid-cols-3 gap-3">
        <ScorePillar label="Inhalt" score={inhalt.score} max={15} color="indigo" />
        <ScorePillar label="Kommunikation" score={kommunikation.score} max={15} color="amber" />
        <ScorePillar label="Genauigkeit" score={genauigkeit.score} max={15} color="green" />
      </div>

      {/* Inhalt breakdown */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Inhalt — Content Points</h3>
        <div className="space-y-3">
          {inhalt.points.map((p, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
                p.score === 3 ? 'bg-green-100 text-green-700' :
                p.score === 2 ? 'bg-amber-100 text-amber-700' :
                p.score === 1 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'
              }`}>{p.score}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">{p.point}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kommunikation */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Kommunikative Gestaltung</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {[
            ['Greeting', kommunikation.salutation, 3],
            ['Structure', kommunikation.structure, 3],
            ['Register', kommunikation.register, 3],
            ['Connectors', kommunikation.connectors, 3],
            ['Clarity', kommunikation.clarity, 3],
          ].map(([label, score, max]) => (
            <div key={label} className="text-center bg-slate-50 rounded-2xl py-3 px-2">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-900">{score}<span className="text-xs text-gray-400">/{max}</span></p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{kommunikation.feedback}</p>
      </div>

      {/* Genauigkeit */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Formale Richtigkeit — Accuracy</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            ['Grammar', genauigkeit.grammar, 5],
            ['Vocabulary', genauigkeit.vocabulary, 5],
            ['Spelling', genauigkeit.spelling, 5],
          ].map(([label, score, max]) => (
            <div key={label} className="text-center bg-slate-50 rounded-2xl py-3">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-900">{score}<span className="text-xs text-gray-400">/{max}</span></p>
            </div>
          ))}
        </div>
        {genauigkeit.errors?.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {genauigkeit.errors.map((e, i) => (
              <li key={i} className="flex gap-2 items-start text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                {e}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-gray-700 leading-relaxed">{genauigkeit.feedback}</p>
      </div>

      {/* Summary */}
      <div className="bg-green-50 rounded-3xl p-5">
        <p className="text-sm font-bold text-green-700 mb-1">Overall Feedback</p>
        <p className="text-sm text-green-800 leading-relaxed">{summary}</p>
      </div>

      {/* Your text + try again */}
      <details className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-gray-500 hover:bg-slate-50 list-none flex items-center justify-between">
          <span>Your submitted letter</span>
          <span className="text-gray-400 text-xs">▼</span>
        </summary>
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-4">{text}</p>
        </div>
      </details>

      <button
        onClick={onReset}
        className="w-full py-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:border-indigo-300 hover:text-indigo-600 active:scale-[0.98] transition-all text-base"
      >
        Try again with a new letter
      </button>
    </div>
  )
}

function ScorePillar({ label, score, max, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    amber:  'bg-amber-50  text-amber-700',
    green:  'bg-green-50  text-green-700',
  }
  return (
    <div className={`${colors[color]} rounded-2xl p-4 text-center`}>
      <p className="text-xs font-semibold opacity-70 mb-1 leading-tight">{label}</p>
      <p className="text-3xl font-bold">{score}</p>
      <p className="text-xs opacity-60">/ {max}</p>
    </div>
  )
}

// ─── Tips tab ─────────────────────────────────────────────────────────────────

function TipsTab() {
  return (
    <div className="space-y-5">

      {/* Scoring overview */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">TELC B1 Schreiben — Scoring (45 pts)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Inhalt', pts: '15', desc: '5 content points × 3 pts each. Address every bullet point clearly.' },
            { label: 'Kommunikation', pts: '15', desc: 'Greeting, structure, register, connectors, clarity — 3 pts each.' },
            { label: 'Genauigkeit', pts: '15', desc: 'Grammar 5 pts, Vocabulary 5 pts, Spelling & Punctuation 5 pts.' },
          ].map(c => (
            <div key={c.label} className="bg-slate-50 rounded-2xl p-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-bold text-gray-900">{c.label}</span>
                <span className="text-indigo-600 font-bold text-lg">{c.pts}</span>
                <span className="text-gray-400 text-xs">pts</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Pass mark: <strong className="text-gray-600">36 / 45 (80%)</strong>. Writing time: ~30 minutes. Aim for 80–150 words.</p>
      </div>

      {/* Letter types */}
      {[
        {
          type: 'Formell', badge: 'bg-indigo-100 text-indigo-700',
          when: 'Authorities (Ämter), companies, hotels, unknown persons, job applications.',
          salutation: ['Sehr geehrte Damen und Herren,', 'Sehr geehrter Herr [Name],', 'Sehr geehrte Frau [Name],'],
          closing: ['Mit freundlichen Grüßen,', 'Mit freundlichem Gruß,'],
          pronoun: 'Sie (always formal you)',
          phrases: [
            'Ich schreibe Ihnen bezüglich …',
            'Hiermit möchte ich mich für … bewerben.',
            'Könnten Sie mir bitte … mitteilen?',
            'Ich würde gern wissen, ob …',
            'Ich erlaufe mir, Sie darauf hinzuweisen, dass …',
            'Vielen Dank für Ihre Mühe.',
          ],
          avoid: 'Contractions, casual language, du-form, exclamation marks for requests.',
        },
        {
          type: 'Halbformell', badge: 'bg-amber-100 text-amber-700',
          when: 'Teachers, doctors, neighbours, employers you know, club coordinators.',
          salutation: ['Guten Tag, Frau [Name],', 'Liebe Frau [Name],', 'Lieber Herr [Name],'],
          closing: ['Herzliche Grüße,', 'Viele Grüße,', 'Mit freundlichen Grüßen,'],
          pronoun: 'Sie (still formal — only switch to du if invited)',
          phrases: [
            'Ich hoffe, es geht Ihnen gut.',
            'Ich wollte Sie kurz fragen, ob …',
            'Ich wäre Ihnen sehr dankbar, wenn …',
            'Könnten Sie mir bitte … schicken?',
            'Ich freue mich auf Ihre Antwort.',
            'Danke im Voraus für Ihre Hilfe.',
          ],
          avoid: 'Overly stiff opening phrases; overly casual slang.',
        },
        {
          type: 'Informell', badge: 'bg-green-100 text-green-700',
          when: 'Friends, family, pen pals, flatmates.',
          salutation: ['Liebe/Lieber [Name],', 'Hallo [Name],', 'Hey [Name],'],
          closing: ['Liebe Grüße,', 'Viele Grüße,', 'Bis bald,', 'Tschüss,'],
          pronoun: 'du / ihr',
          phrases: [
            'Wie geht es dir?',
            'Stell dir vor, …! (Imagine, …!)',
            'Ich wollte dir schnell schreiben, weil …',
            'Was hältst du davon?',
            'Es wäre super, wenn du …',
            'Ich freue mich schon riesig darauf!',
          ],
          avoid: 'Overly formal phrases; Sie-form with friends.',
        },
      ].map(lt => (
        <div key={lt.type} className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lt.badge}`}>{lt.type}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4"><strong>When:</strong> {lt.when}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Salutation</p>
              {lt.salutation.map(s => <p key={s} className="text-sm text-gray-700 font-medium italic mb-0.5">{s}</p>)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Closing</p>
              {lt.closing.map(s => <p key={s} className="text-sm text-gray-700 font-medium italic mb-0.5">{s}</p>)}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3"><strong>Pronoun:</strong> {lt.pronoun}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Key Phrases</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {lt.phrases.map(p => (
              <span key={p} className="text-xs bg-slate-100 text-gray-700 px-3 py-1.5 rounded-xl font-medium">{p}</span>
            ))}
          </div>
          <p className="text-xs text-red-500"><strong>Avoid:</strong> {lt.avoid}</p>
        </div>
      ))}

      {/* Connectors */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Useful Connectors (Konnektoren)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Adding information', words: ['außerdem', 'zusätzlich', 'zudem', 'darüber hinaus', 'auch'] },
            { label: 'Contrast / Concession', words: ['jedoch', 'allerdings', 'trotzdem', 'obwohl', 'zwar … aber'] },
            { label: 'Cause / Reason', words: ['deshalb', 'deswegen', 'daher', 'darum', 'wegen + Genitiv'] },
            { label: 'Purpose / Goal', words: ['damit', 'um … zu', 'für', 'zum Zweck'] },
            { label: 'Time sequence', words: ['zunächst', 'dann', 'danach', 'schließlich', 'zuerst'] },
            { label: 'Listing / Emphasis', words: ['erstens', 'zweitens', 'außerdem', 'vor allem', 'besonders'] },
          ].map(g => (
            <div key={g.label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.words.map(w => (
                  <span key={w} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Common Mistakes to Avoid</h2>
        <ul className="space-y-3">
          {[
            ['Missing bullet points', 'Read all 5 points before you start. Tick each off as you write. Even a brief mention scores 1 point.'],
            ['Wrong register', 'Formal letter = Sie + Sehr geehrte. Informal = du + Liebe/Lieber. Mixing them costs Kommunikation points.'],
            ['No greeting / closing', 'Always include a proper salutation and closing. These alone are worth up to 6 points in Kommunikation.'],
            ['Too short or too long', 'Aim for 80–150 words. Too short = missing content. Too long = more errors. Quality over quantity.'],
            ['Forgetting connectors', 'Use at least 3 connectors (deshalb, außerdem, jedoch, etc.) to score well in structure and coherence.'],
            ['Capital nouns', 'Every German noun is capitalised. Der Tisch, die Prüfung, das Leben — always!'],
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
