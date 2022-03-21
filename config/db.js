const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'production';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.mainDb = () => {
  if (env === 'production') {
    mongoose
      .connect(process.env.DB_URI, options)
      .then(() => {
        console.log('Connected to Database successfully');
      });
  }

  if (env === 'test') {
    mongoose
      .connect(process.env.DB_URI_TEST, options)
      .then(() => {
        console.log('Connected to test Database successfully');
      });
  }
};