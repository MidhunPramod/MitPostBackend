const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Students = require('../models/student');
const path = require('path');

const url = 'mongodb://localhost:27017/school';
const connect = mongoose.connect(url);


router.get('/', (req, res) => {
    return res.sendFile(path.resolve('views/index.html'));
})

router.post('/', (req, res, next) => {
    console.log(req.body);

    Students.create(req.body)
        .then((student) => {
            console.log('Record Created');
            res.send(student);
        })
        .catch((err) => next(err))
})

module.exports = router;