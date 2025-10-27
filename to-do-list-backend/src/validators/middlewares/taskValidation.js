import {
  taskCreateSchema,
  taskUpdateSchema,
} from '../schema/taskValidationSchema.js'

export default class TaskValidation {
  validateRequest = async (req, res, next) => {
    try {
      await taskCreateSchema.validate(req.body, {
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

  updateRequest = async (req, res, next) => {
    try {
      await taskUpdateSchema.validate(req.body, {
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
