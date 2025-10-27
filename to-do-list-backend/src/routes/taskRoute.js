import express from 'express'
import TaskController from '../controllers/taskController.js'
import TaskValidation from '../validators/middlewares/taskValidation.js'

const validationInstance = new TaskValidation()
const taskInstance = new TaskController()
const taskRouter = express.Router()

taskRouter.get('/', taskInstance.getAllTasks)

taskRouter.post(
  '/',
  validationInstance.validateRequest,
  taskInstance.addNewTask
)

taskRouter.patch('/:id', taskInstance.updateCompletionStatus)

taskRouter.put(
  '/:id',
  validationInstance.updateRequest,
  taskInstance.updateTask
)

taskRouter.delete('/:id', taskInstance.deleteTask)
taskRouter.get('/search', taskInstance.searchTask)
taskRouter.get('/sort', taskInstance.sortTask)
taskRouter.delete('/', taskInstance.clearTask)

export default taskRouter
