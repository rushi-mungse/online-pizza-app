import express from 'express'
import { APP_PORT } from './config'
import router from './routers'
import errorHandler from './middlewares/errorHandler';
import DbConnected from './database';
import path from 'path'

const app = express();
global.appRoot=path.resolve(__dirname);

app.use(express.urlencoded({extended:false}));
app.use(express.json());
DbConnected();

app.use('/uploads',express.static('uploads'))
app.use(router);


app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))