const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    surname: String,
    birthdate: Date,
    cellphone: String,
    address: String,
    city: String,
    state: String,
    active: Boolean,
    isDeleted: Boolean
});

module.exports = mongoose.model('User', userSchema);
