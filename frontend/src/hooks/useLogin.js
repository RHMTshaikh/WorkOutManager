import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

import SERVER_URL from "../config/config"

export const useLogin = () => {
    const [ error, setError] = useState(null)
    const [ isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) =>{
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${SERVER_URL}/api/user/login`, {
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
                // save the user to ocal storage 
                localStorage.setItem('user', JSON.stringify(json))
    
                //update the Auth context
                dispatch({ type: 'LOGIN', payload: json })
    
                setIsLoading(false)
            }
            
        } catch (error) {
            console.log("error from server: " ,error)
        }

    }
    return { login, isLoading, error }
}