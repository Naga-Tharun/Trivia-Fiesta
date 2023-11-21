const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const multiPlayerScoreSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    scores: [{
        userId: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
            default: 0,
        },
    }],
    winner: {
        type: ObjectId,
        ref: 'User',
    },
    
}, {
    // created at and updated at are stored
    timestamps: true
});


const MultiPlayerScore = mongoose.model('MultiPlayerScore', multiPlayerScoreSchema);

module.exports = MultiPlayerScore;