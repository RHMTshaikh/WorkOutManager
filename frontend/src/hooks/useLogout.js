import { useNavigate } from "react-router-dom"
import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: workoutDispatch } = useWorkoutsContext()
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
        workoutDispatch({type: 'SET-WORKOUt', payload: null})
        navigate('/login')
    }
    return { logout}
}