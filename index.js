import express from 'express';
import cors from 'cors';
import {router} from './route/router.js';

const port = 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',router);

app.listen(port, ()=> console.log(`Server running on port ${port}`));