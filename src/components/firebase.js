// firebase.js
import {initializeApp} from 'firebase/app'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  createUserWithEmailAndPassword, // ENSURE THIS LINE IS PRESENT
  sendEmailVerification, // ENSURE THIS LINE IS PRESENT
} from 'firebase/auth'

// Your web app's Firebase configuration (ENSURE THIS IS YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: 'AIzaSyAdpKnKFq7D2Dau3cbDQF948UFXCTGRC3c', // <---------------------- REPLACE THIS!
  authDomain: 'smartmessmanagement.firebaseapp.com',
  projectId: 'smartmessmanagement',
  storageBucket: 'smartmessmanagement.firebasestorage.app',
  messagingSenderId: '915843530878',
  appId: '1:915843530878:web:f05af7434b08b27ec1582f',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Ensure auth is valid before exporting (optional check)
if (!auth) {
  console.error('Firebase Auth instance failed to initialize!')
} else {
  console.log('Firebase Auth initialized successfully.') // Log for confirmation
}

// Initialize reCAPTCHA - no longer needs phoneNumber argument
const initRecaptcha = () => {
  // Ensure the container exists before creating the verifier
  if (!document.getElementById('recaptcha-container')) {
    console.error(
      "reCAPTCHA container 'recaptcha-container' not found in the DOM.",
    )
    return null // Return null if container isn't ready
  }
  try {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: response => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // Usually, this callback is handled implicitly by signInWithPhoneNumber
        console.log('reCAPTCHA verified by callback')
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.warn('reCAPTCHA response expired.')
        // You might want to reset the OTP flow here or prompt the user
      },
    })
    console.log('RecaptchaVerifier instance created.')
    return verifier
  } catch (error) {
    console.error('Error creating RecaptchaVerifier:', error)
    return null // Return null on error
  }
}

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  initRecaptcha,
  signInWithCredential,
  createUserWithEmailAndPassword, // ENSURE THIS LINE IS PRESENT IN THE EXPORT
  sendEmailVerification, // ENSURE THIS LINE IS PRESENT IN THE EXPORT
}
