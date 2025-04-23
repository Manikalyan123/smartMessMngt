import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const LoginPage = ({setIsAuthenticated}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = e => {
    e.preventDefault()

    // Dummy credentials (Replace with backend API call)
    const validEmail = 'k@123'
    const validPassword = '123'

    if (email === validEmail && password === validPassword) {
      localStorage.setItem('isAuthenticated', 'true')
      setIsAuthenticated(true)
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
