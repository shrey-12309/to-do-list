import express from 'express';
import taskController from '../controllers/taskController.js';

import toDoValidations from '../validators/middlewares/taskValidation.js';
const validationInstance = new toDoValidations();
const taskControllerInstance = new taskController();


const todoRouter = express.Router();

todoRouter.get('/', taskControllerInstance.getAllTasks);
todoRouter.post('/', validationInstance.validateRequest, taskControllerInstance.addNewTask);
todoRouter.patch('/:id', taskControllerInstance.updateCompletionStatus);
todoRouter.put('/:id', validationInstance.updateRequest, taskControllerInstance.updateTask);
todoRouter.delete('/:id', taskControllerInstance.deleteTask);
todoRouter.get('/search', taskControllerInstance.searchTask);
todoRouter.get('/sort', taskControllerInstance.sortTask);

export default todoRouter;