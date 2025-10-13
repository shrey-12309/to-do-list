import Router from 'express'
import verifyToken from '../middlewares/authValidator.js'

const protectedRoute = new Router()

protectedRoute.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' })
})

export default protectedRoute
