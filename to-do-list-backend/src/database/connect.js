import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const URI = process.env.URI

async function connectToMongoDB(uri) {
  try {
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (e) {
    console.log(e)
  }
}

export { connectToMongoDB }
