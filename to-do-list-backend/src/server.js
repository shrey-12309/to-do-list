import express from 'express'
import cors from 'cors'
import { PORT, DOMAIN, URI } from '../constants.js'
import taskRouter from './routes/taskRoute.js'
import userRouter from './routes/userRoute.js'
import { connectToMongoDB } from '../DB/connect.js'
import loggerMiddleware from './middlewares/logger.js'
import { otpRouter } from './routes/otpRoute.js'
import verifyToken from './middlewares/tokenVerification.js'

const app = express()
const port = PORT
const domain = DOMAIN
const uri = URI

connectToMongoDB(uri)

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(loggerMiddleware)

app.use('/user', userRouter)
app.use('/otp', otpRouter)
app.use('/', verifyToken, taskRouter)

app.use((err, req, res, next) => {
  try {
    console.log('global middleware called')

    console.log(err.message)

    if (res.statusCode === 200) res.statusCode = 500
    const status = res.statusCode || 500

    res.status(status).json({
      error: err.message || 'Server Error',
    })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server Running At ${domain}:${port}`)
})
