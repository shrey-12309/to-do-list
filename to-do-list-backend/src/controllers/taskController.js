import TaskDb from '../models/taskDB.js'

export default class taskController {
  getAllTasks = async (req, res, next) => {
    try {
      const data = await TaskDb.find()
      if (!data) {
        throw new Error('Failed to read task List')
      }
      return await res.json(data)
    } catch (e) {
      next(e)
    }
  }

  addNewTask = async (req, res, next) => {
    try {
      await TaskDb.create(req.body)

      res.status(201).json()
    } catch (e) {
      next(e)
    }
  }

  updateCompletionStatus = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ error: 'Missing task ID' })

      const prevItem = await TaskDb.findById(id)

      if (!prevItem) {
        throw new Error('Cannot Find Item!', { statusCode: 404 })
      }

      const updatedItem = await TaskDb.findOneAndUpdate(
        { _id: id },
        [{ $set: { isCompleted: { $not: ['$isCompleted'] } } }],
        { new: true }
      )

      if (!updatedItem) {
        throw new Error('Failed to update the completion status')
      }

      return res.status(200).json({ message: 'Completion status updated.' })
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
        throw new Error('Unable to update task!')
      }

      res.status(200).json({
        message: 'Task updated successfully!',
      })
    } catch (e) {
      next(e)
    }
  }

  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params

      const delItem = await TaskDb.findByIdAndDelete(id)

      if (!delItem) {
        throw new Error('Item to be deleted not found', { statusCode: 404 })
      }

      res.status(204).json({ message: `task deleted successfully!` })
    } catch (e) {
      next(e)
    }
  }

  sortTask = async (req, res, next) => {
    try {
      console.log('inside backend sorting')
      const sortFilter = req.query.sortFilter
      console.log(sortFilter)

      let filteredTasks = null

      if (sortFilter === 'pending') {
        filteredTasks = await TaskDb.find({ isCompleted: false })
      } else if (sortFilter === 'completed') {
        filteredTasks = await TaskDb.find({ isCompleted: true })
      }

      if (!filteredTasks) {
        throw new Error('cannot fetch sorted tasks')
      }
      console.log('this is filtered tasks', filteredTasks)
      return await res.json(filteredTasks)
    } catch (e) {
      next(e)
    }
  }

  searchTask = async (req, res, next) => {
    try {
      let { searchText, searchFilter } = req.query
      searchText = searchText.toLowerCase()

      console.log(searchFilter, searchText)

      const filteredTasks = await TaskDb.find({
        $or: [
          { task: { $regex: searchText, $options: 'i' } },
          { preference: { $regex: searchText, $options: 'i' } },
          { tags: { $elemMatch: { $regex: searchText, $options: 'i' } } },
        ],
      })

      if (!filteredTasks) {
        throw new Error('cannot fetch searched tasks')
      }

      console.log('this is filtered tasks', filteredTasks)
      return await res.json(filteredTasks)
    } catch (e) {
      next(e)
    }
  }
}
