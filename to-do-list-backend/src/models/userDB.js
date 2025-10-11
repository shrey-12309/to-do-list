import mongoose from 'mongoose'

const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
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
      required: true,
      enum: ['user', 'admin'],
    },
  },
  {
    timestamps: true,
  }
)

const user = mongoose.model('User', userModel)
export default user
