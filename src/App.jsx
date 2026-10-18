import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotesProvider } from './contexts/NotesContext'
import { LevelProvider, useLevel } from './contexts/LevelContext'
import { NavGuardProvider } from './contexts/NavGuardContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vocabulary from './pages/Vocabulary'
import Flashcards from './pages/Flashcards'
import Grammar from './pages/Grammar'
import GrammarTopic from './pages/GrammarTopic'
import Writing from './pages/Writing'
import Sprechen from './pages/Sprechen'
import Verben from './pages/Verben'
import Werden from './pages/Werden'
import Vergangenheit from './pages/Vergangenheit'
import KonjunktivII from './pages/KonjunktivII'
import Connectors from './pages/Connectors'
import B2Grammar from './pages/b2/B2Grammar'
import B2Vergangenheit from './pages/b2/B2Vergangenheit'
import B2Konjunktiv from './pages/b2/B2Konjunktiv'
import B2UmZu from './pages/b2/B2UmZu'
import B2Adjektive from './pages/b2/B2Adjektive'
import B2Verben from './pages/b2/B2Verben'

// /grammar shows the current level's grammar
function GrammarHome() {
  const { level } = useLevel()
  return level === 'B2' ? <B2Grammar /> : <Grammar />
}

// B2 grammar pages switch the app to B2 when opened from a link
function B2Page({ children }) {
  const { level, setLevel } = useLevel()
  useEffect(() => { if (level !== 'B2') setLevel('B2') }, [level, setLevel])
  return level === 'B2' ? children : null
}

function AppRoutes() {
  const { level } = useLevel()
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              {/* key: pages restart cleanly when the level changes */}
              <Routes key={level}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/vocabulary/review" element={<Flashcards />} />
                <Route path="/grammar" element={<GrammarHome />} />
                <Route path="/grammar/b2/vergangenheit" element={<B2Page><B2Vergangenheit /></B2Page>} />
                <Route path="/grammar/b2/konjunktiv" element={<B2Page><B2Konjunktiv /></B2Page>} />
                <Route path="/grammar/b2/umzu" element={<B2Page><B2UmZu /></B2Page>} />
                <Route path="/grammar/b2/adjektive" element={<B2Page><B2Adjektive /></B2Page>} />
                <Route path="/grammar/b2/verben" element={<B2Page><B2Verben /></B2Page>} />
                <Route path="/grammar/b2/*" element={<Navigate to="/grammar" replace />} />
                <Route path="/grammar/topic/:topicId" element={<GrammarTopic />} />
                <Route path="/grammar/:themeId" element={<Grammar />} />
                <Route path="/grammar/konnektoren/practice" element={<Connectors />} />
                <Route path="/grammar/verben/practice" element={<Verben />} />
                <Route path="/grammar/werden/practice" element={<Werden />} />
                <Route path="/grammar/vergangenheit/practice" element={<Vergangenheit />} />
                <Route path="/grammar/konjunktiv/practice" element={<KonjunktivII />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/sprechen" element={<Sprechen />} />

                {/* Old URLs (bookmarks, installed PWA) */}
                <Route path="/flashcards" element={<Navigate to="/vocabulary/review" replace />} />
                <Route path="/verben" element={<Navigate to="/grammar/verben/practice" replace />} />
                <Route path="/connectors" element={<Navigate to="/grammar/konnektoren/practice" replace />} />
                <Route path="/grammar/connectors" element={<Navigate to="/grammar/konnektoren/practice" replace />} />
                <Route path="/werden" element={<Navigate to="/grammar/werden/practice" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LevelProvider>
          <NotesProvider>
            <NavGuardProvider>
              <AppRoutes />
            </NavGuardProvider>
          </NotesProvider>
        </LevelProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
