const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Students = require('../models/student');
const Courses = require('../models/course');

const path = require('path');

const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb+srv://midhun:midhun123@student-c1hxm.mongodb.net/test?retryWrites=true&w=majority';
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

mongoose.connect(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

router.get('/addStudent', (req, res) => {
    return res.sendFile(path.resolve('views/student_add.html'));
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
    Students.find({
        "name": {
            $regex: value
        }
    }).then((student) => {
        res.send(student)
        console.log(student);
    })
})

router.get('/addCourse', (req, res) => {
    return res.sendFile(path.resolve('./views/course_add.html'));
});


router.post('/addCourse', (req, res, next) => {
    Courses.create(req.body)
        .then((course) => {
            console.log('Course Record Created');
            res.send(course);
        })
        .catch((err) => next(err))
});

router.get('/checkCourse', (req, res, next) => {
    return res.sendFile(path.resolve('./views/search_course.html'));
})

router.post('/checkCourse', (req, res, next) => {
    const value = req.body.value;
    Courses.find({
        "name": {
            $regex: value
        }
    }).then((course) => {
        res.send(course)
        console.log(course);
    })
})

router.get('/studentDetails', (req, res) => {
    return res.sendFile(path.resolve('./views/student_details.html'));
});

router.post('/studentDetails', (req, res) => {
    Students.find({}).then((student) => {
        res.send(student)
        console.log(student);
    })
})

router.get('/courseDetails', (req, res) => {
    return res.sendFile(path.resolve('./views/course_details.html'));
});

router.post('/courseDetails', (req, res) => {
    Courses.find({}).then((course) => {
        res.send(course)
        console.log(course);
    })
})

router.get('/admit', (req, res) => {
    return res.sendFile(path.resolve('./views/admit_students.html'));
})

router.post('/admit', (req, res) => {
    const value = req.body;
    console.log(value);
    check_details(value);

    async function check_details(data) {
        let student = await Students.find({
            "reg_no": value.stud_id
        })

        let course = await Courses.find({
            "course_id": value.course_id
        })

        if (student.length == 0) {
            res.send({
                "msg": "Invalid Student Username"
            })
        }

        if (course.length == 0) {
            return res.send({
                "msg": "Invalid Course Id"
            })
        } else
        if (student[0].year < course[0].year) {
            return res.send({
                "msg": `Student with year ${student[0].year},cannot take course with year ${course[0].year}`
            })
        } else {
            let flag = 0;
            prereq_array = [];

            for (let k = 0; k < course[0].prereq_ids.length; k++) {
                prereq_array.push(course[0].prereq_ids[k].prereq_id);
            }

            course_taken = [];

            for (let l = 0; l < student[0].course_taken.length; l++) {
                course_taken.push(student[0].course_taken[l].course_id)
            }

            console.log(course_taken.includes(Number(value.course_id)));

            if (course_taken.includes(Number(value.course_id))) {
                return res.send({
                    "msg": "Course Already Taken"
                })
            }

            for (let m = 0; m < prereq_array.length; m++) {
                if (course_taken.indexOf(prereq_array[m]) == -1) {
                    flag = 1;
                    return res.send({
                        "msg": `Take Course id : ${prereq_array[m]} before taking this course`
                    });
                }
            }

            if (flag == 0) {
                Students.updateOne({
                    reg_no: value.stud_id
                }, {
                    $push: {
                        course_taken: {
                            "course_id": value.course_id
                        }
                    }
                }, ).then(
                    Courses.updateOne({
                        "course_id": value.course_id
                    }, {
                        $inc: {
                            num_studs: 1
                        }
                    }).then(
                        res.send({})
                    )
                ).catch((e) => {
                    console.log(e);
                    res.send({
                        "msg": "Problem Updating"
                    })

                })
            }
        }

    }
})

module.exports = router;