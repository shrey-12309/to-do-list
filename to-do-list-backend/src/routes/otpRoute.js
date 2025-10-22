// routes/otpRoutes.js
import express from 'express'
import OtpController from '../controllers/OtpController.js'

const otpInstance = new OtpController()

const otpRouter = express.Router()

otpRouter.post('/sendOTP', otpInstance.sendOTP)
otpRouter.post('/verifyOtp', otpInstance.verifyOtp)

export { otpRouter }
