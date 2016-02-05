import mongoose from 'mongoose';
import config from './config';
import app from './app';

// connect to database

mongoose.connect(config.db.development);

// start the mother

console.log('Up and running under 127.0.0.1:3000');
app.listen(config.port.production);
