const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    tokenValue: {
        type: String
    },
    userId: {
        type: String
    }
}, {
    // created at and updated at are stored
    timestamps: true
});


const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;