require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');

// import routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const addDeleteClassroomRouter = require('./routes/add_delete_classroom');
const attendanceRouter = require('./routes/attendance');

// mongodb connection
// establish connection with db
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(function(){
  console.log("connected with DB!");
}).catch(function(err){
  console.log(err);
  console.log('Failed to connect with DB!');
});

// configurations
const app = express();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// setup express-session
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   store: new MongoStore({
//       mongooseConnection: mongoose.connection
//   }),
//   cookie: {maxAge: 180 * 60 * 1000}
// }));  


// define routers
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', addDeleteClassroomRouter);
app.use('/', attendanceRouter);
// anything other than that is 404
app.get('/:anything', (req, res) => {
    res.status(404).send();
});


// listen to the client requests
const port = process.env.PORT || 8080;
app.listen(port, process.env.IP, function(){
  console.log('Server listening on port ' + port);
});