const mongoUser = 'adi';
const mongoUserPass = '123';

module.exports = {
    database: 'mongodb://' + mongoUser + ':' + mongoUserPass + '@ds157964.mlab.com:57964/angular-test',
    secret: 'secret'
};