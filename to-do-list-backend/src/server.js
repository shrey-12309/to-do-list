import express from 'express'
import cors from 'cors'
import errorHandler from '../src/middlewares/errorHandler.js'
import { PORT, DOMAIN, URI } from '../constants.js'
import taskRouter from './routes/taskRoute.js'
import userRouter from './routes/authRoute.js'
import { connectToMongoDB } from './database/connect.js'
import loggerMiddleware from './middlewares/logger.js'
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

app.use('/user/auth', userRouter)
app.use('/', verifyToken, taskRouter)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server Running At ${domain}:${port}`)
})
