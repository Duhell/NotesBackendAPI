import "dotenv/config";
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {router} from './route/router.js';

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({limit:'10mb', extended: true }));
app.use(cookieParser());
app.use('/api',router);

app.listen(port, ()=> console.log(`Server running on port ${port}`));