const qs = require('qs')
const axios = require('axios')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const Multer = require('multer')
const { Storage } = require("@google-cloud/storage")


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

//login user
const loginUser = async (req,res) =>{
    const { email, password } = req.body // object destructuring names should be same
    try {
        const user = await User.login(email, password, type= 'self') 
        
        const token = createToken(user._id)
        
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req,res) =>{
    const { email, password } = req.body

    try {
        const user = await User.signup(email, password, type='self')

        const token = createToken(user._id )

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const loginUserGoogle = async (req, res)=>{
    console.log('loging google user...');
    const redirectedURL = req.query.redirected_url// Extract URL from query parameters
    const parsedURL = qs.parse(redirectedURL.split('?'))

    let redirectURL = parsedURL[0]
    if (redirectURL[redirectURL.length -1] == '/') {
        redirectURL = parsedURL[0].slice(0, -1)
    }
    const authorizationCode = qs.parse(parsedURL[1]).code
    const clientID = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_SECRET
    const tokenUrl = process.env.GOOGLE_TOKEN_URL
    
    const requestBody = {
        code: authorizationCode,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURL,
        grant_type: 'authorization_code',
    }
    try {
        const response = await axios.post(tokenUrl,qs.stringify(requestBody),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        console.log('got the access token fron token url');
        const access_token = response.data.access_token //did not used access token yet need to learn what it is
        const id_token  = response.data.id_token
        
        const googleUser = jwt.decode(id_token)
        const userEmail = googleUser.email
        const userSUB = googleUser.sub // using sub as a password but not sure about this
        
        console.log('saving to database...');
        const user = await User.login(userEmail, userSUB, type='Google')
        if (user.error) { // for self only
            console.log('error from mongo: ', user.error);
            return res.status(400).json(user) //{error: "email not found"}
        }
        const token = createToken(user._id )
        
        res.status(200).json({email: userEmail, token})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const loginUserByQR = async (req, res)=>{
    try {
        const {_id} = jwt.verify(req.body.token, process.env.SECRET) //{ _id: '64276877ia9472dod68445mc', iat: 1714801933, exp: 1714888333 }
        const userMongo = await User.findById(_id)

        if (req.body.email != userMongo.email) { //!= will perform type correction if necessary
            return res.status(400).json({error:'email did not match'})
        }
        return res.status(200).json(req.body)
    } catch (error) { 
        console.error(error)
    }
}

let projectId = process.env.PROJECT_ID
let keyFilename = '../backend/mykey.json'
const storage = new Storage({
    projectId,
    keyFilename,
})
const bucket = storage.bucket('profile-pic-workoutbuddy')

const saveProfilePic = async (req, res) => {
    console.log(req.body.email)
    try {
        console.log('File found, trying to upload')
        const fileObj = bucket.file(req.file.originalname)
        console.log(req.file.originalname)
        console.log('Blob created:', fileObj.name)
        
        const blobStream = fileObj.createWriteStream()
        
        blobStream.on('error', (err) => {
            console.log('Error in blobStream:', err)
            res.status(500).send({ error: err.message })
        })
        blobStream.on('finish', async () => {
            // Generate a temporary signed URL for download (optional expiration time)
            // const expires = Date.now() + 1000 * 60 * 60 // Expires in 1 hour
            // const url = await fileObj.getSignedUrl({
            //     action: 'read',
            //     expires,
            // })
            await User.saveprofilePicName(req.body.email)
            res.status(200).end()
        })
        blobStream.end(req.file.buffer) // This line is actually uploading the file
    } catch (error) {
        console.log('Catch block error:', error)
        res.status(500).send({ error: error.message })
    }
}
const deleteProfilePic = async (req, res) => {
    try {
        const fileName = await User.deleteprofilePicName(req.user.id)
        if (fileName) {
            const file = bucket.file(fileName)
            
            file.delete()
            .then( () => {
                res.status(200).end()    
            })
            .catch((err) => {
                console.error('Error deleting file:', err)
                res.status(500).send({ error: err.message })
            })
        }
        res.status(200).end()
    } catch (error) {
        console.log('Catch block error:', error)
        res.status(500).send({ error: error.message })
    }
}
const getProfilePic = async (req, res) => {
    console.log(" get")
    console.log(req.query.email)
    console.log(req.user.id)
    
    try {
        const fileName = await User.getProfilePicName(req.user.id)
        if (fileName) {
            const File = bucket.file(fileName)
            const readStream = File.createReadStream()
    
            readStream.on('error', (err) => {
                console.error('Error reading file from bucket:', err)
                res.status(500).send({ error: err.message })
            })
            readStream.on('response', (response) => {
                res.setHeader('Content-Type', 'image/jpeg')
            })
            readStream.pipe(res) // Pipe the read stream to the response

        } else{
            res.status(200).end()
        }
    } catch (error) {
        console.log('Catch block error:', error)
        res.status(500).send({ error: error.message })
    }
}
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
})

module.exports = { signupUser, loginUser, loginUserGoogle, loginUserByQR, saveProfilePic, deleteProfilePic, getProfilePic, multer }