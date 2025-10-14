import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otps: [
    {
      code: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
})

export default mongoose.model('OTP', otpSchema)
