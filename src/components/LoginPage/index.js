// LoginPage.js
import React, {useState, useEffect, useRef} from 'react' // Added useEffect, useRef
import {useNavigate} from 'react-router-dom'
import {
  auth, // Make sure auth is correctly imported and initialized first
  signInWithPhoneNumber,
  PhoneAuthProvider,
  initRecaptcha, // Import the updated initRecaptcha
} from '../firebase' // Adjust path if needed
import './index.css' // Assuming your CSS file exists

const LoginPage = ({setIsAuthenticated}) => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [error, setError] = useState('')
  const [otpSentMessage, setOtpSentMessage] = useState('') // For better feedback

  // Use useRef to hold the reCAPTCHA verifier instance
  const recaptchaVerifierRef = useRef(null)
  // Ref to ensure useEffect cleanup runs correctly on unmount
  const isMounted = useRef(true)

  // Initialize reCAPTCHA Verifier on component mount
  useEffect(() => {
    isMounted.current = true
    // Check if auth is available before initializing reCAPTCHA
    if (auth && !recaptchaVerifierRef.current) {
      console.log('Attempting to initialize reCAPTCHA...')
      // Ensure the container exists before calling initRecaptcha
      // Use setTimeout to allow DOM to render reliably, especially in StrictMode
      const timeoutId = setTimeout(() => {
        if (isMounted.current) {
          // Check if component is still mounted
          const verifier = initRecaptcha()
          if (verifier) {
            recaptchaVerifierRef.current = verifier
            console.log('reCAPTCHA Verifier Initialized and stored in ref.')
          } else {
            setError('Failed to initialize reCAPTCHA. Check console.')
          }
        }
      }, 100) // Small delay to ensure DOM element is ready

      return () => {
        clearTimeout(timeoutId)
      }
    }

    // Cleanup function on component unmount
    return () => {
      isMounted.current = false
      // You might optionally clear the verifier if needed,
      // but Firebase often manages its lifecycle.
      // if (recaptchaVerifierRef.current) {
      //   recaptchaVerifierRef.current.clear(); // Method might vary
      // }
      console.log('LoginPage unmounted.')
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  const handleSendOtp = async () => {
    setError('')
    setOtpSentMessage('') // Clear previous success message
    if (!phone.match(/^\+\d{10,15}$/)) {
      setError('Enter phone in E.164 format, e.g., +919876543210')
      return
    }

    // Check if reCAPTCHA verifier is ready
    if (!recaptchaVerifierRef.current) {
      setError('reCAPTCHA verifier not ready. Please wait or refresh.')
      console.error(
        'handleSendOtp called but recaptchaVerifierRef.current is null.',
      )
      // You could attempt to re-initialize here, but it suggests an earlier problem
      return
    }

    console.log('Using reCAPTCHA verifier:', recaptchaVerifierRef.current)
    console.log('Using auth instance:', auth)

    try {
      // Use the verifier instance stored in the ref
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifierRef.current,
      )
      console.log('Confirmation Result:', confirmationResult)
      setVerificationId(confirmationResult.verificationId)
      setOtpSentMessage('OTP sent successfully!') // Use state for feedback
      // alert('OTP sent!'); // Replaced alert
    } catch (err) {
      setError(`Error sending OTP: ${err.message}`)
      console.error('Error details during signInWithPhoneNumber:', err)
      // It might be necessary to render a new reCAPTCHA widget if it fails
      // For example, if the user closes the reCAPTCHA challenge
      // recaptchaVerifierRef.current.render().then(...) might be needed in some cases.
      // Resetting might involve re-running initRecaptcha or specific grecaptcha methods
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    if (!verificationId) {
      setError('Please request an OTP first.')
      return
    }
    if (!otp.match(/^\d{6}$/)) {
      // Basic OTP format validation
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    const credential = PhoneAuthProvider.credential(verificationId, otp)
    try {
      await auth.signInWithCredential(credential)
      console.log('User signed in successfully!')
      // localStorage.setItem('isAuthenticated', 'true'); // Consider if needed alongside Firebase persistence
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (err) {
      setError(`OTP verification failed: ${err.message}`)
      console.error('Error details during signInWithCredential:', err)
    }
  }

  return (
    <div className="login-container">
      <h2>Login with OTP</h2>

      {/* Display error messages */}
      {error && <p className="error-message">{error}</p>}

      {/* Display success messages */}
      {otpSentMessage && <p className="success-message">{otpSentMessage}</p>}

      <div className="field-group">
        <label htmlFor="phone">Phone (E.164):</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+919876543210"
          disabled={!!verificationId} // Optionally disable after OTP sent
        />
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={!!verificationId} // Disable button after sending OTP
        >
          {verificationId ? 'OTP Sent' : 'Generate OTP'}
        </button>
      </div>

      {/* Only show OTP input after verificationId is set */}
      {verificationId && (
        <div className="field-group">
          <label htmlFor="otp">Enter OTP:</label>
          <input
            id="otp"
            type="text" // Use "text" with pattern or "tel"
            inputMode="numeric" // Helps mobile keyboards
            pattern="\d{6}" // Basic pattern validation
            maxLength="6"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button type="button" onClick={handleVerifyOtp}>
            Verify OTP
          </button>
        </div>
      )}

      {/* IMPORTANT: This container MUST exist in the DOM for reCAPTCHA */}
      <div id="recaptcha-container" />
    </div>
  )
}

export default LoginPage
