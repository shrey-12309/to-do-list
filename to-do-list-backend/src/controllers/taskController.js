import TaskDb from '../models/taskDB.js'

export default class TaskController {
  getAllTasks = async (req, res, next) => {
    try {
      const userId = req.user

      const data = await TaskDb.find({})
      console.log('this is frontend data', data)

      if (!data) {
        res.status(404)
        return next(new Error(`No tasks found for this user.`))
      }

      return await res.status(200).json({ success: true, data })
    } catch (e) {
      next(e)
    }
  }

  addNewTask = async (req, res, next) => {
    try {
      const user = req.user

      await TaskDb.create({ user, ...req.body })

      res
        .status(201)
        .json({ success: true, message: `task added successfully!` })
    } catch (e) {
      next(e)
    }
  }

  updateCompletionStatus = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        res.status(400)
        return next(new Error('Bad Request, Task ID is missing'))
      }

      const prevItem = await TaskDb.findById(id)

      if (!prevItem) {
        res.status(404)
        return next(new Error(`Unable to find task!`))
      }

      const updatedItem = await TaskDb.findByIdAndUpdate(
        id,
        { $set: { isCompleted: !prevItem.isCompleted } },
        { new: true }
      )

      if (!updatedItem) {
        res.status(404)
        return next(new Error(`failed to update task!`))
      }

      return res
        .status(200)
        .json({ success: false, message: `task updated successfully!` })
    } catch (e) {
      next(e)
    }
  }

  updateTask = async (req, res, next) => {
    try {
      const { id } = req.params
      const updatedTask = await TaskDb.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      )

      if (!updatedTask) {
        res.status(404)
        return next(new Error(`failed to update task!`))
      }

      return res
        .status(200)
        .json({ success: false, message: `task updated successfully!` })
    } catch (e) {
      next(e)
    }
  }

  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params
      const delItem = await TaskDb.findByIdAndDelete(id)

      if (!delItem) {
        res.status(404)
        return next(new Error(`Item to be deleted not found`))
      }

      res.status(204).json({ message: `task deleted successfully!` })
    } catch (e) {
      next(e)
    }
  }

  sortTask = async (req, res, next) => {
    try {
      const sortFilter = req.query.sortFilter
      const user = req.user

      let filteredTasks = null

      if (sortFilter === 'pending') {
        filteredTasks = await TaskDb.find({
          $and: [{ isCompleted: false }, { user }],
        })
      } else if (sortFilter === 'completed') {
        filteredTasks = await TaskDb.find({
          $and: [{ isCompleted: true }, { user }],
        })
      }

      if (!filteredTasks) {
        res.status(404)
        next(new Error(`Unable to fetch sorted task!`))
      }

      res.status(200).json({ success: true, filteredTasks })
    } catch (e) {
      next(e)
    }
  }

  searchTask = async (req, res, next) => {
    try {
      let { searchText } = req.query
      const user = req.user

      searchText = searchText.toLowerCase()

      const filteredTasks = await TaskDb.find({
        $and: [
          {
            $or: [
              { task: { $regex: searchText, $options: 'i' } },
              { preference: { $regex: searchText, $options: 'i' } },
              { tags: { $elemMatch: { $regex: searchText, $options: 'i' } } },
            ],
          },
          { user },
        ],
      })

      if (!filteredTasks) {
        res.status(404)
        next(new Error('cannot fetch searched tasks'))
      }

      return await res.json(filteredTasks)
    } catch (e) {
      next(e)
    }
  }

  clearTask = async (req, res, next) => {
    try {
      const user = req.user
      const del = await TaskDb.deleteMany({ user })

      if (!del) {
        res.status(404)
        next(new Error('Unable to delete all tasks!'))
      }

      res.status(200).json({
        message: 'All tasks deleted successfully!',
        success: true,
      })
    } catch (e) {
      next(e)
    }
  }
}
