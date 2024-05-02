import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

export const useSignup = () => {
    const [ error, setError] = useState(null)
    const [ isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const signup = async (email, password, type) =>{
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password, type })
        })
        const json = await response.json() //{email,token}
        console.log(json);
        setIsLoading(false)

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
            navigate('/')
        }
    }
    return { signup, isLoading, error }
}