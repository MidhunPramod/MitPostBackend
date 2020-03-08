const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Students = require('../models/student');
const path = require('path');

const url = 'mongodb://localhost:27017/school';
const connect = mongoose.connect(url);


router.get('/addStudent', (req, res) => {
    return res.sendFile(path.resolve('views/index.html'));
})

router.post('/addStudent', (req, res, next) => {

    Students.create(req.body)
        .then((student) => {
            console.log('Record Created');
            res.send(student);
        })
        .catch((err) => next(err))
})

router.get('/checkStudent', (req, res, next) => {
    return res.sendFile(path.resolve('./views/search_student.html'));
})

router.post('/checkStudent', (req, res, next) => {
    const value = req.body.value;
    // console.log(value);
    Students.find({
        "name": {
            $regex: value
        }
    }).then((student) => {
        res.send(student)
        console.log(student);
    })
})

module.exports = router;