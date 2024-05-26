const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true // password for google user made from sub
  },
  authenticationType: {
    type: String,
    required: true
  },
  profilePicName: {
    type: String,
    default: null,
  }
})

// static signup method
userSchema.statics.signup = async function(email, password, type) {
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    switch (type) {
        case 'self':
            if(!email || !password){
                throw Error('All fields must be filled')
            }
            if(!validator.isEmail(email)){
                throw Error('Email is not valid')
            }
            if(!validator.isStrongPassword(password)){
                throw Error('weak passsword')
            }
            
            const selfUser = await this.findOne({ email })
            if(selfUser){
                console.log('email already exists');
                // throw Error('Email already in use')
                return {error: 'email already exists', type: selfUser.type}
            }
            return await this.create({ email, password: hashPassword, authenticationType: 'self' })//creating document at mongodb
            break
            
        case 'Google':
            const googleUser = await this.findOne({ email })

            if( googleUser){
                // throw Error('Email already in use')
                return {error: 'email already exists', type: googleUser.authenticationType}
            }
            return await this.create({ email, password: hashPassword,  authenticationType: 'Google' })//creating document at mongodb
            break
    }
}

userSchema.statics.login = async function(email, password, type) {
    
    switch (type) {
        case 'self':
            if(!email || !password){
                throw Error('All fields must be filled')
            }
            const selfUser = await this.findOne({ email })
            if(!selfUser){
                throw Error('Email not found!')
            }
            const match = await bcrypt.compare(password, selfUser.password)
            console.log('match');
            if(!match){
                throw Error('Incorrect Password')
            }
            return selfUser
        break;
            
        case 'Google':
            const googleUser = await this.findOne({ email })

            if( googleUser){
                return googleUser
            }
            if(!googleUser){
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                return await this.create({ email, password: hashPassword,  authenticationType: 'Google' })//creating document at mongodb
            }
        break;
    }
}

userSchema.statics.saveprofilePicName = async function (email) {
    console.log('model');
    const profilePicName = `${email}-profile-pic.jpeg`
    try {
        const updatedUser = await this.findOneAndUpdate(
            { email },
            { profilePicName },
        )
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
userSchema.statics.deleteprofilePicName = async function (_id) {
    console.log('model');
    const profilePicName = null
    try {
        const user = await this.findById(_id)
        const profilePicName = user.profilePicName;
        if (profilePicName) {
            user.profilePicName = null
            user.save()
            return profilePicName
        }
        return null
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
userSchema.statics.getProfilePicName = async function (_id) {
    console.log('model');
    try {
        const user = await this.findById(_id)
        return user.profilePicName;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema)