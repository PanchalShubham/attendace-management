const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const AttendanceRecord = require('../models/AttendanceRecord');

// edit the details of  the user before sending!
function editBeforeSend(user, classrooms) {
    user.password = null;
    let names = [];
    for (let i = 0; i < classrooms.length; ++i){
        let {_id, className, instructorId, code} = classrooms[i];
        names.push({_id, className, instructorId, code});
    }
    let jsonObject = {...user._doc, classrooms: names};
    return jsonObject;
}


// creates new classroom for instructor
router.post('/create-classroom', (req, res) => {
    let {userId, className} = req.body;
    User.findOne({_id: userId, role: 'teacher'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find that user!`});
        Classroom.findOne({instructorId: userId, className: className}).then(oldClassroom => {
            if (oldClassroom)  return res.status(200).json({error: "You have already used that classname!"});
            let classroom = new Classroom();
            classroom.className = className;
            classroom.instructorId = userId;
            classroom.code = crypto.randomBytes(5).toString('hex');
            classroom.students = [];
            classroom.studentOnce = [];
            classroom.collectingFor = null;
            classroom.save().then(()=>{
                Classroom.find({instructorId: userId}).then(classrooms => {
                    user = editBeforeSend(user, classrooms);
                    return res.status(200).json({user});
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


// deletes the given classroom
router.post('/delete-classroom', (req, res) => {
    let {userId, className} = req.body;
    User.findOne({_id: userId, role: 'teacher'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find that user!`});
        Classroom.findOne({instructorId: userId, className: className}).then(classroom => {
            if (!classroom)  return res.status(200).json({error: "Failed to find that classroom!"});
            AttendanceRecord.deleteMany({classroomId: classroom._id}).then(()=>{
                Classroom.deleteOne({instructorId: userId, className: className}).then(()=>{
                    Classroom.find({instructorId: userId}).then(classrooms => {
                        user = editBeforeSend(user, classrooms);
                        return res.status(200).json({user});
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
});

// creates new classroom for instructor
router.post('/join-classroom', (req, res) => {
    let {useremail, classCode} = req.body;
    User.findOne({email: useremail, role: 'student'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find that user!`});
        Classroom.findOne({code: classCode}).then(classroom => {
            if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
            if (classroom.students.indexOf(useremail) != -1)
                return res.status(200).json({error: `You have already joined that classroom`});
            classroom.students.push(useremail);
            classroom.studentOnce.push(useremail);
            classroom.save().then(()=>{
                Classroom.find({students: user.email}).then(classrooms => {
                    user = editBeforeSend(user, classrooms);
                    return res.status(200).json({user});
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

// leave classroom
router.post('/leave-classroom', (req, res) => {
    let {userEmail, classroomId} = req.body;
    User.findOne({email: userEmail, role: 'student'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        Classroom.findOne({_id: classroomId}).then(classroom => {
            if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
            let index = classroom.students.indexOf(userEmail);
            if (index === -1)   return res.status(200).json({error: `You are not a member of that classroom!`});
            classroom.students.splice(index, 1);
            classroom.save().then(()=>{
                Classroom.find({students: userEmail}).then(classrooms => {
                    user = editBeforeSend(user, classrooms);
                    return res.status(200).json({user});
                }).catch(err => {
                    console.log(err);
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