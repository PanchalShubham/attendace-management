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
    for (let i = 0; i < classrooms.length; ++i)
        names.push(classrooms[i].className);
    let jsonObject = {...user._doc, classrooms: names};
    return jsonObject;
}

router.get('/', (req, res) => {
    res.status(200).send("Welcome to attendance-management system server!");
});

router.post('/register', (req, res) => {
    let {username, email, password, role} = req.body;
    User.findOne({email: email, role: role}).then(oldUser => {
        if (oldUser) return res.status(200).json({error: `That email is already registered for ${role} role!`});
        let user = new User();
        user.username = username;
        user.email = email;
        user.role = role;
        user.password = user.encryptPassword(password);
        user.save().then(() => {
            return res.status(200).json({});
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});

router.post('/login', (req, res) => {
    let {email, password, role} = req.body;
    User.findOne({email: email, role: role}).then(user => {
        if (!user)   return res.status(200).json({error: `That email is not registered for ${role} role!`});
        if (!user.isValidPassword(password)) return res.status(200).json({error: `Invalid password!`});
        // if (user.loggedIn)  return res.status(200).json({error: `You are already logged in on another device`});
        user.loggedIn = true;
        user.save().then(()=>{
            user.password = null;
            return res.status(200).json({user});    
        }).catch(err => {
            return res.status(500).json({error: err});
        })
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});

router.post('/logout', (req, res) => {
    let {userId} = req.body;
    User.findOne({_id: userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Couldn't find your account!`});
        user.loggedIn = false;
        user.save().then(()=>{
            return res.status(200).json({});
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});

router.get('/user/:userId', (req, res) => {
    let {userId} = req.params;
    User.findOne({_id: userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        let query = (user.role === 'teacher' ? {instructorId: userId} : {students: user.email});
        Classroom.find(query).then(classrooms => {
            user = editBeforeSend(user, classrooms);
            return res.status(200).json({user});
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});







// fetches the list of classrooms based on role!
// router.get('/classrooms/:role/:userId', (req, res) => {
//     let {userId, role} = req.params; 
//     let query = (role === 'teacher' ? {instructorId : userId} : {students: userId});
//     Classroom.find(query).then(classrooms => {
//         return res.status(200).json({classrooms});
//     }).catch(err => {
//         return res.status(500).json({error: err});
//     });
// });


// fetch the details of given classroom
router.get('/classroom/:instructorId/:className', (req, res) => {
    let {instructorId, className} = req.params;
    User.findOne({_id : instructorId}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        let query = (user.role === 'teacher' ? {instructorId, className} : {students: user.email, className});
        Classroom.findOne(query).then(classroom => {
            if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
            AttendanceRecord.find({classroomId: classroom._id}).then(records => {
                return res.status(200).json({classroom, records});
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


// creates new classroom for instructor
router.post('/create-classroom', (req, res) => {
    let {userId, className} = req.body;
    User.findOne({_id: userId, role: 'teacher'}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find that user!`});
        Classroom.findOne({instructorId: userId, className: className}).then(oldClassroom => {
            if (oldClassroom)  return res.status(200).json({error: "You have already used that classname!"});
            let classroom = new Classroom();
            classroom.instructorId = userId;
            classroom.className = className;
            classroom.code = crypto.randomBytes(5).toString('hex');
            classroom.students = [];
            classroom.save().then(()=>{
                Classroom.find({instructorId: userId}).then(classrooms => {
                    user = editBeforeSend(user, classrooms);
                    return res.status(200).json({user});
                }).catch(err => {
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


// deletes the given classroom
router.post('/delete-classroom', (req, res) => {
    let {userId, className} = req.body;
    User.findOne({_id: userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find that user!`});
        Classroom.findOne({instructorId: userId, className: className}).then(classroom => {
            if (!classroom)  return res.status(200).json({error: "Failed to find that classroom!"});
            AttendanceRecord.deleteMany({classroomId: classroom._id}).then(()=>{
                Classroom.deleteOne({instructorId: userId, className: className}).then(()=>{
                    Classroom.find({instructorId: userId}).then(classrooms => {
                        user = editBeforeSend(user, classrooms);
                        return res.status(200).json({user});
                    }).catch(err => {
                        return res.status(500).json({error: err});
                    });
                }).catch(err => {
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
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
        return res.status(500).json({error: err});
    });
});


// collects the attendance for instructor with given attendanceId
router.post('/collect-attendance', (req, res) => {
    let {classroomId, attendanceId} = req.body;
    Classroom.findOne({_id: classroomId}).then(classroom => {
        if (!classroom) return res.status(200).json({error: `Failed to find your classroom!`});
        if (classroom.collectingFor)    return res.status(200).json({error: `You are alreading collecting attendance for ${classroom.collectingFor}`});
        AttendanceRecord.findOne({classroomId, attendanceId}).then(oldRecord => {
            if (oldRecord) return res.status(200).json({error: `You have already used that attendanceId for this classroom!`});
            let record = new AttendanceRecord();
            record.classroomId = classroomId;
            record.attendanceId = attendanceId;
            record.students = [];
            record.accepting = true;
            record.save().then(() => {
                classroom.collectingFor = attendanceId;
                classroom.save().then(()=>{
                    return res.status(200).json({classroom});
                }).catch(err => {
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


// stops collecting attendance for given classroom with given attendanceId
router.post('/stop-collecting', (req, res) => {
    let {classroomId, attendanceId} = req.body;
    Classroom.findOne({_id: classroomId}).then(classroom => {
        if (!classroom) return res.status(200).json({error: `Failed to find your classroom!`});
        AttendanceRecord.findOne({classroomId, attendanceId}).then(record => {
            if (!record) return res.status(200).json({error: `No such attendanceId found for this classroom!`});
            record.accepting = false;
            record.save().then(() => {
                classroom.collectingFor = null;
                classroom.save().then(()=>{
                    return res.status(200).json({classroom});
                }).catch(err => {
                    return res.status(500).json({error: err});
                });
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});

router.post('/mark-attendance', (req, res) => {
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
                       return res.status(500).json({error: err});
                   });
               }).catch(err => {
                   return res.status(500).json({error: err});
               }); 
            }).catch(err => {
                return res.status(500).json({error: err});
            });
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


// router.get('/attendance-record/:classroomId/', (req, res) => {
//     let {classroomId} = req.params;
//     AttendanceRecord.find({classroomId}).then(records => {
//         if (!record)    return res.status(200).json({error: `Failed to find that record!`});
//         return res.status(200).json({records});
//     }).catch(err => {
//         return res.status(500).json({error: err});
//     });

// });

module.exports = router;