import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PORT, DOMAIN, URI } from '../constants.js'
import { connectToMongoDB } from '../DB/connect.js'
import todoRouter from './routes/taskRoute.js'
import loggerMiddleware from './middlewares/loggerMiddleware.js'
import authRouter from './routes/authRoutes.js'
import protectedRoute from './routes/authProtectedRoute.js'
import otpRoutes from './routes/authRoutes.js'

const app = express()
const port = PORT
const domain = DOMAIN
const uri = URI

connectToMongoDB(uri)
console.log('this is connect to mongo db function')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use((err, req, res, next) => {
  try {
    const status = err.status || 500

    res.status(status).json({
      error: err.message || 'Server Error',
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.use(loggerMiddleware)
app.use('/auth', authRouter)
app.use('/protected', protectedRoute)
app.use('/', todoRouter)
// app.use('/api/otp', otpRoutes)

app.listen(port, () => {
  console.log(`Server Running At ${domain}:${port}`)
})
