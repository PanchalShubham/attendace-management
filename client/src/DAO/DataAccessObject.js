import axios from 'axios';
import CryptoJS from 'crypto-js';
// const SERVER_URL = 'http://localhost:8080';
const SECRET='e3483b2f6bc28d1f6c5253b1c8c860cbb7562341e75059c45108afdbe0fa92d0b152dc40ded35908921aa2e954f50830f157090b5a36319edef6901469f1afeb'
axios.defaults.baseURL = 'http://localhost:8080';

// registers the user
export const registerUser = function(user) {
    return new Promise(function(resolve, reject){
        axios.post("/register", {...user})
        .then(response => resolve(response)).catch(err => reject(err));
    });
};

// login the user
export const loginUser = function(user) {
    return new Promise(function(resolve, reject){
        axios.post("/login", {...user})
        .then(response => resolve(response)).catch(err => reject(err));
    });
}

// logout the user
export const logoutUser = function(userId) {
    return new Promise(function(resolve, reject){
        axios.post("/logout", {userId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// forgot password
export const forgotPassword = function(email, role) {
    return new Promise(function(resolve, reject){
        axios.post("/forgot-password", {email, role})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// reset password
export const resetPassword = function(tokenId, password) {
    return new Promise(function(resolve, reject){
        axios.post("/reset-password", {tokenId, password})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// reads the details of the user with given Id
export const readUser = function(userId) {
    return new Promise(function(resolve, reject){
        axios.get("/user/" + userId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// fetches the details of the given classroom
export const readClassroom = function(classroomId) {
    return new Promise(function(resolve, reject){
        axios.get("/classroom/" + classroomId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// create classroom
export const createClassroom = function(userId, className) {
    return new Promise(function(resolve, reject){
        axios.post("/create-classroom", {userId, className})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// delete classroom
export const deleteClassroom = function(classroomId) {
    return new Promise(function(resolve, reject){
        axios.post("/delete-classroom", {classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// join classroom
export const joinClassroom = function(useremail, classCode) {
    return new Promise(function(resolve, reject){
        axios.post("/join-classroom", {useremail, classCode})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// leave classroom
export const leaveClassroom = function(userEmail, classroomId) {
    return new Promise(function(resolve, reject){
        axios.post("/leave-classroom", {userEmail, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// collect attendance
export const collectAttendance = function(classroomId, attendanceId) {
    return new Promise(function(resolve, reject){
        axios.post("/collect-attendance", {classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}
// stops collecting attendance
export const stopCollectingAttendance = function(classroomId, attendanceId) {
    return new Promise(function(resolve, reject){
        axios.post("/stop-collecting", {classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// mark-attendance
export const markAttendance = function(userId, classroomId) {
    return new Promise(function(resolve, reject){
        axios.post("/mark-attendance", {userId, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}


// attendance record
export const attendanceRecord = function(classroomId) {
    return new Promise(function(resolve, reject){
        axios.get("/" + classroomId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}


// encrypts the given jsonObject
export const encrypt = function(jsonObject) {
    return CryptoJS.AES.encrypt(JSON.stringify(jsonObject), SECRET);
}
// decrypt and parses the given cipherText
export const decrypt = function(cipherText) {
    let bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
