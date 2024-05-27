import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(email, password)
    }
    console.log("redirect URL: ",process.env.REACT_APP_REDIRECT_URL_LOGIN);
    const googleAuthentication = (e)=>{
        e.preventDefault()
        const auth_uri = process.env.REACT_APP_AUTH_URL
        const redirect_uri = process.env.REACT_APP_REDIRECT_URL_LOGIN
        const client_id = process.env.REACT_APP_CLIENT_ID
        const access_type = 'offline'
        const response_type = 'code'
        const promt = 'consent'
        const scope = 'email'

        const googleAuthURI = `${auth_uri}?redirect_uri=${redirect_uri}&client_id=${client_id}&access_type=${access_type}&promt=${promt}&scope=${scope}&response_type=${response_type}`
        window.location.href = googleAuthURI
    }

    return (
        <form className="login" >
        <h3>Log In</h3>
        
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
        <button disabled={isLoading} onClick={handleSubmit}>Log In</button>

        <button className="google-Oauth-btn" onClick={googleAuthentication}>
            <div className="logo"><i className="fab fa-google"></i></div>
            <div className="text">Log In with Google</div>
        </button>

        {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Login