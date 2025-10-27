import { userCreateSchema } from '../schema/userValidationSchema.js'

export default class UserValidation {
  validateUser = async (req, res, next) => {
    try {
      await userCreateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      })

      next()
    } catch (err) {
      if (err.name === 'ValidationError') {
        err.status = 400
        next(new Error(err.errors.join(', ')))
      }

      next(err)
    }
  }
}
