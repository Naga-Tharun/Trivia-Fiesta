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
        const parsedCateogires = categories.split(', ');

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
            categories: parsedCateogires,
            playersReadyList: []
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
            categories: room.categories,
            roomId: roomId
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

// Update categories for room
module.exports.updateCategories = async function(req, res) {
    try {
		
        const { roomId, chosenCategories} = req.body;

        let room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        const parsedCategories = chosenCategories.split(', ');

        // Merge new categories with the existing list without duplicates
        room.categories = [...new Set([...room.categories, ...parsedCategories])];
        await room.save();

        return res.status(200).json({ 
            categories: room.categories
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

// delete categories for room
module.exports.removeCategories = async function(req, res) {
    try {
		
        const { roomId, chosenCategories} = req.body;

        let room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        const parsedCategories = chosenCategories.split(', ');

        room.categories = room.categories.filter(category => !parsedCategories.includes(category));
        await room.save();

        return res.status(200).json({ 
            categories: room.categories
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

// Participant to leave room
module.exports.leaveRoom = async function(req, res) {
    try {
		const { userId, roomId } = req.body;
        
        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId }).populate({
            path: 'participants',
            select: '_id username name email'
        }).populate({
            path: 'playersReadyList',
            select: '_id username name email'
        });

        let user = await User.findById(userId);

        if (!room || !user) {
            return res.status(404).json({ message: false });
        }

        const isUserCreator = room.creatorId.equals(user._id);

        // Check if the user is already in the room
        const isUserInRoom = room.participants.some(participant => participant._id.equals(user._id));

        if (!isUserInRoom) {
            return res.status(400).json({ message: false });
        }

        room.participants = room.participants.filter(participant => !participant._id.equals(user._id));
        room.playersReadyList = room.playersReadyList.filter(player => !player._id.equals(user._id));
        await room.save();

        if (isUserCreator && room.participants.length === 0) {
            await Room.deleteOne({ roomId: roomId });
            return res.status(200).json({ 
                message: true 
            });
        }

        room = await Room.findOne({ roomId: roomId }).populate({
            path: 'participants',
            select: '_id username name email'
        });

        return res.status(200).json({
            message: true,
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

// Player to notify he/she is ready
module.exports.playerReadyStatus = async function(req, res) {
    try {
		const { userId, roomId, isReady } = req.body;
        
        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId }).populate({
            path: 'participants',
            select: '_id username name email'
        }).populate({
            path: 'playersReadyList',
            select: '_id username name email'
        });

        let user = await User.findById(userId);

        if (!room || !user) {
            return res.status(404).json({ message: false });
        }

        // Check if the user is already in the room
        const isUserInRoom = room.participants.some(participant => participant._id.equals(user._id));

        if (!isUserInRoom) {
            return res.status(400).json({ message: false });
        }

        // Initialize playersReadyList if it's undefined
        if (!Array.isArray(room.playersReadyList)) {
            room.playersReadyList = [];
        }

        // Update readiness
        if (JSON.parse(isReady)) {
            const isPLayerReady = room.playersReadyList.some(player => player._id.equals(user._id));
            if (!isPLayerReady) {
                room.playersReadyList.push(user._id);
            }
        } else {
            room.playersReadyList = room.playersReadyList.filter(player => !player._id.equals(user._id));
        }
        await room.save();

        const allPlayersReady = room.playersReadyList.length >= room.participants.length;

        let readyPlayersUsernames = [];
        readyPlayersUsernames = await User.find({ _id: { $in: room.playersReadyList } }).distinct('username');


        return res.status(200).json({
            message: true,
            allPlayersReady: allPlayersReady,
            playersReadyList: readyPlayersUsernames
        });
	} catch (error) {
		console.error('Error:', error);
		
		return res.status(500).send({
            message: false
        });
	}
}

