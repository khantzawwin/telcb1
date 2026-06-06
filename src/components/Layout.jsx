import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/vocabulary', label: 'Vocabulary', icon: '📖' },
  { to: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { to: '/grammar', label: 'Grammar', icon: '✏️' },
]

export default function Layout({ children }) {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    await logOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">B1</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">TELC B1</p>
              <p className="text-xs text-gray-500">Trainer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=e0e7ff&color=4338ca`}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.displayName}</p>
            </div>
          </div>
          <button
            onClick={handleLogOut}
            className="w-full text-xs text-gray-500 hover:text-gray-700 text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
