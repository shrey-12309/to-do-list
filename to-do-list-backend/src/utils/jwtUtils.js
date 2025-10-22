import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY, JWT_REFRESH_KEY } from '../../constants.js'

const getAccessToken = async (user) => {
  console.log('this is acccessss token', JWT_SECRET_KEY)
  const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
    expiresIn: '6h',
  })
  return token
}

const getRefreshToken = async (user) => {
  console.log('this is refresh token', JWT_REFRESH_KEY)
  const token = jwt.sign({ userId: user._id }, JWT_REFRESH_KEY, {
    expiresIn: '90d',
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
