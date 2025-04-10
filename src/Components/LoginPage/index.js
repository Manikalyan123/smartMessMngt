// import  from 'react'
import {useNavigate} from 'react-router-dom'

const LoginPage = ({setIsAuthenticated}) => {
  console.log('Rendering App, Authenticated:')
  const navigate = useNavigate()

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}

export default LoginPage
