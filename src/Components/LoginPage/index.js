import React from 'react'
import {useNavigate} from 'react-router-dom'

const LoginPage = ({setIsAuthenticated}) => {
  const navigate = useNavigate()

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginPage