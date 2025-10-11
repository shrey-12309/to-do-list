import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  phone: String,
  otp: String,
  otpExpiration: Date,
})

const User = mongoose.model('user', userSchema)
export default User
