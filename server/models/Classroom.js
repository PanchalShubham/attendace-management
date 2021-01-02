const mongoose = require('mongoose');
const classroomSchema = new mongoose.Schema({
    className: {type: String},
    instructorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    code: {type: String},
    studentOnce: [{type: String}],
    students: [{type: String}],
    collectingFor: {type: String}
});
module.exports = mongoose.model('Classroom', classroomSchema);