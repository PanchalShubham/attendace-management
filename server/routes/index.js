const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const Classroom = require('../models/Classroom');


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
        user.password = null;
        return res.status(200).json({user});
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});

router.post('/logout', (req, res) => {
    req.session.user = null;
    return res.status(200).json({});
});


// fetches the list of classrooms based on role!
router.get('/classrooms/:role/:userId', (req, res) => {
    let {userId, role} = req.params; 
    let query = (role === 'teacher' ? {instructorId : userId} : {students: userId});
    Classroom.find(query).then(classrooms => {
        return res.status(200).json({classrooms});
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


// creates new classroom for instructor
router.post('/create-classroom', (req, res) => {
    let {userId, className} = req.body;
    Classroom.findOne({instructorId: userId, className: className}).then(oldClassroom => {
        if (oldClassroom)  return res.status(200).json({error: "You have already used that classname!"});
        let classroom = new Classroom();
        classroom.instructorId = userId;
        classroom.className = className;
        classroom.code = crypto.randomBytes(5).toString('hex');
        classroom.students = [];
        classroom.data = "[]";
        classroom.save().then(()=>{
            return res.status(200).json({classroom});
        }).catch(err => {
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        return res.status(500).json({error: err});
    });
});


module.exports = router;