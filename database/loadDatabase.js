require("./databaseConnection");
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
const users = require('./users.json');

async function loadUsers() {
    try {
        await userModel.deleteMany({});
        for (const user of users) {
            await userModel.create(user);
        }
        console.log('Users data loaded!');
    } catch (err) {
        console.log(err);
    } finally {
        process.exit();
    }
}

loadUsers();