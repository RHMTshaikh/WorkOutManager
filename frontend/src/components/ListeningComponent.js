import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useState} from "react";
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsFormContext } from '../hooks/useWorkoutFormContext';

const ListeningComponent = () => {
    const [isListening, setIsListening] = useState(false);
    const {user} = useAuthContext()
    const {dispatch} = useWorkoutsFormContext()
    
    const startListening = (e) => {
        e.preventDefault()
        setIsListening(true)
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        setTimeout(()=>stopListening(e), 10000)
    }
    const stopListening = (e) => {
        e.preventDefault();
        setIsListening(false)
        SpeechRecognition.stopListening()
    }
    const sendTranscript = async(e)=>{
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/workouts/analyze`, {
                method: 'POST',
                body: JSON.stringify({prompt: transcript }),
                headers:{
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (response.ok) {
                const json = await response.json()
                console.log({"transcript":transcript,"json":json})
                dispatch({type:'SET_FORM', payload:json})
                // setTimeout(()=>{console.log("formData",formData)},1000) // formDAta will not get updated here
                
            }
        } catch (error) {
            console.log("error in caught in listeningComponent:-" ,error)
        }
    }

    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    return (
        <div className="container">
            <div className="btn-style">

                <button onClick={isListening? stopListening : startListening}>{isListening ? 'Stop Listening' : 'Start Listening'}</button>

            </div>
            <div className="main-content" >

                {transcript}
                { transcript&&!isListening ? <button onClick={sendTranscript}>Analyze</button>:null}

            </div>
        </div>
    );
};

export default ListeningComponent;