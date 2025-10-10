import dotenv from 'dotenv'
dotenv.config({
    path: './.env',
})

const PORT = Number(process.env.PORT) || 8000;
const DOMAIN = process.env.DOMAIN || 'http://127.0.0.1';

const URI = process.env.URI;
export { PORT, DOMAIN, URI };

//appName=Clusterdb