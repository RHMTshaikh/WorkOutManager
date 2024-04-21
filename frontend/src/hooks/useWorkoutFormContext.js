import { WorkoutFormContext } from "../context/WorkoutFormContext";
import { useContext } from "react";

export const useWorkoutsFormContext = ()=>{
    const context = useContext(WorkoutFormContext)
    if (!context) {
        throw Error("useWorkoutFormContext must be used in the WorkoutFormContextProvider")
    }
    return context
}