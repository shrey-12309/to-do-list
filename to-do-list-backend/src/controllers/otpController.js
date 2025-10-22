import { userModel } from '../models/userDB.js'
import { otpModel } from '../models/otpDB.js'
import otpGenerator from 'otp-generator'
import { mailSender } from '../utils/mailSender.js'

export default class OtpController {
  sendOTP = async (req, res, next) => {
    try {
      const { email } = req.body

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })

      let otpDoc = await otpModel.findOne({ email })

      if (!otpDoc) {
        otpDoc = new otpModel({ email, otp: [] })
      }

      otpDoc.otp.push(otp)
      await otpDoc.save()

      await mailSender(
        email,
        'Please confirm your OTP',
        `<p>Your OTP is: <strong>${otp}</strong></p>`
      )

      res.status(200).json({ success: true, message: 'OTP sent successfully' })
    } catch (e) {
      next(e)
    }
  }

  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body

      if (!email || !otp) {
        res.status(400)
        return next(new Error(`OTP is required`))
      }

      const otpDoc = await otpModel.findOne({ email })

      if (!otpDoc || otpDoc.otp.length === 0) {
        res.status(400)
        return next(new Error(`OTP not found! Please resend OTP`))
      }

      const latestOTP = otpDoc.otp[otpDoc.otp.length - 1]

      const now = Date.now()
      const otpCreated = new Date(otpDoc.updatedAt).getTime()
      const diff = (now - otpCreated) / 1000

      if (diff > 300) {
        res.status(403)
        return next(new Error(`OTP expired, please request a new one`))
      }

      if (latestOTP !== otp) {
        res.status(401)
        return next(new Error(`Invalid OTP`))
      }

      const user = await userModel.findOne({ email })

      if (user) {
        user.isVerified = true
        await user.save()
      }

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
      })
    } catch (e) {
      next(e)
    }
  }
}
