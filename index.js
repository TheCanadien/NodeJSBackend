const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const cors = require('cors');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const entryRoute = require('./routes/entry');
app.use('/entry', entryRoute);

const updateRoute = require('./routes/update');
app.use('/update', updateRoute);

const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);


//ROUTES
app.get('/', (req,res) =>{
    res.send('We are on home');
}
);


//connect to DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log('Connected to DB'));

//How do we start listening to the server
app.listen(3000);