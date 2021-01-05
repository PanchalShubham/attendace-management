require('dotenv').config();
const jwt = require('jsonwebtoken');
// checks if user is autenticated
function isAuthenticated(req, res, next) {
    let {token, userId} = req.body;
    if (!token)    return res.status(200).json({error: `Oops, you need an authnetication token to continue!`});
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
        if (err)    return res.status(500).json({error: err});
        let tokenUserId = decoded.userId;
        if (userId != tokenUserId)  return res.status(200).json({error: `Failed to verify your token!`});
        next( );
    });
}
module.exports = isAuthenticated;