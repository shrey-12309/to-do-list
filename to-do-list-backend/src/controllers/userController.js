import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../models/userDB.js'
import { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from '../../constants.js'
import { sendOTP } from './otpController.js'

dotenv.config()

export default class AuthenticationController {
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

      const hashedPass = await bcrypt.hash(password, 10)
      const user = new User({ email, password: hashedPass, username, role })
      await user.save()

      req.body.email = email
      await sendOTP(req, res, next)
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
        return res.status(404).json({ message: 'User not found!' })
      }

      const passwordMatched = await bcrypt.compare(password, user.password)

      if (!passwordMatched) {
        return res.status(401).json({ message: 'Incorrect password' })
      }

      const accessToken = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '1h',
      })
      const refreshToken = jwt.sign({ userId: user._id }, refreshSecretKey, {
        expiresIn: '60d',
      })

      res.status(200).json({ accessToken, refreshToken, user })
    } catch (error) {
      next(error)
    }
  }

  logoutUser = async (req, res, next) => {
    try {
      const { userId } = req.body
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: 'User not found' })

      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
