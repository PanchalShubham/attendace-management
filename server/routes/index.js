const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Classroom = require('../models/Classroom');


// authenticating middle-ware
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        req.flash('error', "You must be logged in to perform that operation!");
        res.redirect('/');
    } else {
        next( );
    }
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
            return res.status(200).json({error: err});
        });
    }).catch(err => {
        return res.status(200).json({error: err});
    });
});

router.post('/login', (req, res) => {
    let {email, password, role} = req.body;
    User.findOne({email: email, role: role}).then(user => {
        if (!user)   return res.status(200).json({error: `That email is not registered for ${role} role!`});
        if (!user.isValidPassword(password)) return res.status(200).json({error: `Invalid password!`});
        user.password = null;
        req.session.user = user;
        return res.status(200).json({user});
    }).catch(err => {
        return res.status(200).json({error: err});
    });
});

router.post('/logout', (req, res) => {
    req.session.user = null;
    return res.status(200).json({});
});



router.get('/user', (req, res) => {

});



module.exports = router;