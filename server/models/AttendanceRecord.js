const mongoose = require('mongoose');
const attendanceRecordSchema = mongoose.Schema({
    classroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
    attendanceId: {type: String},
    // whether or not this record is accepting attendance
    accepting: {type: Boolean},
    // list of emails of students who marked their attendance
    students: [{type: String}]
});
module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);