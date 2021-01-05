const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const AttendanceRecord = require('../models/AttendanceRecord');
const isAuthenticated = require('./auth_middleware');

// collects the attendance for instructor with given attendanceId
router.post('/collect-attendance', isAuthenticated, (req, res) => {
    let {userId, classroomId, attendanceId} = req.body;
    Classroom.findOne({_id: classroomId, instructorId: userId}).then(classroom => {
        if (!classroom) return res.status(200).json({error: `Failed to find your classroom!`});
        if (classroom.collectingFor)    return res.status(200).json({error: `You are alreading collecting attendance for ${classroom.collectingFor}`});
        AttendanceRecord.findOne({classroomId, attendanceId}).then(oldRecord => {
            if (oldRecord) return res.status(200).json({error: `You have already used that attendanceId for this classroom!`});
            let record = new AttendanceRecord();
            record.classroomId = classroomId;
            record.attendanceId = attendanceId;
            record.accepting = true;
            record.students = [];
            record.save().then(() => {
                classroom.collectingFor = attendanceId;
                classroom.save().then(()=>{
                    AttendanceRecord.find({classroomId}).then(records => {
                        return res.status(200).json({classroom, records});
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json({error: err});
                    });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: err});
    });
});


// stops collecting attendance for given classroom with given attendanceId
router.post('/stop-collecting', isAuthenticated, (req, res) => {
    let {userId, classroomId, attendanceId} = req.body;
    Classroom.findOne({_id: classroomId, instructorId: userId}).then(classroom => {
        if (!classroom) return res.status(200).json({error: `Failed to find your classroom!`});
        AttendanceRecord.findOne({classroomId, attendanceId}).then(record => {
            if (!record) return res.status(200).json({error: `No such attendanceId found for this classroom!`});
            record.accepting = false;
            record.save().then(() => {
                classroom.collectingFor = null;
                classroom.save().then(()=>{
                    AttendanceRecord.find({classroomId}).then(records => {
                        return res.status(200).json({classroom, records});
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).json({error: err});
                    });
                }).catch(err => {
                    console.log(err);
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: err});
    });
});

// marks the attendance for given students
router.post('/mark-attendance', isAuthenticated, (req, res) => {
    let {userId, classroomId} = req.body;
    User.findOne({_id: userId, role: 'student'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        Classroom.findOne({_id: classroomId}).then(classroom => {
            if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
            if (!classroom.collectingFor)   return res.status(200).json({error: `That classroom is no more collecting attendances!`});
            AttendanceRecord.findOne({classroomId, attendanceId: classroom.collectingFor}).then(record => {
               if (!record) return res.status(200).json({error: `Failed to find a matching record!`});
               if (!record.accepting)   return res.status(200).json({error: `That classroom is no more collecting attendance!`});
               if (record.students.indexOf(user.email) !== -1)  return res.status(200).json({error: `You have already marked your attendance!`});
               record.students.push(user.email);
               record.save().then(()=>{
                   AttendanceRecord.find({classroomId}).then(records => {
                        return res.status(200).json({classroom, records});
                    }).catch(err => {                        
                        console.log(err);
                        return res.status(500).json({error: err});
                   });
               }).catch(err => {
                   console.log(err);
                   return res.status(500).json({error: err});
               }); 
            }).catch(err => {
                console.log(err);
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: err});
    });
});


// export the router
module.exports = router;