const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const app = express();
const mongoose = require('mongoose')
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true })) //register middleware //
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3002
//=====================================
//              MODELS
//=====================================
const { User } = require('./models/user')



//=====================================
//              USERS
//=====================================
app.post('/api/users/register', (req, res) => {//request, response
    res.status(200);

})




app.listen(port, () => {
    console.log(`Server Runing at ${port}`)
})