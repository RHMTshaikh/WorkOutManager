import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

export const useLogin = () => {
    const [ error, setError] = useState(null)
    const [ isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const login = async (email, password) =>{
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            })
            
            const json = await response.json()
    
            if (!response.ok) {
                setIsLoading(false)
                setError(json.error)
            }
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatch({ type: 'LOGIN', payload: json })
                navigate('/')
    
                setIsLoading(false)
            }
            
        } catch (error) {
            console.log("error from server: " ,error)
        }

    }
    return { login, isLoading, error }
}