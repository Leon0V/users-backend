const mongoose = require('mongoose');
const URL = 'mongodb://localhost:27017/users-backend';
const db = mongoose.connect(URL);
const con = mongoose.connection;

con.on('open', function () {
    console.log('Connected to database.');
});

con.on('error', function () {
    console.log('Error on connection.');
});

con.on('close', function () {
    console.log('Disconnected.');
});

module.exports = db;