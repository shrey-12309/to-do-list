import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../../constants.js'

export default function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new Error('Token not found, access denied', { status: 401 })
    }

    const tokenVerified = jwt.verify(token, JWT_SECRET_KEY)
    req.user = tokenVerified.userId

    next()
  } catch (e) {
    res.status(401)
    next(e)
  }
}
