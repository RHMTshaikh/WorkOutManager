const qs = require('qs')
const axios = require('axios')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

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
    const redirectedURL = req.query.redirected_url;// Extract URL from query parameters
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
        const access_token = response.data.access_token //did not used access token yet need to learn what it is
        const id_token  = response.data.id_token
        
        const googleUser = jwt.decode(id_token)
        const userEmail = googleUser.email
        const userSUB = googleUser.sub // using sub as a password but not sure about this
        
        const user = await User.login(userEmail, userSUB, type='Google')
        if (user.error) {
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
        console.error(error);
    }
}

module.exports = { signupUser, loginUser, loginUserGoogle, loginUserByQR }