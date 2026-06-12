import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotesProvider } from './contexts/NotesContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vocabulary from './pages/Vocabulary'
import Flashcards from './pages/Flashcards'
import Grammar from './pages/Grammar'
import Writing from './pages/Writing'
import Sprechen from './pages/Sprechen'
import Verben from './pages/Verben'
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
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/grammar" element={<Grammar />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/sprechen" element={<Sprechen />} />
                <Route path="/verben" element={<Verben />} />
                <Route path="/connectors" element={<Connectors />} />
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
          <AppRoutes />
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
