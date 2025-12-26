const connectToMongo=require('./db');
require('dotenv').config();
connectToMongo();

const express = require('express')

const app = express()
const port = 5000;

// middleware is used here in order to print reuest body
app.use(express.json());

//Availble routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
