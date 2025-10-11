import express from 'express'
import cors from 'cors'
import { PORT, DOMAIN, URI } from '../constants.js'
import todoRouter from './routes/route.js'
import { connectToMongoDB } from '../DB/connect.js'
import userRouter from './routes/userRoute.js'
import loggerMiddleware from './middleware/loggerMiddleware.js'
import bodyParser from 'body-parser'
// import { connect } from './db.js'
import authRoutes from './routes/auth.js'

const app = express()
const port = PORT
const domain = DOMAIN
const uri = URI

connectToMongoDB(uri)
console.log('this is connect to mongo db function')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/', todoRouter)
app.use('/user', userRouter)

app.use((err, req, res) => {
  res.status(500).send({
    message: err.message,
    success: false,
  })
})

app.listen(port, () => {
  console.log(`Server Running At ${domain}:${port}`)
})

// Middleware
app.use(bodyParser.json())

// Routes
app.use('/auth', authRoutes)

// Connect to the database before starting the server
// connect()
//   .then(() => {
//     // Start server
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`)
//     })
//   })
//   .catch((error) => {
//     console.error('Error connecting to database:', error)
//   })
