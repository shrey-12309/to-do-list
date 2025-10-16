import OTP from '../models/otp.js'
import otpGenerator from 'otp-generator'
import mailSender from '../utility/mailSender.js'
import userModel from '../models/userDB.js'

export async function signupOTP(email) {
  try {
    if (!email) {
      throw new Error('Email is required')
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    while (await OTP.findOne({ 'otps.code': otp })) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false })
    }

    let otpDoc = await OTP.findOne({ email })

    if (!otpDoc) {
      otpDoc = new OTP({ email, otps: [] })
    } else if (!Array.isArray(otpDoc.otps)) {
      otpDoc.otps = []
    }

    otpDoc.otps.push({ code: otp })
    await otpDoc.save()

    await mailSender(
      email,
      'Verification Email',
      `<h1>Please confirm your OTP</h1>
       <p>Your new OTP code is: <b>${otp}</b></p>
       <p>It will expire in 5 minutes.</p>`
    )

    console.log(`OTP sent to ${email}: ${otp}`)

    return otp
  } catch (err) {
    console.error('Error sending OTP:', err)
    throw err
  }
}

export async function sendOTP(req, res) {
  try {
    const { email } = req.body
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' })
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    while (await OTP.findOne({ 'otps.code': otp })) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false })
    }

    let otpDoc = await OTP.findOne({ email })

    if (!otpDoc) {
      otpDoc = new OTP({ email, otps: [] })
    } else if (!Array.isArray(otpDoc.otps)) {
      otpDoc.otps = []
    }

    otpDoc.otps.push({ code: otp })
    await otpDoc.save()

    await mailSender(
      email,
      'Verification Email',
      `<h1>Please confirm your OTP</h1>
       <p>Your new OTP code is: <b>${otp}</b></p>
       <p>It will expire in 5 minutes.</p>`
    )

    console.log(`OTP sent to ${email}: ${otp}`)

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (err) {
    console.error('Error sending OTP:', err)
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    })
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and OTP are required' })
    }

    const otpDoc = await OTP.findOne({ email })
    if (!otpDoc || otpDoc.otps.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No OTPs found for this email' })
    }

    const latestOTP = otpDoc.otps[otpDoc.otps.length - 1]

    const now = Date.now()
    const diff = (now - latestOTP.createdAt.getTime()) / 1000
    if (diff > 300) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired, please request a new one',
      })
    }

    if (latestOTP.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }
    const user = await userModel.findOne({ email })

    user.isVerified = true
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
    })
  }
}

export async function resetPassword(req, res) {
  const { email, currentPassword, newPassword } = req.body

  try {
    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: 'Email not verified' })
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect current password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (err) {
    console.error('Reset password error:', err.message)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
}
