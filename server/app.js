require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cors = require('cors');

// import roters
const indexRouter = require('./routes/index');

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
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// setup express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: mongoose.connection
  }),
  cookie: {maxAge: 180 * 60 * 1000}
}));  
app.use(flash());
app.use(cors());

// define routers
app.use('/', indexRouter);
app.get('/:anything', (req, res) => {
    res.status(404).send();
});


// listen to the client requests
const port = process.env.PORT || 8080;
app.listen(port, process.env.IP, function(){
  console.log('Server listening on port ' + port);
});