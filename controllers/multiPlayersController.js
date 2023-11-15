require('dotenv').config();
const OpenAI = require("openai");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('1234567890', 5)

const Question = require("../models/question");
const Room = require("../models/room");

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