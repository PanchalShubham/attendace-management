const mongoose = require('mongoose');
const classroomSchema = new mongoose.Schema({
    className: {type: String},
    instructorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    code: {type: String},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    data: {type: String}
});
module.exports = mongoose.model('Classroom', classroomSchema);