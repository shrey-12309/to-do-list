import mongoose from 'mongoose'

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Provide a Password'],
      minlength: 8,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
      enum: ['user', 'admin'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const user = mongoose.model('User', userModel)
export default user
