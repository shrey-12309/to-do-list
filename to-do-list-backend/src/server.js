import express from 'express'
import cors from 'cors';
import { PORT, DOMAIN, URI } from '../constants.js';
import todoRouter from './routes/route.js';
import { connectToMongoDB } from '../DB/connect.js';

const app = express();
const port = PORT;
const domain = DOMAIN;
const uri = URI;
connectToMongoDB(uri);
// console.log("this is me");

app.use(cors());
app.use(express.json());

app.use('/', todoRouter);

app.listen(port, () => {
    console.log(`Server Running At ${domain}:${port}`);
});
