require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts.js')
const userRoutes = require('./routes/user.js')
const cors = require('cors')
const analyzeTranscript = require('./controller/transcriptController.js')

const app = express()


app.use(cors())

//middleware
app.use(express.json()) // When a request comes in with a Content-Type header of application/json, Express will parse the request body and make it available as req.body.

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.post('/api/workouts/analyze',analyzeTranscript)
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        // i dont know why we are puuting this after establishing conection
        app.listen(process.env.PORT,()=>{
            console.log('listing on port',process.env.PORT)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
