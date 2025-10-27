import * as yup from 'yup'

export const userCreateSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().required('email is required'),
  password: yup.string().required('password is required'),
  isVerified: yup.boolean().default(false),
})
