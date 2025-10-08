import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { taskCreateSchema } from '../schema/schema.js'
import Task_Db from '../models/todo_db.js';

import { taskUpdateSchema } from '../schema/schema.js'
import { validateRequest } from '../validators/validator.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, '../../database/db.json')


async function readTask() {
  try {
    // const data = await readFile(DB_PATH, 'utf-8');
    // const parsed = JSON.parse(data);
    // return parsed.tasks;
    const data = await Task_Db.find();
    return data;
  } catch (e) {
    console.error('Error reading tasks file:', e);
    return [];
  }
}

async function writeTask(data) {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array of tasks");
    }
    await writeFile(DB_PATH, JSON.stringify({ tasks: data }, null, 2));
  } catch (e) {
    console.error('Error writing tasks file:', e);
  }
}

const getAllTasks = async (req, res) => {
  try {
    const data = await readTask();
    if (!data) {
      throw new Error("Failed to read task List")
    }
    return await res.json(data);
  } catch (e) {
    res.status(500).json({ error: `Failed to read tasks ${e}` });
  }
};

const addNewTask = async (req, res) => {
  try {
    console.log(req.body);
    const validatedData = await validateRequest(taskCreateSchema, req.body.taskData);
    if (!validatedData) throw new Error("validation line 53 error found");

    const newTask = {
      id: new Date().getTime(),
      ...validatedData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // const tasks = await readTask();
    // tasks.push(newTask);
    // await writeTask(tasks);
    Task_Db.create(newTask);
    res.status(201).json();

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `Failed to add new task, ${e}` });
  }
}

const updateCompletionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing task ID" });

    const tasks = await readTask();
    let isFound = false;

    for (let t of tasks) {
      if (String(t.id) === String(id)) {
        t.completed = !t.completed;
        isFound = true;
        break;
      }
    }

    if (!isFound) return res.status(404).json({ error: "Task not found" });

    await writeTask(tasks);
    return res.status(200).json({ message: "completed" });
  } catch (e) {
    res.status(500).json({ error: `Failed to update completion status: ${e.message}` });
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = await validateRequest(taskUpdateSchema, req.body.taskData);
    if (!validatedData) return;

    const tasks = await readTask();
    let isFound = false;

    for (let t of tasks) {
      if (id === String(t.id)) {
        isFound = true;
        Object.assign(t, validatedData);
        t.updatedAt = new Date().toISOString();
        break;
      }
    }

    if (!isFound) return res.status(404).json({ error: `Task not found` });

    await writeTask(tasks);
    res.status(200).json({ success: `task updated successfully!` });
  } catch (e) {
    res.status(500).json({ error: `failed to update task, ${e}` });
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    let tasks = await readTask();
    const len = tasks.length;

    // tasks = tasks.filter((t) => String(t.id) !== id);

    // if (tasks.length === len) {
    //   return res.status(404).json({ error: `task to be deleted not found` });
    // }
    const index = tasks.findIndex(task => task.id === String(id));
    tasks.splice(index, 1);

    await writeTask(tasks);
    res.status(204).json({ message: `task deleted successfully!` });
  }
  catch (e) {
    res.status(500).json({ error: `failed to delete task, ${e}` })
  }
}

const updateSortedTasks = async (req, res) => {
  try {
    const { sortedTasks } = req.body;
    await writeTask(sortedTasks);
    res.status(200).json({ message: `tasks sorted successfully!` });
  } catch (e) {
    res.status(500).json({ error: `failed to sort task, ${e}` });
  }
}
const searchTask = async (req, res) => {
  try {
    const { text, filter } = req.query;
    let tasks = await readTask();

    if (filter === "tags") {
      tasks = tasks.filter(task =>
        Array.isArray(task.tags) &&
        task.tags.some(tag => tag.toLowerCase().includes(text))
      );
    }
    else if (filter === "title") {
      tasks = tasks.filter(task =>
        task.task && task.task.toLowerCase().includes(text)
      );
    }
    else if (filter === "preference") {
      tasks = tasks.filter(task =>
        task.preference && task.preference.toLowerCase().includes(text)
      );
    }

    return res.status(200).json(tasks);
  } catch (e) {
    console.error("Search error:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}




export { getAllTasks, addNewTask, updateCompletionStatus, updateTask, deleteTask, updateSortedTasks, searchTask };