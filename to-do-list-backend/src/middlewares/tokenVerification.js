import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../../constants.js'

function verifyToken(req, res, next) {
  try {
    console.log('inside verify token')

    const authHeader = req.headers['authorization']
    const head = req.headers
    console.log(head)

    const token = authHeader.split(' ')[1]
    console.log(token)

    if (!token) {
      throw new Error('Token not found, access denied', { status: 401 })
    }
    const tokenVerified = jwt.verify(token, JWT_SECRET_KEY)
    req.user = tokenVerified.userId
    next()
  } catch (e) {
    e.status = 401
    next(e)
  }
}

export default verifyToken
