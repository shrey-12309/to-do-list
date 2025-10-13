import mongoose from 'mongoose'

const otpModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Array(String),
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  {
    timestamps: true,
  }
)

const OTP = mongoose.model('OTP', otpModel)
export default OTP
