import mongoose from 'mongoose';
import {dbURL} from '../config';
const databaseURL = dbURL;

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options);

module.exports = mongoose;