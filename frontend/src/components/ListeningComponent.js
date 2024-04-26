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
        setError(null)
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
            setAnalyzing(false)
            const json = await response.json()

            if (!response.ok) {
                setError(json.error)
            }
            if (response.ok) {
                resetTranscript()
                dispatch({type:'SET_FORM', payload:json})
                // console.log({"transcript":transcript,"json":json})
                // setTimeout(()=>{console.log("formData",formData)},1000) // formDAta will not get updated here
                
            }
        } catch (error) {
            console.log("error in caught in listeningComponent:-" ,error)
            setAnalyzing(false)
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
            { transcript && !isListening &&
                <button className='analyze-btn' onClick={ isAnalyzing ? stopFetching : sendTranscript  } > {isAnalyzing ? 'Stop Analyzing' : 'Analyze'} </button>
            }

            {transcript &&
                <div className="transcript-text" >
                    {transcript}
                    <i onClick={()=>{resetTranscript(); setError(null)} } className="material-symbols-outlined">close</i>

                </div>
            }
        </div>
    );
};

export default ListeningComponent;