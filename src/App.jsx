import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotesProvider } from './contexts/NotesContext'
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/vocabulary/review" element={<Flashcards />} />
                <Route path="/grammar" element={<Grammar />} />
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
        <NotesProvider>
          <NavGuardProvider>
            <AppRoutes />
          </NavGuardProvider>
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
