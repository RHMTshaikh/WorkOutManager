require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts.js')
const userRoutes = require('./routes/user.js')
const cors = require('cors')
const analyzeTranscript = require('./controller/transcriptController.js')

const app = express()

// Enable CORS for all routes
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use(cors())

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/workouts/analyze',analyzeTranscript)
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
