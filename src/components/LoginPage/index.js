import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '../firebase' // Import necessary functions
import './index.css'

const LoginPage = ({setIsAuthenticated}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('') // For success messages

  const handleSignUp = async () => {
    setError('')
    setMessage('')
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User signed up:', user)

      // Send email verification
      await sendEmailVerification(user)
      setMessage(
        'Verification email sent! Please check your inbox to verify your email.',
      )
      // Optionally, you can redirect the user to a page informing them to verify their email
      // navigate('/verify-email');
    } catch (err) {
      setError(`Sign up failed: ${err.message}`)
      console.error('Error during sign up:', err)
    }
  }

  const handleSignIn = async () => {
    setError('')
    setMessage('')
    try {
      // Explicitly import signInWithEmailAndPassword directly
      const {signInWithEmailAndPassword: directSignIn} = await import(
        'firebase/auth'
      )
      console.log('Directly imported signInWithEmailAndPassword:', directSignIn)
      console.log('Current auth object:', auth) // Log the top-level auth object again

      const {user} = await directSignIn(auth, email, password) // Use the directly imported function
      console.log('User signed in:', user)

      if (user.emailVerified) {
        setIsAuthenticated(true)
        navigate('/dashboard')
      } else {
        setMessage('Please verify your email address before logging in.')
        // Optionally, provide a button to resend the verification email
      }
    } catch (err) {
      setError(`Login failed: ${err.message}`)
      console.error('Error during login:', err)
    }
  }

  const handleResendVerificationEmail = async () => {
    setError('')
    setMessage('')
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
        setMessage('Verification email resent! Please check your inbox.')
      } else {
        setError('No user signed in to resend verification email.')
      }
    } catch (err) {
      setError(`Failed to resend verification email: ${err.message}`)
      console.error('Error resending verification email:', err)
    }
  }

  return (
    <div className="login-container">
      <h2>Sign Up or Login with Email</h2>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="field-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <div className="field-group">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Your Password"
        />
      </div>

      <div className="button-group">
        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
        <button type="button" onClick={handleSignIn}>
          Login
        </button>
      </div>

      {/* Option to resend verification email, shown after signup but before login */}
      {message.includes('verify your email') && (
        <button type="button" onClick={handleResendVerificationEmail}>
          Resend Verification Email
        </button>
      )}
    </div>
  )
}

export default LoginPage
