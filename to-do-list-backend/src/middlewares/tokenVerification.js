import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../../constants.js'

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    const head = req.headers
    console.log(head)

    const token = authHeader.split(' ')[1]
    console.log(token)

    if (!token) {
      throw new Error('Token not found, access denied', { statusCode: 401 })
    }
    const tokenVerified = jwt.verify(token, JWT_SECRET_KEY) //tokenVerified will have the details of user.
    req.user = tokenVerified._id
    next()
  } catch (e) {
    next(e)
  }
}

export default verifyToken
