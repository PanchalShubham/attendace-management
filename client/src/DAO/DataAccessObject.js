import axios from 'axios';
import CryptoJS from 'crypto-js';
const SERVER_URL = 'http://localhost:8080';
const SECRET='e3483b2f6bc28d1f6c5253b1c8c860cbb7562341e75059c45108afdbe0fa92d0b152dc40ded35908921aa2e954f50830f157090b5a36319edef6901469f1afeb'

// registers the user
export const registerUser = function(user) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/register", {...user})
        .then(response => resolve(response)).catch(err => reject(err));
    });
};

// login the user
export const loginUser = function(user) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/login", {...user})
        .then(response => resolve(response)).catch(err => reject(err));
    });
}

// logout the user
export const logoutUser = function(userId) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/logout", {userId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

export const readUser = function(userId) {
    return new Promise(function(resolve, reject){
        axios.get(SERVER_URL + "/user/" + userId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// fetches the user
export const fetchClassrooms = function(userId, role) {
    return new Promise(function(resolve, reject){
        axios.get(SERVER_URL + "/classrooms/" + role + "/" + userId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// fetches the details of the given classroom
export const readClassroom = function(userId, className) {
    return new Promise(function(resolve, reject){
        axios.get(SERVER_URL + "/classroom/" + userId + "/" + className)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// create classroom
export const createClassroom = function(userId, className) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/create-classroom", {userId, className})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// delete classroom
export const deleteClassroom = function(userId, className) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/delete-classroom", {userId, className})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// join classroom
export const joinClassroom = function(useremail, classCode) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/join-classroom", {useremail, classCode})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// collect attendance
export const collectAttendance = function(classroomId, attendanceId) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/collect-attendance", {classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}
// stops collecting attendance
export const stopCollectingAttendance = function(classroomId, attendanceId) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/stop-collecting", {classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// mark-attendance
export const markAttendance = function(userId, classroomId) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/mark-attendance", {userId, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}


// attendance record
export const attendanceRecord = function(classroomId) {
    return new Promise(function(resolve, reject){
        axios.get(SERVER_URL + "/" + classroomId)
            .then(response => resolve(response)).catch(err => reject(err));
    });
}


export const encrypt = function(jsonObject) {
    return CryptoJS.AES.encrypt(JSON.stringify(jsonObject), SECRET);
}
export const decrypt = function(text) {
    let bytes = CryptoJS.AES.decrypt(text, SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
