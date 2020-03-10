const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Students = require('./models/student');
const approute = require('./routes/app');

const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school';
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', approute);


app.listen(PORT, function () {
    console.log('now listening for requests');
});