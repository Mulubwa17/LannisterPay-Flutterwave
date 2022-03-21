require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');
const compression = require('compression');
const db = require('./config/db');

const app = express();

const options = {
    origin: '*',
    optionsSuccessStatus: 200,
  };

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger('combined'));
app.use(helmet());
app.use(compression());
app.use(cors(options));

db.mainDb();

app.get('/', (req, res) => {
 
  // Sending the response
  res.send('Hello World!')
  
  // Ending the response
  res.end()
})

const Fees = require('./src/routes/transaction');


app.use('/api', Fees);



app.listen(3000, () => console.log('Connected on port 3000.'));