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
export const logoutUser = function() {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/logout")
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

// create classroom
export const createClassroom = function(userId, className) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/create-classroom", {userId, className})
            .then(response => resolve(response)).catch(err => reject(err));
    });
}

// join classroom
export const joinClassroom = function(userId, classCode) {
    return new Promise(function(resolve, reject){
        axios.post(SERVER_URL + "/join-classroom", {userId, classCode})
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
