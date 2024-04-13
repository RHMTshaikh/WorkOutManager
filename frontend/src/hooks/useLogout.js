import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: workoutDispatch } = useWorkoutsContext()

    const logout = () => {
        //remove storage from storage
        localStorage.removeItem('user')

        //dispatch logout  action
        dispatch({ type: 'LOGOUT' })
        workoutDispatch({type: 'SET-WORKOUt', payload: null})
    }
    return { logout}
}