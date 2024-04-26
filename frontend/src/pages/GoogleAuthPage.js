import { useAuthContext } from "../hooks/useAuthContext"
import {  useEffect, useState } from "react";

const GoogleAuthPage = ({SignupOrLoginProp}) =>{
  const { dispatch } = useAuthContext()
  const [authType, setAuthtype] = useState(null)
  const [error, setError] = useState(null)


    useEffect(()=>{
        const getAccessCode = async () => {
            const encodedUrl = encodeURIComponent(window.location.href);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/google-auth/${SignupOrLoginProp.type}?redirected_url=${encodedUrl}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                })
                    
                const json = await response.json()
                if (!response.ok) {
                    console.log('error: ',json)
                    setAuthtype(json.type)
                    setError(json.error)
                    console.log(authType);
                }
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(json))

                    dispatch({ type: 'LOGIN', payload: json })
                    window.location.href = 'http://localhost:3000'
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        getAccessCode()
    },[])

    let componenet
    if (SignupOrLoginProp.type === 'login') {
        componenet = (
            <div className="">
                <h3>You are not registered</h3>
                <a href="/signup">
                    <h5>Please try Signing Up</h5>
                </a>
            </div>
        )

    } else{
        componenet = (
            <div className="">
            <h3>you alredy SignedUp using Google</h3>
            <a href="/login">
                <h5>please Try Login using Google</h5>
            </a>
        </div>
        )
    }

    return(
        <div>
            <h1>GOOGLE {`${SignupOrLoginProp.type.toUpperCase()}`} </h1>
            {componenet}
        </div>
    )
}
export default GoogleAuthPage