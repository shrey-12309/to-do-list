import express from 'express'
import UserOperations from '../controllers/userController.js'
import UserValidations from '../validators/middlewares/userValidator.js'

const route = express.Router()

const userAuthOperations = new UserOperations()
const userAuthValidations = new UserValidations()

route.post(
  '/auth/signup',
  userAuthValidations.validateSignUpRequest,
  userAuthOperations.saveUser
)

export default route
