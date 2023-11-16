require('dotenv').config();
const OpenAI = require("openai");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('1234567890', 5)

const Question = require("../models/question");
const Room = require("../models/room");
const User = require("../models/user");

// Create a room and provide roomId
module.exports.createRoom = async function(req, res) {
	try {
		const { userId, categories } = req.body;

        const roomId = nanoid(5);
        
        let roomExists = await Room.exists({ roomId });

        // Generate a new roomId until it's unique
        while (roomExists) {
            roomId = nanoid(5);
            roomExists = await Room.exists({ roomId });
        }

        // Create the room with provided details
        const newRoom = await Room.create({
            roomId: roomId,
            creatorId: userId,
            participants: [userId],
            categories,
        });

        // Exclude specific fields from the newRoom object before sending the response
        const { createdAt, updatedAt, __v, ...roomData } = newRoom.toObject();
  
        res.status(201).json(roomData);
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

// Participant to join a room
module.exports.joinRoom = async function(req, res) {
    try {
		const { userId, roomId } = req.body;
        
        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId }).populate({
            path: 'participants',
            select: '_id username name email'
        });

        let user = await User.findById(userId);

        if (!room || !user) {
            return res.status(404).json({ message: false });
        }

        // Check if the user is already in the room
        const isUserInRoom = room.participants.some(participant => participant._id.equals(user._id));

        if (isUserInRoom) {
            return res.status(400).json({ message: false });
        }

        room.participants.push(user._id);
        await room.save();

        room = await Room.findOne({ roomId: roomId }).populate({
            path: 'participants',
            select: '_id username name email'
        });

        return res.status(200).json({
            message: true,
            participants: room.participants,
            roomId: roomId
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}