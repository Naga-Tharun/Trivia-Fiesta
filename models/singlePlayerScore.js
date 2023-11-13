const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const SinglePlayerScoreSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
    }, 
    username: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    // created at and updated at are stored
    timestamps: true
});


const SinglePlayerScore = mongoose.model('SinglePlayerScore', SinglePlayerScoreSchema);

module.exports = SinglePlayerScore;