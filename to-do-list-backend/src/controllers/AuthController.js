import { userModel } from '../models/UserDb.js'
import bcrypt from 'bcrypt'
import {
  getAccessToken,
  getRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtUtils.js'
import { otpModel } from '../models/OtpDb.js'
import otpGenerator from 'otp-generator'
import { mailSender } from '../utils/mailSender.js'

export default class UserController {
  registerUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await userModel.findOne({ email })

      if (user) {
        res.status(400)
        return next(new Error(`User already exists! Please login to continue.`))
      }

      const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      })

      if (!newUser) {
        res.status = 400
        return next(new Error(`Unable to register user! Please try again.`))
      }

      res
        .status(201)
        .json({ success: true, message: 'User generated successfully' })
    } catch (err) {
      next(err)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await userModel.findOne({ email })

      if (!user) {
        res.status(401)
        return next(new Error(`User not found! Please register to continue`))
      }

      if (!user.isVerified) {
        res.status(401)

        return next(
          new Error(
            `Account not verified. Please verify your email before logging in.`
          )
        )
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        res.status(401)
        return next(new Error(`Wrong Password, Please try again`))
      }

      const accessToken = await getAccessToken(user)
      const refreshToken = await getRefreshToken(user)

      res.status(200).json({ user, accessToken, refreshToken })
    } catch (err) {
      next(err)
    }
  }

  refreshToken = async (req, res, next) => {
    try {
      const header = req.headers['refreshtoken']
      const refreshToken = header.split(' ')[1]

      const payload = await verifyRefreshToken(refreshToken)
      const user = await userModel.findById(payload.userId)

      if (!user) {
        throw new Error('user not found', { statusCode: 404 })
      }

      const newAccessToken = await getAccessToken(user)
      const newRefreshToken = await getRefreshToken(user)

      return res
        .status(200)
        .json({ refreshToken: newRefreshToken, accessToken: newAccessToken })
    } catch (e) {
      next(e)
    }
  }

  resetPassword = async (req, res, next) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400)
        return next(new Error(`Please fill all fields!`))
      }

      const user = await userModel.findOne({ email })

      if (!user) {
        res.status(404)
        return next(new Error(`User with this email does not exist`))
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      user.password = hashedPassword
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password has been successfully reset',
      })
    } catch (e) {
      next(e)
    }
  }

  sendOtp = async (req, res, next) => {
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

  verifyOtp = async (req, res, next) => {
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

      user.isVerified = true
      await user.save()

      const accessToken = await getAccessToken(user)

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        accessToken,
      })
    } catch (e) {
      next(e)
    }
  }

  updateProfile = async (req, res, next) => {
    try {
      const { email } = req.body
      const user = await userModel.findOne({ email })

      if (!user) {
        res.status(404)
        return next(new Error(`no user found!`))
      }

      const profileImage = req.file ? req.file.filename : null

      if (profileImage) {
        user.avatar = profileImage
      }

      await user.save()

      res.json({ success: true, message: 'File updated successfully!' })
    } catch (err) {
      next(err)
    }
  }
}
