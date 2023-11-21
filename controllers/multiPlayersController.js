require('dotenv').config();
const OpenAI = require("openai");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('1234567890', 5)

const Question = require("../models/question");
const Room = require("../models/room");
const User = require("../models/user");
const MultiPlayerScore = require("../models/multiPlayerScore");

const { io } = require('../index'); // Import `io` from `index.js`

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

// add questions to the database
function addQuestions(questionData) {
	try {
		const questionObject = JSON.parse(questionData);
	
		for(const i of questionObject) {
			const question = new Question(i);
		
			question.save()
				.catch(error => {
					console.error('Error saving question:', error);
				});
		}
	} catch(error) {
	console.error('Error parsing JSON:', error);
	}
}

// select random questions from the database
function selectRandomQuestions(questions, num, categories) {
	const filteredQuestions = questions.filter((question) => categories.includes(question.category));
    const shuffledQuestions = filteredQuestions.sort(() => 0.5 - Math.random());
	const selectedQuestions = shuffledQuestions.slice(0, num);

	const formattedQuestions = selectedQuestions.map((question) => ({
		category: question.category,
		question: question.question,
		options: question.options,
		correct_answer: question.correct_answer,
	  }));

	console.log(formattedQuestions);
    return formattedQuestions;
};

const roomsParticipantsSockets = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Send a message to the connected client
    socket.emit('message', 'Welcome to the server!');

    socket.on('joinRoom', ({ userId, roomId }) => {
        // Create a unique key for the participant's room and user
        console.log("joined room");
        const participantKey = `${roomId}-${userId}`;
        
        if (!roomsParticipantsSockets[roomId]) {
            roomsParticipantsSockets[roomId] = {};
        }
            
        // Store the socket associated with the participant for the specific room
        roomsParticipantsSockets[roomId][participantKey] = socket.id;
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Find and remove the socket from the 'roomsParticipantsSockets' object
        // based on the room and participant key
        const roomId = Object.keys(roomsParticipantsSockets).find(roomId => {
        const participantKey = Object.keys(roomsParticipantsSockets[roomId]).find(
            key => roomsParticipantsSockets[roomId][key] === socket.id
        );
        if (participantKey) {
            delete roomsParticipantsSockets[roomId][participantKey];
            return true;
        }
        return false;
        });

        if (roomId && Object.keys(roomsParticipantsSockets[roomId]).length === 0) {
        delete roomsParticipantsSockets[roomId];
        }
    });
    
  
    socket.on('startGame', async ({ userId, roomId, numQuestions }) => {
        console.log('game stated');
        try {
            let roomExists = await Room.exists({ roomId });
            if (!roomExists) {
                return socket.emit('gameError', { error: 'Room does not exist' });
            }

            let room = await Room.findOne({ roomId: roomId }).populate('participants', '_id');
            const allPlayersReady = room.playersReadyList.length >= room.participants.length;
            
            if (!allPlayersReady) {
                return socket.emit('gameError', { error: 'Not all players are ready' });
            }

            let user = await User.findById(userId);
            if (!user) {
                return socket.emit('gameError', { error: 'User not found' });
            }
            const isUserCreator = room.creatorId.equals(user._id);
            if (!isUserCreator) {
                return socket.emit('gameError', { error: 'User is not the room creator' });
            }

            // Create a new MultiPlayerScore record
            const participants = room.participants;
            const scores = [];

            for (const participant of participants) {
                scores.push({
                    userId: participant._id,
                    score: 0,
                });
            }

            const newMultiPlayerScore = new MultiPlayerScore({
                roomId: roomId,
                scores: scores,
            });

            // Save the new MultiPlayerScore document to the database
            await newMultiPlayerScore.save();

            // Get socket IDs of participants in the room
            const socketsInRoom = roomsParticipantsSockets[roomId] ? Object.values(roomsParticipantsSockets[roomId]) : [];

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_APIKEY
            });
        
            let categories = room.categories;
            let categoriesString = categories.join(", ");
        
            // check if questions of mentioned category are in database
            try {
                const questionsFromDatabase = await Question.find({ category: { $in: categories } });
        
                var categoriesExist = true;
        
                for(const i in categories) {
                    const qnFromDb = await Question.find({category: i});
                    if(qnFromDb.length == 0) {
                        categoriesExist = false;
                    }
                }
        
                if (questionsFromDatabase.length < numQuestions || categoriesExist == false) {
                    const question = "Generate a total of " + numQuestions + " mcqs based on the following categories: " + categoriesString + ' and provide the correct answer for each mcq, represent the mcqs in the following json format [{"category": "value", "question": "question 1", "options": ["option 1", "option 2", "option 3", "option 4"], "correct_answer": "answer"}]. ';
        
                    const completion = await openai.chat.completions.create({
                        messages: [
                        { 
                            role: 'user',
                            content: question
                        }
                        ],
                        model: 'gpt-3.5-turbo',
                    });
        
                    const questionsData = completion.choices[0].message.content;
                    addQuestions(questionsData);
        
                    const generatedQuestions = JSON.parse(questionsData);
                    const shuffledQuestions = generatedQuestions.sort(() => 0.5 - Math.random());

                    if (socketsInRoom.length > 0) {
                        // Emit 'gameQuestions' event only to participants in the room
                        socketsInRoom.forEach((participantSocket) => {
                            io.to(participantSocket).emit('gameQuestions', shuffledQuestions);
                        });
                    } else {
                        console.log('No participants found in the room');
                    }
                } 
                else {
                    const selectedQuestions = await selectRandomQuestions(questionsFromDatabase, numQuestions, categories);

                    if (socketsInRoom.length > 0) {
                        // Emit 'gameQuestions' event only to participants in the room
                        socketsInRoom.forEach(participantSocket => {
                            io.to(participantSocket).emit('gameQuestions', selectedQuestions);
                        });
                    } else {
                        console.log('No participants found in the room');
                    }
                }
            } catch (error) {
                console.error('Error checking the database:', error);
                return socket.emit('gameError', { error: 'Error starting the game' });
            }
        } catch (error) {
            console.error('Error:', error);
            return socket.emit('gameError', { error: 'Error starting the game' });
        }
    });
});

// update scores of a player of respective room 
module.exports.updateScore = async function(req, res){
    const { roomId, userId, score } = req.body;

    if (!roomId || !userId || !score) {
        return res.status(400).send({ 
            message: false
        });
    }

    try {
        const multiPlayerScore = await MultiPlayerScore.findOne({ roomId });

        if (!multiPlayerScore) {
            return res.status(404).send({ 
                message: false 
            });
        }

        const userScoreIndex = multiPlayerScore.scores.findIndex((scoreObj) => scoreObj.userId.toString() === userId);

        if (userScoreIndex === -1) {
            multiPlayerScore.scores.push({
                userId,
                score,
            });
        } else {
            multiPlayerScore.scores[userScoreIndex].score = score;
        }

        await multiPlayerScore.save();

        return res.status(200).send({ 
            message: true 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            message: false 
        });
    }
}

// calculate the winner and return final scores of the room
module.exports.finalResult = async function(req, res){
    const { roomId } = req.body;
    if (!roomId) {
        return res.status(400).send({ 
            message: false
        });
    }

    try {
        const multiPlayerScore = await MultiPlayerScore.findOne({ roomId });
        multiPlayerScore.populate('scores.userId', 'username');

        if (!multiPlayerScore) {
            return res.status(404).send({ 
                message: false 
            });
        }

        let highestScore = 0;
        let winnerId = null;

        for (const scoreObject of multiPlayerScore.scores) {
            if (scoreObject.score > highestScore) {
                highestScore = scoreObject.score;
                winnerId = scoreObject.userId;
            }
        }

        multiPlayerScore.winner = winnerId;
        await multiPlayerScore.save();

        multiPlayerScore.scores.sort((a, b) => b.score - a.score);

        const winnerScoreObject = multiPlayerScore.scores[0];
        const winnerUsername = winnerScoreObject.userId.username;
        const winnerScore = winnerScoreObject.score;
        
        const simplifiedScores = await multiPlayerScore.scores.map((scoreObject) => ({
            username: scoreObject.userId.username,
            score: scoreObject.score,
        }));

        res.status(200).send({
            message: true,
            roomId: multiPlayerScore.roomId,
            scores: simplifiedScores,
            winner: {
                username: winnerUsername,
                score: winnerScore,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            message: false 
        });
    }
}