const mongoose = require('mongoose');
const classroomSchema = new mongoose.Schema({
    instructorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    data: {type: String},
    code: {type: String}
});
module.exports = mongoose.model('Classroom', classroomSchema);