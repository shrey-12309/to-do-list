import express from 'express'
import UserController from '../controllers/userController.js'
const userRouter = express.Router()

const userInstance = new UserController()

userRouter.post('/login', userInstance.loginUser)
userRouter.post('/register', userInstance.registerUser)
userRouter.post('/refreshToken', userInstance.refreshToken)
userRouter.post('/resetPassword', userInstance.resetPassword)

export default userRouter
