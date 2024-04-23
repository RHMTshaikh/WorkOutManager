import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {useState} from "react";
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsFormContext } from '../hooks/useWorkoutFormContext';

const ListeningComponent = ({setError, removeErrorCLass}) => {
    const [isListening, setIsListening] = useState(false)
    const [isAnalyzing, setAnalyzing] = useState(false)
    const {user} = useAuthContext()
    const {dispatch} = useWorkoutsFormContext()
    
    const startListening = (e) => {
        e.preventDefault()
        SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
        setIsListening(true)
        setTimeout(()=>stopListening(e), 15000)
        resetTranscript()
        stopFetching(e)
        setError(null)
        removeErrorCLass()
    }
    const stopListening = (e) => {
        e.preventDefault();
        SpeechRecognition.stopListening()
        setIsListening(false)
    }
    const controller = new AbortController()
    const signal = controller.signal

    const sendTranscript = async (e)=>{
        e.preventDefault()
        setAnalyzing(true)
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/workouts/analyze`, 
                {
                    method: 'POST',
                    body: JSON.stringify({prompt: transcript }),
                    headers:{
                        'Content-Type' : 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                }, {signal}
            )
            if (response.ok) {
                resetTranscript()
                const json = await response.json()
                console.log({"transcript":transcript,"json":json})
                dispatch({type:'SET_FORM', payload:json})
                // setTimeout(()=>{console.log("formData",formData)},1000) // formDAta will not get updated here
                setAnalyzing(false)
                
            }
        } catch (error) {
            console.log("error in caught in listeningComponent:-" ,error)
        }
    }
    const stopFetching = (e)=>{
        e.preventDefault()
        controller.abort()
        setAnalyzing(false)
    }

    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    return (
        <div className="transcript-component">
            <button onClick = { isListening? stopListening : startListening} > {isListening ? 'Stop Listening' : 'Start Listening' } </button>

            {transcript &&
                <div className="transcript-text" >
                    {transcript}
                    <i onClick={resetTranscript} className="material-symbols-outlined">close</i>

                </div>
            }
            { transcript && !isListening &&
                <button onClick={ isAnalyzing ? stopFetching : sendTranscript  } > {isAnalyzing ? 'Stop Analyzing...' : 'Analyze'} </button>
            }
        </div>
    );
};

export default ListeningComponent;