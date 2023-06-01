const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    code: Number,
    name: String,
    surname: String,
    birthdate: Date,
    cellphone: String,
    address: String,
    city: String,
    state: String,
    active: Boolean,
    isDeleted: Boolean,
    profImg: String
});

module.exports = mongoose.model('User', userSchema);
