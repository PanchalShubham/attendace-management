import axios from 'axios';
import CryptoJS from 'crypto-js';
const SECRET='e3483b2f6bc28d1f6c5253b1c8c860cbb7562341e75059c45108afdbe0fa92d0b152dc40ded35908921aa2e954f50830f157090b5a36319edef6901469f1afeb'
axios.defaults.baseURL = 'https://attendance-management-server.herokuapp.com';
// axios.defaults.baseURL = 'http://localhost:8080';



// encrypts the given jsonObject
export const encrypt = function(jsonObject) {
    return CryptoJS.AES.encrypt(JSON.stringify(jsonObject), SECRET);
}
// decrypt and parses the given cipherText
export const decrypt = function(cipherText) {
    let bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// registers the user
export const registerUser = function(user) {
    return new Promise(function(resolve, reject){
        axios.post("/register", {...user})
        .then(response => resolve(response)).catch(err => reject(err));
    });
};

// gets the token
function getToken() {
    let item = localStorage.getItem('data');
    if (!item)  return null;
    let object = decrypt(item);
    let {token} = object;
    return token;
}

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
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/user/" + userId, {userId, token})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// fetches the details of the given classroom
export const readClassroom = function(userId, classroomId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/classroom/" + classroomId, {userId, token})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// create classroom
export const createClassroom = function(userId, className) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/create-classroom", {userId, token, className})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// delete classroom
export const deleteClassroom = function(userId, classroomId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/delete-classroom", {userId, token, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// join classroom
export const joinClassroom = function(userId, classCode) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/join-classroom", {userId, token, classCode})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// leave classroom
export const leaveClassroom = function(userId, classroomId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/leave-classroom", {userId, token, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// collect attendance
export const collectAttendance = function(userId, classroomId, attendanceId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/collect-attendance", {userId, token, classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// stops collecting attendance
export const stopCollectingAttendance = function(userId, classroomId, attendanceId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/stop-collecting", {userId, token, classroomId, attendanceId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// mark-attendance
export const markAttendance = function(userId, classroomId) {
    let token = getToken();
    return new Promise(function(resolve, reject){
        axios.post("/mark-attendance", {userId, token, classroomId})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}
