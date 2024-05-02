import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    let type = 'self'
    await signup(email, password, type)
  }

  const googleAuthentication = (e)=>{
    e.preventDefault()
    const auth_uri = process.env.REACT_APP_AUTH_URL
    const redirect_uri = process.env.REACT_APP_REDIRECT_URL_SIGNUP
    const client_id = process.env.REACT_APP_CLIENT_ID
    const access_type = 'offline'
    const response_type = 'code'
    const promt = 'consent'
    const scope = 'email'
    const googleAuthURI = `${auth_uri}?redirect_uri=${redirect_uri}&client_id=${client_id}&access_type=${access_type}&promt=${promt}&scope=${scope}&response_type=${response_type}`
    window.location.href = googleAuthURI
  }

  return (
    <form className="signup" >
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />
      <button disabled={isLoading} onClick={handleSubmit}>Sign up</button>

      <button className="google-Oauth-btn" onClick={googleAuthentication}>
        <div className="logo"><i className="fab fa-google"></i></div>
        <div className="text">Sign Up with Google</div>
      </button>

      {error && <div className="error">{error}</div>}

    </form>
  )
}

export default Signup
