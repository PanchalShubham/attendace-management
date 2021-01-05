const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// registers a new-user with given role
router.post('/register', (req, res) => {
    let {username, email, password, role} = req.body;
    User.findOne({email: email, role: role}).then(oldUser => {
        if (oldUser) return res.status(200).json({error: `That email is already registered for ${role} role!`});
        let user = new User();
        user.username = username;
        user.email = email;
        user.role = role;
        user.password = user.encryptPassword(password);
        user.loggedIn = false;
        user.save().then(() => {
            return res.status(200).json({});
        }).catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: err});
    });
});

// logIns the user with given role
router.post('/login', (req, res) => {
    let {email, password, role} = req.body;
    User.findOne({email: email, role: role}).then(user => {
        if (!user)   return res.status(200).json({error: `That email is not registered for ${role} role!`});
        if (!user.isValidPassword(password)) return res.status(200).json({error: `Invalid password!`});
        // if (user.loggedIn)  return res.status(200).json({error: `You are already logged in on another device`});
        user.loggedIn = true;
        user.save().then(()=>{
            user.password = null;
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '12h'});
            return res.status(200).json({userId: user._id, token});    
        }).catch(err => {
            console.log(err);
            return res.status(500).json({error: err});
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: err});
    });
});


// logOuts the user
router.post('/logout', (req, res) => {
    let {userId} = req.body;
    User.findOne({_id: userId}).then(user => {
        if (!user)  return res.status(200).json({error: `Couldn't find your account!`});
        user.loggedIn = false;
        user.save().then(()=>{
            res.clearCookie('token');
            return res.status(200).json({});
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