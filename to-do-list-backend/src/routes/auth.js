import express from 'express'
const router = express.Router()
import User from '../models/user.js'
import { sendOTP } from '../utils/otp'
const { randomInt } = require('crypto')

router.post('/sendotp', async (req, res) => {
  const { phone } = req.body

  // Generate a 6-digit OTP
  //const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = randomInt(100000, 999999)

  try {
    // Save OTP and its expiration time in the database
    const user = await User.findOneAndUpdate(
      { phone },
      { otp, otpExpiration: Date.now() + 600000 }, // OTP expires in 10 minutes
      { upsert: true, new: true }
    )

    // Send OTP via SMS
    await sendOTP(phone, otp)

    res.status(200).json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Error sending OTP:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
})

router.post('/verifyotp', async (req, res) => {
  const { phone, otp } = req.body

  try {
    // Find user by phone number and OTP
    const user = await User.findOne({ phone, otp })

    if (!user || user.otpExpiration < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    // Clear OTP and expiration time after successful verification
    user.otp = undefined
    user.otpExpiration = undefined
    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'OTP verified successfully' })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ success: false, message: 'Failed to verify OTP' })
  }
})

export default router
