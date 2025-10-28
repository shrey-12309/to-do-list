import { mongoose } from 'mongoose'

const userSchema = new mongoose.Schema(
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
      enum: ['user', 'admin'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const userModel = mongoose.model('User', userSchema)
