import { mongoose } from 'mongoose'

const otpModel = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: [String],
    required: true,
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
  },
})

export default mongoose.model('Otp', otpModel)
