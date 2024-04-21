import { createContext, useReducer } from "react";

export const WorkoutFormContext = createContext()

export const workoutFormReducer = (state, action)=>{
    switch (action.type) {
        case 'CLEAR_FORM':
            return{ 
                formData: {"title": "", "load": "", "reps": ""}
            }
        case 'SET_FORM':
            return{ 
                formData: action.payload
            }
            
        default:
            return state
    }
}

export const WorkoutFormContextProvider = ({children})=>{

    const [state, dispatch] = useReducer(workoutFormReducer, {formData: null})
    
    return(
        <WorkoutFormContext.Provider value={{...state, dispatch}}>
            {children}
        </WorkoutFormContext.Provider>
    )
}