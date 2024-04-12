require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts.js')


const app = express()


//middleware
app.use(express.json())

app.use((req,res,next)=>{
    next()
})

app.use('/api/workouts', workoutRoutes)

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
