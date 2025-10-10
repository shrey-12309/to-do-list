import {
    taskCreateSchema,
    taskUpdateSchema,
} from '../schema/schema.js';

export default class toDoValidations {
    //validation for adding new task in the todo list.
    validateRequest = async (req, res, next) => {
        try {
            await taskCreateSchema.validate(req.body.taskData, {
                abortEarly: false,
                stripUnknown: true,
            });
            next(); //calling next if task performed.
        } catch (err) {
            if (err.name === 'ValidationError') {
                err.status = 400;
                next(new Error(err.errors.join(', ')));
            }
            next(err);
        }
    };

    //validation for updating values.
    updateRequest = async (req, res, next) => {
        try {
            await taskUpdateSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            next();
        } catch (err) {
            if (err.name === 'ValidationError') {
                err.status = 400;
                next(new Error(err.errors.join(', ')));
            }
            next(err);
        }
    };
}