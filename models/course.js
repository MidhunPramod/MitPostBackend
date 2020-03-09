const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    course_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        min: 1,
        max: 4
    },
    num_studs: {
        type: Number,
        default: 0
    },
    prereq_ids: [{
        prereq_id: {
            type: Number
        }
    }]
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;