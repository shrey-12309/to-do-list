import express from 'express'
import {
  resetPassword,
  sendOTP,
  verifyOTP,
} from '../controllers/otpController.js'

const router = express.Router()

router.post('/send', sendOTP)
router.post('/verify', verifyOTP)
router.post('/reset', resetPassword)
export default router
