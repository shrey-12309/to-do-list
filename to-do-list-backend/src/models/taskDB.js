import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      unique: true,
      required: true,
    },
    preference: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const taskDB = mongoose.model('Task', todoSchema)
export default taskDB
