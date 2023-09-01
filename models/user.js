const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    profileUrl: {
        type: String,
        required: false
    }
}, {
    // created at and updated at are stored
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;