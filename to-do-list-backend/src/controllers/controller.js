import Task_Db from '../models/todo_db.js';

const getAllTasks = async (req, res, next) => {
  try {
    const data = await Task_Db.find();
    if (!data) {
      throw new Error('Failed to read task List');
    }
    return await res.json(data);
  } catch (e) {
    next(e);
  }
};

const addNewTask = async (req, res, next) => {
  try {
    await Task_Db.create(req.body);
    res.status(201).json();
  } catch (e) {
    next(e);
  }
};

const updateCompletionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing task ID' });

    const prevItem = await Task_Db.findById(id);

    if (!prevItem) {
      throw new Error('Cannot Find Item!', { statusCode: 404 });
    }

    const updatedItem = await Task_Db.findByIdAndUpdate(
      id,
      { $set: { isCompleted: !prevItem.isCompleted } },
      { new: true }
    );

    if (!updatedItem) {
      throw new Error('Failed to update the completion status');
    }

    return res.status(200).json({ message: 'Completion status updated.' });
  } catch (e) {
    next(e);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task_Db.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error('Unable to update task!');
    }

    res.status(200).json({
      message: 'Task updated successfully!',
    });
  } catch (e) {
    next(e);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const delItem = await Task_Db.findByIdAndDelete(id);

    if (!delItem) {
      throw new Error('Item to be deleted not found', { statusCode: 404 });
    }

    res.status(204).json({ message: `task deleted successfully!` });
  } catch (e) {
    next(e);
  }
};

const sortTask = async (req, res, next) => {
  try {
    let { sortFilter } = req.query;
    let filteredTasks = null;

    if (sortFilter === 'pending') {
      filteredTasks = await Task_Db.find({
        $match: [{ isCompleted: false }],
      });
    } else if (sortFilter === 'completed') {
      filteredTasks = await Task_Db.find({ $match: [{ isCompleted: true }] });
    }

    if (!filteredTasks) {
      throw new Error('cannot fetch sorted tasks');
    }
    return filteredTasks;

  } catch (e) {
    next(e);
  }
};

const searchTask = async (req, res, next) => {

};

export {
  getAllTasks,
  addNewTask,
  updateCompletionStatus,
  updateTask,
  deleteTask,
  sortTask,
  searchTask,
};