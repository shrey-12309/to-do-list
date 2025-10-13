import { Router } from 'express'
import AuthenticationController from '../controllers/userController.js'
import { sendOTP } from '../controllers/otpController.js'

const authRouter = Router()

const authentication = new AuthenticationController()

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

authRouter.post('/sign-up', authentication.registerUser)
authRouter.post('/login', authentication.loginUser)
authRouter.post('/logout', authentication.logoutUser)
// authRouter.post('/auth/otp', sendOTP)

export default authRouter
