import * as yup from 'yup'

export const authUserSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().required(),
  password: yup.string().required(),
  role: yup.string(),
})

export const updateUserSchema = yup.object({
  id: yup.string().optional().required(),
  username: yup.string().optional(),
  email: yup.string().optional(),
  password: yup.boolean().required(),
})
