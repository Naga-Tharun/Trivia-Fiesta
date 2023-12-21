const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const teamPlayerRoomSchema = mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        required: true,
    },
    creatorId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    team1: {
        leader: {
            type: ObjectId,
            ref: 'User',
        },
        players: [{
            type: ObjectId,
            ref: 'User',
        }],
        score: {
            type: Number,
            default: 0,
        },
    },
    team2: {
        leader: {
            type: ObjectId,
            ref: 'User',
        },
        players: [{
            type: ObjectId,
            ref: 'User',
        }],
        score: {
            type: Number,
            default: 0,
        },
    },
    categories: [{
        type: String,
    }],
    availableCategories: [{
        type: String,
    }],
    currentCategory: {
        type: String,
    },
    isGameStarted: {
        type: Boolean,
        default: false,
    },
    currentTurn: {
        type: String, // 'team1' or 'team2'
        default: 'team1', // default to team1's turn
    },
}, {
    timestamps: true
});

const TeamPlayerRoom = mongoose.model('TeamPlayerRoom', teamPlayerRoomSchema);

module.exports = TeamPlayerRoom;
