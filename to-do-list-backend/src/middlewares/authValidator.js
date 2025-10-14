import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../../constants.js'

export default function verifyAccessToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Access token missing or malformed' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET_KEY)

    req.user = decoded
    next()
  } catch (err) {
    console.error('Token verification error:', err.message)

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' })
    }

    res.status(401).json({ message: 'Invalid access token' })
  }
}
