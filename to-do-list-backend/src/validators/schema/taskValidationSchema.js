import * as yup from 'yup'

export const taskCreateSchema = yup.object({
  task: yup.string().required('Title is required'),
  preference: yup.string().required(),
  tags: yup.array().of(yup.string()).default([]),
  isCompleted: yup.boolean().default(false),
})

export const taskUpdateSchema = yup.object({
  task: yup.string(),
  preference: yup.string().required(),
  tags: yup.array().of(yup.string()),
  isCompleted: yup.boolean(),
})
