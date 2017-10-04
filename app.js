const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const users = require('./routes/users');

const app = express();

//connect to MLab
mongoose.connect(config.database, {useMongoClient: true});
// on connection
mongoose.connection.on('connected', function () {
    console.log('Connected to database : ' + config.database);
});

// on error
mongoose.connection.on('error', function (error) {
    console.log('Database error: ' + error);
});

// CORS middleware
app.use(cors());

// Set STATIC folder
app.use(express.static(path.join(__dirname, 'public')));

// Bodyparser
app.use(bodyParser.json());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Index route
// app.get('/', function (req, res, next) {
//     res.send('Home of node');
// });

//redirect all routes to angular
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Server started on port ' + port);
});