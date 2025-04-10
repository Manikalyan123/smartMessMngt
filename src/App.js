import {useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import LoginPage from './Components/LoginPage'
import Dashboard from './Components/Dashboard'
import GroceryEntryPage from './Components/GroceryEntryPage'
import UpdateUsagePage from './Components/UsageUpdate'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true',
  )

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/grocery-entry"
        element={
          isAuthenticated ? <GroceryEntryPage /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/usage-update"
        element={
          isAuthenticated ? <UpdateUsagePage /> : <Navigate to="/" replace />
        }
      />
    </Routes>
  )
}

export default App
