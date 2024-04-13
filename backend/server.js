require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts.js')
const userRoutes = require('./routes/user.js')

const app = express()

//middleware
app.use(express.json())

app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)
app.get('/api', (req, res) => {
    res.status(200).json({mssg:'hello here'})
})

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
