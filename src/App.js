import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import GroceryEntryPage from './components/GroceryEntryPage'
import UsageUpdate from './components/UsageUpdate'
import Reports from './components/Reports'
import './App.css'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true',
  )

  return (
    <Routes>
      {/* Redirect to dashboard if logged in, otherwise show login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <LoginPage setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/grocery-entry"
        element={isAuthenticated ? <GroceryEntryPage /> : <Navigate to="/" />}
      />
      <Route
        path="/usage-update"
        element={isAuthenticated ? <UsageUpdate /> : <Navigate to="/" />}
      />
      <Route
        path="/reports"
        element={isAuthenticated ? <Reports /> : <Navigate to="/" />}
      />
    </Routes>
  )
}

export default App
