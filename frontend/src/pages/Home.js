import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { WorkoutFormContextProvider } from "../context/WorkoutFormContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutList from "../components/WorkoutList"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
    const { user } = useAuthContext()
    const { dispatch:dispatchAuth } = useAuthContext()
    const navigate = useNavigate()

    if (!user) {
        // navigate('/login')
    }

    useEffect(()=>{
        const getAccessCode = async () => {
            console.log("getting access code...");
            const encodedUrl = encodeURIComponent(window.location.href);
            try {
            //of user exists then login if not then signup automaticaly
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/google-auth/login?redirected_url=${encodedUrl}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                })
                const json = await response.json()
                if (!response.ok) {
                    console.log("!response.ok", json);
                }
                if (response.ok) {
                    console.log("response.ok", json);
                    localStorage.setItem('user', JSON.stringify(json))
                    dispatchAuth({ type: 'LOGIN', payload: json })
                    navigate('/')
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        const loginByQR = async ()=>{
            const urlParams = new URLSearchParams(window.location.search)
            const email = urlParams.get('qremail')
            const token = urlParams.get('qrtoken')
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/QRlogin`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify( {email,token})
                })
                const json = await response.json()
                if (!response.ok) {
                console.log(json.error);
                }
                if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatchAuth({ type: 'LOGIN', payload: json })
                navigate('/')
                }
                
            } catch (error) {
            }
        }

        if ( window.location.search) {
            console.log("query string: ",window.location.search);
            console.log('decoded query String: ',decodeURIComponent(window.location.search));
            if (decodeURIComponent(window.location.search).includes('https://www.googleapis.com/auth/userinfo.email')) {
                getAccessCode()
                
            } else if(window.location.href.split('?')[1].includes('qremail')) {
                loginByQR()
            }
        }

    },[])


    return (
        <div className="home">
        <WorkoutList/>
        <WorkoutFormContextProvider>
            <WorkoutForm />
        </WorkoutFormContextProvider>
        </div>
    )
}

export default Home