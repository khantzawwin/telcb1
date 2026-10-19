import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavGuard } from '../contexts/NavGuardContext'
import { useLevel } from '../contexts/LevelContext'

// Desktop sidebar + mobile bottom-nav. Vocab and Grammar stay active on their sub-pages.
// Writing and Speaking are B1 exam practice, so they only show in B1.
const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/vocabulary', label: 'Vocab', icon: BookIcon },
  { to: '/grammar', label: 'Grammar', icon: PencilIcon },
  { to: '/writing', label: 'Writing', icon: WriteIcon, b1Only: true },
  { to: '/sprechen', label: 'Speaking', icon: ChatIcon, b1Only: true },
]

export default function Layout({ children }) {
  const { user, logOut } = useAuth()
  const { confirmNav } = useNavGuard()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { level, setLevel } = useLevel()
  const navItems = NAV_ITEMS.filter(i => level === 'B1' || !i.b1Only)

  // Switching level keeps you in the same section (Vocab → Vocab), but on
  // that level's main page, since sub-pages belong to one level.
  const switchLevel = next => {
    if (next === level || !confirmNav()) return
    setLevel(next)
    const section = NAV_ITEMS.find(i => !i.end && pathname.startsWith(i.to))
    navigate(section && (next === 'B1' || !section.b1Only) ? section.to : '/')
  }

  // Block in-app navigation when a page has unsaved work (e.g. active exercise).
  const handleNavClick = (e) => { if (!confirmNav()) e.preventDefault() }
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogOut = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="px-5 py-5 border-b border-gray-100 space-y-4">
          <AppLogo level={level} />
          <LevelSwitch level={level} onChange={switchLevel} />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e0e7ff&color=4338ca&size=64`}
              alt="avatar"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <p className="text-sm font-medium text-gray-800 truncate">{user?.displayName}</p>
          </div>
          <button onClick={handleLogOut} className="text-sm text-gray-500 hover:text-gray-600">
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────── */}
      <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center justify-between gap-3 px-4 py-3 safe-top">
        <AppLogo level={level} compact />
        <LevelSwitch level={level} onChange={switchLevel} className="ml-auto" />
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Menu"
        >
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=e0e7ff&color=4338ca&size=64`}
            alt="avatar"
            className="w-7 h-7 rounded-full"
          />
        </button>

        {menuOpen && (
          <div className="absolute top-full right-4 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogOut}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* ── Main content ─────────────────────────── */}
      <main
        className="md:ml-64 min-h-screen pb-20 md:pb-0"
        onClick={() => setMenuOpen(false)}
      >
        {children}
      </main>

      {/* ── Mobile bottom nav ─────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20">
        {/* Bar */}
        <div className="bg-white border-t border-gray-200 safe-bottom">
          <div className="flex">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

function AppLogo({ level, compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">{level}</span>
      </div>
      <div className={compact ? 'hidden min-[380px]:block' : ''}>
        <p className="text-base font-semibold text-gray-900 leading-tight">Deutsch Drill</p>
        <p className="text-sm text-gray-500 leading-tight">telc {level}</p>
      </div>
    </div>
  )
}

// B2 | B1 segmented control. Each level has its own words, grammar and plan.
function LevelSwitch({ level, onChange, className = '' }) {
  return (
    <div role="group" aria-label="Exam level" className={`flex p-1 bg-gray-100 rounded-xl ${className}`}>
      {['B2', 'B1'].map(l => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={level === l}
          className={`flex-1 min-w-[3.25rem] min-h-[40px] px-3 rounded-lg text-sm font-bold transition-colors ${
            level === l ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}

function WriteIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

