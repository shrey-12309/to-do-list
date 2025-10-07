import express from 'express';
import {
    getAllTasks,
    addNewTask,
    updateCompletionStatus,
    updateTask,
    deleteTask,
    updateSortedTasks,
    searchTask
} from '../controllers/controller.js';

import { dataValidation } from '../validators/validator.js';

const todoRouter = express.Router();

todoRouter.get('/', getAllTasks);
todoRouter.post('/', addNewTask);
todoRouter.put('/sort', updateSortedTasks);
todoRouter.patch('/:id', updateCompletionStatus);
todoRouter.put('/:id', updateTask);
todoRouter.delete('/:id', deleteTask);
todoRouter.get('/search', searchTask);

export default todoRouter;