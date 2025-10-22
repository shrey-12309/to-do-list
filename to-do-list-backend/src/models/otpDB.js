import { mongoose } from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: [String],
      required: true,
    },
  },
  { timestamp: true }
)

const otpModel = mongoose.model('otp-db', otpSchema)

export { otpModel }
