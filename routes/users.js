var express = require('express');
var router = express.Router();
var User = require('../mongo-models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');
var multer = require('multer');

// router.get('', function (req, res, next) {
//     res.send('users');
// });

//REGISTER USER
router.post('/register', function (req, res, next) {
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, function (error, user) {
        if (error) {
            res.json({
                success: false,
                message: 'Failed to register user'
            });
        } else {
            res.json({
                success: true,
                message: 'User registered'
            });
        }
        ;
    });
});

// AUTHENTICATE USER
router.post('/authenticate', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function (error, user) {
        if (error) {
            return res.json({
                success: false,
                message: 'Failed to authenticate user'
            });

        } else if (!user) {
            console.log('User not found here');
            return res.json({
                success: false,
                message: 'User not found in database'
            });
        }
        ;

        User.comparePassword(password, user.password, function (error, isMatched) {

            if (error) {
                return res.json({
                    success: false,
                    message: error
                });
            }
            ;

            if (isMatched) {
                const token = jwt.sign({data: user}, config.secret, {expiresIn: 86400});
                return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Wrong password'
                });
            }
            ;
        });
    });
});

// PROFILE USER
router.get('/profile', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    res.json({user: req.user});
});

// TEST UPLOAD
router.post('/upload', function (req, res) {

    // SET STORAGE AND NAME
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../upload/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });


    // SET VALUES FROM THE FORM
    var upload = multer({ storage: storage }).fields([
        {
            name: req.body.name,            //  <input type="text" [(ngModel)]="name" name="name"/>
            maxCount: 1
        },
        {
            image: req.body.myFile,         // <input type="file" [(ngModel)]="myFile" name="myFile" (change)="fileChange($event)"/>
            maxCount: 1
        }]);



    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return res.json({
                message: 'Error uploading',
                error: err
            });
        } else {
            res.json({
                message: 'img uploaded',            // logged to dev Tools Opera console
                image: req.body.myFile,             // NOT logged to dev Tools Opera console
                name: req.body.name                 // logged to dev Tools Opera console
            });

            // momentan log-urile returneaza asa:
            console.log(req.files);                 // undefined
            console.log(req.body);                  // { name: 'correct input', imageData: {} }
            console.log(req.body.name);             // correct input
            console.log(req.body.imageData);        // {}
            console.log(req.body.myFile);           // undefined
        }
    });
});

module.exports = router;