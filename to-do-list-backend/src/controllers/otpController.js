import OTP from '../models/otp.js'
import otpGenerator from 'otp-generator'
import mailSender from '../utility/mailSender.js'

async function sendOTP(req, res, next) {
  try {
    const { email } = req.body

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    let existing = await OTP.findOne({ otp })
    while (existing) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      existing = await OTP.findOne({ otp })
    }

    await OTP.create({ email, otp })

    await mailSender(
      email,
      'Verification Email',
      `<h1>Email Verification</h1><p>Your OTP: <strong>${otp}</strong></p>`
    )

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (err) {
    next(err)
  }
}

async function verifyOTP(req, res, next) {
  try {
    const { email, otp } = req.body
    const existingOtp = await OTP.findOne({ email, otp })

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      })
    }

    res
      .status(200)
      .json({ success: true, message: 'OTP verified successfully' })
  } catch (err) {
    next(err)
  }
}

async function resendOTP(req, res, next) {
  try {
    req.body.email = req.body.email
    await sendOTP(req, res, next)
  } catch (err) {
    next(err)
  }
}

export { sendOTP, verifyOTP, resendOTP }
