// import required modules
const mongoose = require('mongoose');

// define the token-schema
const tokenSchema = new mongoose.Schema({
    tokenId: {type: String},
    userId: {type: String},
    createdAt: { type: Date, expires: '30m', default: Date.now }
});

// export the user-schema
module.exports = mongoose.model('Token', tokenSchema);