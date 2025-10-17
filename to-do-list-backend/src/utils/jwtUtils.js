import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY, JWT_REFRESH_KEY } from '../../constants.js'

const getAccessToken = async (user) => {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
    expiresIn: '10s',
  })
  return token
}

const getRefreshToken = async (user) => {
  const token = jwt.sign({ userId: user._id }, JWT_REFRESH_KEY, {
    expiresIn: '1m',
  })

  return token
}

const verifyRefreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('No access token provided')
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_KEY)

    return decoded
  } catch {
    throw new Error('Invalid or expired access token')
  }
}

const verifyAccessToken = (accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('No access token provided')
    }

    const decoded = jwt.verify(accessToken, JWT_SECRET_KEY)

    return decoded
  } catch {
    throw new Error('Invalid or expired access token')
  }
}

export {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
