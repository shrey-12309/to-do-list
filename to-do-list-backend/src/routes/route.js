import express from 'express';
import {
    getAllTasks,
    addNewTask,
    updateCompletionStatus,
    updateTask,
    deleteTask,
    searchTask,
    sortTask,
} from '../controllers/controller.js';

import toDoValidations from '../validators/middlewares/validator.js';
const validationInstance = new toDoValidations();

const todoRouter = express.Router();

todoRouter.get('/', getAllTasks);
todoRouter.post('/', validationInstance.validateRequest, addNewTask);
todoRouter.patch('/:id', updateCompletionStatus);
todoRouter.put('/:id', validationInstance.updateRequest, updateTask);
todoRouter.delete('/:id', deleteTask);
todoRouter.get('/search', searchTask);
todoRouter.get('/sort', sortTask);

export default todoRouter;