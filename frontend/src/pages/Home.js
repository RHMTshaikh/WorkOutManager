import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { WorkoutFormContextProvider } from "../context/WorkoutFormContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutList from "../components/WorkoutList"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
  const { user } = useAuthContext()
  const [ setAuthtype] = useState(null)
  const { dispatch:dispatchAuth } = useAuthContext()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
  }

  useEffect(()=>{
    const getAccessCode = async () => {
        const encodedUrl = encodeURIComponent(window.location.href);
        console.log("encodedUrl",encodedUrl);
        try {
          //of user exists then login if not then signup automaticaly
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/google-auth/login?redirected_url=${encodedUrl}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
            const json = await response.json()
            console.log('here');
            if (!response.ok) {
                console.log('response: ',response)
                console.log('error: ',json)
                setAuthtype(json.type)
            }
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(json))
                dispatchAuth({ type: 'LOGIN', payload: json })
                console.log("here111");
                navigate('/')
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    if ( window.location.href.split('?')[1]) {
      getAccessCode()
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