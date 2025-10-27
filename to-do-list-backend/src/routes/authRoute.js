import express from 'express'
import multer from 'multer'
import UserController from '../controllers/AuthController.js'
import verifyToken from '../middlewares/tokenVerification.js'
import UserValidation from '../validators/middlewares/UserValidation.js'

const userRouter = express.Router()
const userInstance = new UserController()
const validationInstance = new UserValidation()

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

userRouter.post('/login', userInstance.loginUser)
userRouter.post(
  '/register',
  validationInstance.validateUser,
  userInstance.registerUser
)
userRouter.post('/refresh-token', userInstance.refreshToken)
userRouter.post('/reset-password', verifyToken, userInstance.resetPassword)
userRouter.post('/send-otp', userInstance.sendOtp)
userRouter.post('/verify-otp', userInstance.verifyOtp)
userRouter.post(
  '/update-profile',
  upload.single('avatar'),
  userInstance.updateProfile
)

export default userRouter
