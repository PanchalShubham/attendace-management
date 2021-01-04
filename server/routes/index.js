require('dotenv').config();
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const AttendanceRecord = require('../models/AttendanceRecord');
const Token = require('../models/Token');

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

// sends an email to the user
function sendEmail(receiver, subject, text, html){
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service : "Gmail",
            auth: {
              user: process.env.ADMIN_EMAIL, 
              pass: process.env.ADMIN_PASSWORD
            }
        });
        transporter.sendMail({
            from: process.env.ADMIN_EMAIL, 
            to: receiver,
            subject: subject,
            text: text,
            html: html      
        }).then(response => resolve(response)).catch(err => reject(err));    
    });
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
router.get('/classroom/:classroomId', (req, res) => {
    let {classroomId} = req.params;
    Classroom.findOne({_id: classroomId}).then(classroom => {
        if (!classroom) return res.status(200).json({error: `Failed to find that classroom!`});
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
});



// forgot password
router.post('/forgot-password', (req, res) => {
    let {email, role} = req.body;
    let host = req.headers.origin;
    User.findOne({email, role}).then(user => {
        if (!user)  return res.status(200).json({error: `That email is not registered for ${role} role!`});
        Token.deleteMany({userId: user._id}).then(()=>{
            // create a new link for the user
            let tokenId = crypto.randomBytes(32).toString('hex');
            let token = new Token({tokenId, userId: user._id});
            token.save().then(()=>{
                let link = `${host}/reset-password/${tokenId}`;
                let html = 
                    `<p>
                        Greetings from Attendance-Management Team! <br>
                        You are recieving this email because you request to reset your password on attendance-management-system. <br>
                        You can click on <a href='${link}'>${link}</a> to reset your password. <br>
                        The link will be active for next 30 minutes. <br>
                        Please do not share this link with anyone. <br>
                        This is an auto-generated email, please do not reply to this email. <br>
                        Regards, <br>
                        Attendance-Management Team <br>                    
                    </p>`;
                sendEmail(email, 'Reset Password | Attendance Management', '', html).then(()=>{
                    return res.status(200).json({});
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
        console.log(err);
        return res.status(500).json({error: err});
    });
});

// reset password
router.post('/reset-password', (req, res) => {
    let {tokenId, password} = req.body;
    Token.findOne({tokenId}).then(token => {
        if (!token) return res.status(200).json({error: `Your token has expired!`});
        User.findOne({_id: token.userId}).then(user => {
            if (!user)  return res.status(200).json({error: `Failed to find a matching user for this token!`});
            user.password = user.encryptPassword(password);
            user.save().then(()=>{
                Token.deleteMany({tokenId}).then(()=>{
                    return res.status(200).json({});
                }).catch(err => {
                    console.log(err);
                    return res.status(200).json({});
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