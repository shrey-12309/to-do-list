import dotenv from 'dotenv'

dotenv.config({
  path: './.env',
})

const PORT = Number(process.env.PORT) || 8000
const DOMAIN = process.env.DOMAIN || 'http://127.0.0.1'
const URI = process.env.URI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY
const MAIL_HOST = process.env.MAIL_HOST
const MAIL_PASS = process.env.MAIL_PASS
const MAIL_USER = process.env.MAIL_USER

export {
  PORT,
  DOMAIN,
  URI,
  JWT_REFRESH_KEY,
  JWT_SECRET_KEY,
  MAIL_HOST,
  MAIL_PASS,
  MAIL_USER,
}
