import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../models/userDB.js'
import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from '../../constants.js'
import Otp from '../models/userModel.js'
import { sendOTP, signupOTP } from './otpController.js'

dotenv.config()

export default class AuthenticationController {
  // registerUser = async (req, res, next) => {
  //   try {
  //     const { email, password, username, role } = req.body
  //     const hashedPass = await bcrypt.hash(password, 10)
  //     const existingUser = await User.findOne({ email })
  //     if (existingUser) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'User already exists',
  //       })
  //     }
  //     const user = new User({ email, password: hashedPass, username, role })
  //     await user.save()

  //     sendOTP()

  //     const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 })
  //     if (!recentOtp || recentOtp.otp !== otp) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Invalid or expired OTP',
  //       })
  //     }

  //     res.status(201).json({ success: true, user })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  registerUser = async (req, res, next) => {
    try {
      const { email, password, username, role } = req.body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        })
      }

      // Send OTP and wait for it to be saved
      const otp = await signupOTP(email)

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Verify to complete registration',
        email,
      })
    } catch (error) {
      next(error)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const secretKey = JWT_SECRET_KEY
      const refreshSecretKey = JWT_REFRESH_SECRET_KEY
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        res.status(404)
        throw new Error('User not found!')
      }

      const passwordMatched = await bcrypt.compare(password, user.password)

      if (!passwordMatched) {
        res.status(401)
        throw new Error('Authentication failed, password not matched')
      }

      const accessToken = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '1h',
      })

      const refreshToken = jwt.sign({ userId: user._id }, refreshSecretKey, {
        expiresIn: '60d',
      })

      await user.save()

      res.status(200).json({ accessToken, refreshToken, user })
    } catch (error) {
      next(error)
    }
  }

  logoutUser = async (req, res, next) => {
    try {
      const { userId } = req.body

      const user = await User.findById(userId)

      if (!user) {
        res.status(404)
        throw new Error('User not found')
      }

      await user.save()

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
