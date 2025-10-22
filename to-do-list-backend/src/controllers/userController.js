import { userModel } from '../models/userDB.js'
import bcrypt from 'bcrypt'
import {
  getAccessToken,
  getRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtUtils.js'

export default class UserController {
  registerUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await userModel.findOne({ email })
      console.log('this is the user', user)

      if (user) {
        res.status(400)
        next(new Error(`User already exists! Please login to continue.`))
      }

      const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      })

      if (!newUser) {
        res.status = 400
        next(new Error(`Unable to register user! Please try again.`))
      }

      res
        .status(201)
        .json({ success: true, message: 'User generated successfully' })
    } catch (e) {
      next(e)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await userModel.findOne({ email })

      if (!user) {
        res.status(401)
        next(new Error(`User not found! Please register to continue`))
      }

      if (!user.isVerified) {
        res.status(401)
        res.redirect = '/pages/otp?type=reset'
        next(
          new Error(
            `Account not verified. Please verify your email before logging in.`
          )
        )
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        console.log('password not matched invoked!')
        res.status(401)
        next(new Error(`Password not matched, Please try again`))
      }

      const accessToken = await getAccessToken(user)
      const refreshToken = await getRefreshToken(user)

      user.isVerified = true
      await user.save()

      res.status(200).json({ user, accessToken, refreshToken })
    } catch (e) {
      console.log(e)
      next(e)
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
      console.log(email, password)

      if (!email || !password) {
        res.status(400)
        next(new Error(`Please fill all fields!`))
      }

      const user = await userModel.findOne({ email })

      if (!user) {
        res.status(404)
        next(new Error(`User with this email does not exist`))
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
}
