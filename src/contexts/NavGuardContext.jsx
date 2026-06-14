import { createContext, useContext, useCallback, useState } from 'react'

const NavGuardContext = createContext(null)

// Lets a page mark itself as having unsaved, in-progress work (e.g. an active
// exercise session). The nav links in Layout call confirmNav() before leaving;
// if it returns false, navigation is cancelled.
export function NavGuardProvider({ children }) {
  const [message, setMessage] = useState(null)

  // A page calls this to set/clear its "leaving will lose progress" warning.
  const setGuard = useCallback((msg) => setMessage(msg || null), [])

  // Returns true if it's safe to navigate, false if the user cancelled.
  const confirmNav = useCallback(() => {
    if (!message) return true
    return window.confirm(message)
  }, [message])

  return (
    <NavGuardContext.Provider value={{ setGuard, confirmNav }}>
      {children}
    </NavGuardContext.Provider>
  )
}

export function useNavGuard() {
  return useContext(NavGuardContext)
}
