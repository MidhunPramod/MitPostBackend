const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Students = require('./models/student');
const approute = require('./routes/app');

mongoose.connect('mongodb://localhost:27017/school')
    .then((connect) => {
        console.log('Successfully Connected');
    })
    .catch((err) => {
        console.log(err);
    })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', approute);


app.listen(process.env.port || 4000, function () {
    console.log('now listening for requests');
});