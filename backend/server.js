import express from 'express'
import { APP_PORT } from './config'
import router from './routers'
import errorHandler from './middlewares/errorHandler';
import DbConnected from './database';
import path from 'path'

import cors from 'cors'

const app = express();

const corsOption={
    credentials: true,
    origin:['http://localhost:3000']
}
app.use(cors(corsOption))
global.appRoot=path.resolve(__dirname);

app.use(express.urlencoded({extended:false}));
app.use(express.json());
DbConnected();

app.use('/uploads',express.static('uploads'))
app.use(router);


app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))