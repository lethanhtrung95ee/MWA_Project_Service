const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: String,
    role: String,
    phoneNumber: Number,
    password: String,
    fullName: String,
    email: String,
    dateOfBirth: Date
}, { versionKey: false });

module.exports = mongoose.model('accounts', AccountSchema);