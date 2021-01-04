// imports
require('dotenv').config();
const Problem = require('./models/Problem');
const process = require('process');
const mongoose = require('mongoose');


process.stdout.write('connecting with cloud db...');
// mongodb connection
// establish connection with db
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(onconnection).catch(function(err){
    console.log(err);
    console.log('Failed to connect with cloud db!');
});

// callback for successful connection with DB!
function onconnection() {
    console.log('connected!');
    process.stdout.write('reading documents...');
    Problem.find({}).then(writetolocaldb).catch(err => {
        console.log(err);
        console.log("Failed to read records from cloud db!");
    });
}

// write to local db
function writetolocaldb(problems) {
    console.log('read ' + problems.length + " document(s)");
    process.stdout.write('disconnecting from cloud db....');
    mongoose.disconnect().then(()=>{
        console.log('disconnected!');
        process.stdout.write('connecting to local db....');
        // establish a connection with localdb
        mongoose.connect(process.env.LOCAL_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(function(){
            console.log('connected!');
            process.stdout.write('deleting old documents....');
            Problem.deleteMany({}).then(function(){
                console.log('deleted!');
                process.stdout.write('writing new documents....');
                Problem.insertMany(problems).then(()=>{
                    console.log("done!");
                    console.log('local db synced successfully!');
                    process.exit(0);
                }).catch(err => {
                    console.log(err);
                    console.log("Failed to insert documents into local db!");
                });
            }).catch(err => {
                console.log(err);
                console.log("Failed to delete from local db!");
            });
        }).catch(function(err){
            console.log(err);
            console.log('Failed to connect with local db!');
        });
    }).catch(err => {
        console.log(err);
        console.log("Failed to disconnect from could db!");
    });
}