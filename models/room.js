const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const roomSchema = mongoose.Schema({
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
    participants: [{
        type: ObjectId,
        ref: 'User', 
    }],
    categories: {
        type: [String],
        required: true,
    },
    
}, {
    // created at and updated at are stored
    timestamps: true
});


const Room = mongoose.model('Room', roomSchema);

module.exports = Room;