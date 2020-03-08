const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const takenSchema = new Schema({
    course_id: {
        type: Number,
        required: true
    },
});

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is necessary']
    },
    year: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    },
    reg_no: {
        type: Number,
        required: true,
        unique: true
    },
    course_taken: [takenSchema]

})

const Student = mongoose.model('student', studentSchema);

module.exports = Student;