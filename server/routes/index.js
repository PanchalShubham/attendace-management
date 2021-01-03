const express = require('express');
const router = express.Router();
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


// base-route
router.get('/', (req, res) => {
    res.status(200).send("Welcome to attendance-management system server!");
});


// fetches the user with given id
router.get('/user/:userId', (req, res) => {
    let {userId} = req.params;
    User.findOne({_id: userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        let query = (user.role === 'teacher' ? {instructorId: userId} : {students: user.email});
        Classroom.find(query).then(classrooms => {
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
});


// fetch the details of given classroom
router.get('/classroom/:userId/:className', (req, res) => {
    let {userId, className} = req.params;
    User.findOne({_id : userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Failed to find your account!`});
        let query = (user.role === 'teacher' ? {instructorId: userId, className} : {students: user.email, className});
        Classroom.findOne(query).then(classroom => {
            if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
            AttendanceRecord.find({classroomId: classroom._id}).then(records => {
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
});


// export the router
module.exports = router;