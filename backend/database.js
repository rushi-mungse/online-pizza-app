import mongoose from 'mongoose'
import { MONGO_URL } from './config'
function DbConnected() {
    const DB_URL = MONGO_URL;

    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB Connected..')
    });

}
export default DbConnected