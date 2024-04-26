import {  useEffect, useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsFormContext } from "../hooks/useWorkoutFormContext"
import ListeningComponent from "./ListeningComponent"

const WorkoutForms = () => {
    const { dispatch } = useWorkoutsContext()
    const {user} = useAuthContext()
    const {formData} = useWorkoutsFormContext()

    const [ title, setTitle] = useState('')
    const [ load, setLoad] = useState('')
    const [ reps, setReps] = useState('')
    const [ error, setError] = useState(null)
    const [ emptyFields, setEmptyFields] = useState([''])

    useEffect(() => {
        if (formData) {
            setTitle(formData.title || "");
            setLoad(formData.load || "");
            setReps(formData.reps || "");
        }
    },[formData]);
    
    const handleSumbit = async (e) =>{
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }
        const workout = {title, load, reps}

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/workouts`, {
                method: 'POST',
                body: JSON.stringify(workout),
                headers:{
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            
            if (!response.ok) {
                //{error: 'Please fill compulsory fields: ',emptyFields }
                setError(json.error)
                if (json.emptyFields) {
                    setEmptyFields(json.emptyFields)
                }
            }
            if (response.ok) {
                dispatch({type: 'CREATE_WORKOUT', payload: json})
                setEmptyFields([''])
                setError(null)
                setTitle('')
                setLoad('')
                setReps('')
            }
    }
    const removeErrorCLass = ()=>{
        const inputs = document.querySelectorAll('.error')
        inputs.forEach(input => {input.classList.remove('error')});
        setEmptyFields([''])
    }

    return (
        <form className="create">
            <h3>Add a New Workout</h3>

            <label>Exercise Title:</label>
                <input 
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={ emptyFields.includes('title') ? 'error' : '' }
                />
            <label>Load in(kg):</label>
                <input 
                    type="number"
                    onChange={(e) => setLoad(e.target.value)}
                    value={load}
                    className={ emptyFields.includes('load') ? 'error' : '' }
                />
            <label>Reps:</label>
                <input 
                    type="number"
                    onChange={(e) => setReps(e.target.value)}
                    value={reps}
                    className={ emptyFields.includes('reps') ? 'error' : '' }
                />
            <button onClick={handleSumbit} >Add Workout</button>
            <div>
                <ListeningComponent setError={setError} removeErrorCLass={removeErrorCLass} />
            </div>
            {error && 
                <div className="error" >
                    {error + emptyFields}
                    <i onClick={()=>{setError(null); removeErrorCLass()}} className="material-symbols-outlined error">close</i>
                </div> 
            }
        </form>
    )
}

export default WorkoutForms