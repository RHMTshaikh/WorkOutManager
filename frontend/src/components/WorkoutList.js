import { useEffect } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import WorkoutDetails from "../components/WorkoutDetails"

const WorkoutList = () => {
  const { workouts, dispatch: dispatchWorkout } = useWorkoutsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/workouts`,{
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok) {
        dispatchWorkout({type: 'SET_WORKOUTS', payload: json})
      }
    }
    if (user) {
      fetchWorkouts()
    }
  },[dispatchWorkout, user])

  return (
    <>
    {user && <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails key={workout._id} workout={workout}  />
        ))}
    </div>}
    </>
  )
}

export default WorkoutList