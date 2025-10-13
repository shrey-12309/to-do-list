import dotenv from 'dotenv'
dotenv.config({
  path: './.env',
})

const PORT = Number(process.env.PORT) || 8000
const DOMAIN = process.env.DOMAIN || 'http://127.0.0.1'

const URI = process.env.URI
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY
export { PORT, DOMAIN, URI, JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY }

//appName=Clusterdb
