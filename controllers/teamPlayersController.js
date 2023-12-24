require('dotenv').config();
const OpenAI = require("openai");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('1234567890', 5)

const Question = require("../models/question");
const Room = require("../models/teamPlayerRoom");
const User = require("../models/user");

const { io } = require('../index'); // Import `io` from `index.js`

// Create a room and provide roomId
module.exports.createRoom = async function(req, res) {
	try {
		const { userId } = req.body;

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
            team1: {
                leader: userId, // Set the creator as the leader of Team 1
                players: [userId], // Add the creator to Team 1 players
            },
            team2: {
                leader: null,
                players: [],
            },
            categories: null,
            availableCategories: null,
            currentCategory: null,
            isGameStarted: false,
            currentTurn: 'team1',
        });


        // exclude specific fields from the newRoom object before sending the response
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
		const { userId, roomId, teamChoice } = req.body;
        
        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId });

        let user = await User.findById(userId);

        if (!room || !user) {
            return res.status(404).json({ message: false });
        }
        if (room.isGameStarted) {
            return res.status(404).json({ message: false });
        }

        // Check if the user is already in the room
        const isInTeam = (team, userId) => team.players.some(player => player.equals(userId));
        let isUserInTeam1 = isInTeam(room.team1, user._id);
        let isUserInTeam2 = isInTeam(room.team2, user._id);

        if (isUserInTeam1 || isUserInTeam2) {
            return res.status(400).json({ message: false });
        }

        if (teamChoice !== 'team1' && teamChoice !== 'team2') {
            return res.status(400).json({ message: false });
        }

        if (teamChoice === 'team1') {
            room.team1.players.push(user._id);
        } else {
            room.team2.players.push(user._id);
            if (!room.team2.leader) {
                room.team2.leader = user._id;
            }
        }

        await room.save();

        room = await Room.findOne({ roomId: roomId }).populate({
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        return res.status(200).json({
            message: true,
            team1: room.team1.players,
            team2: room.team2.players,
            categories: room.categories,
            availableCategories: room.availableCategories,
            isGameStarted: room.isGameStarted,
            currentTurn: room.currentTurn,
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
		
        const { roomId, chosenCategories } = req.body;

        let room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        const parsedCategories = chosenCategories.split(', ');

        if (!room.categories) {
            room.categories = [];
        }

        // Merge new categories with the existing list without duplicates
        room.categories = [...new Set([...room.categories, ...parsedCategories])];
        room.availableCategories = room.categories;
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
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        let user = await User.findById(userId);

        if (!room || !user) {
            return res.status(404).json({ message: false });
        }

        const isUserCreator = room.creatorId.equals(user._id);

        // Check if the user is already in the room
        const isInTeam = (team, userId) => team.players.some(player => player.equals(userId));
        let isUserInTeam1 = isInTeam(room.team1, user._id);
        let isUserInTeam2 = isInTeam(room.team2, user._id);

        if (!isUserInTeam1 && !isUserInTeam2) {
            return res.status(400).json({ message: false });
        }

        if(isUserInTeam1) {
            const isUserLeader = room.team1.leader.equals(user._id);
            room.team1.players = room.team1.players.filter(player => !player._id.equals(user._id));

            if(isUserCreator) {
                if(room.team1.players.length === 0) {
                    await Room.deleteOne({ roomId: roomId });

                    return res.status(200).json({ 
                        message: true 
                    });
                }

                const firstPlayerId = room.team1.players[0];
                room.creatorId = firstPlayerId;
                room.team1.leader = firstPlayerId;
            }
        } else {
            const isUserLeader = room.team2.leader.equals(user._id);
            room.team2.players = room.team2.players.filter(player => !player._id.equals(user._id));

            if(isUserLeader) {
                const firstPlayerId = room.team2.players[0];

                if(room.team2.players.length !== 0) {
                    room.team2.leader = firstPlayerId;
                } else{
                    room.team2.leader = null;
                }
            }
        }

        await room.save();

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
        id: question._id,
		category: question.category,
		question: question.question,
		options: question.options,
		correct_answer: question.correct_answer,
	  }));

	// console.log(formattedQuestions);
    return formattedQuestions;
};

const roomsParticipantsSockets = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Send a message to the connected client
    socket.emit('message', 'Welcome to the server!');

    socket.on('joinTeamRoom', ({ userId, roomId }) => {
        // Create a unique key for the participant's room and user
        console.log("joined room");
        const participantKey = `${roomId}-${userId}`;
        
        if (!roomsParticipantsSockets[roomId]) {
            roomsParticipantsSockets[roomId] = {};
        }
            
        // Store the socket associated with the participant for the specific room
        roomsParticipantsSockets[roomId][participantKey] = socket.id;
    });

    socket.on('teamDisconnect', () => {
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
    
  
    socket.on('startTeamGame', async ({ userId, roomId }) => {
        console.log('game stated');
        try {
            let roomExists = await Room.exists({ roomId });
            if (!roomExists) {
                return socket.emit('gameError', { error: 'Room does not exist' });
            }

            let room = await Room.findOne({ roomId: roomId }).populate({
                path: 'team1.players',
                select: '_id username name email'
            }).populate({
                path: 'team2.players',
                select: '_id username name email'
            });

            let user = await User.findById(userId);
            if (!user) {
                return socket.emit('gameError', { error: 'User not found' });
            }
            const isUserCreator = room.creatorId.equals(user._id);
            if (!isUserCreator) {
                return socket.emit('gameError', { error: 'User is not the room creator' });
            }

            room.isGameStarted = true;
            await room.save();

            // Get socket IDs of participants in the room
            const socketsInRoom = roomsParticipantsSockets[roomId] ? Object.values(roomsParticipantsSockets[roomId]) : [];

            const team1Leader = room.team1.leader;
            const team2Leader = room.team2.leader;

            let availableCategories = room.availableCategories;

            io.to(roomsParticipantsSockets[roomId][`${roomId}-${team1Leader}`]).emit('teamSelectCategory', { categories: availableCategories });
        } catch (error) {
            console.error('Error:', error);
            return socket.emit('gameError', { error: 'Error starting the game' });
        }
    });

    socket.on('teamCategoryChoice', async ({ chosenCategory, roomId }) => {
        // Here, 'chosenCategory' is the category selected by the team1 leader
        console.log(`Team selected category: ${chosenCategory}`);
        const currentCategory = chosenCategory.toString();

        let roomExists = await Room.exists({ roomId });
        if (!roomExists) {
            return socket.emit('gameError', { error: 'Room does not exist' });
        }

        let room = await Room.findOne({ roomId: roomId }).populate({
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        room.currentCategory = currentCategory;

        let availableCategories = room.availableCategories;

        room.availableCategories = room.availableCategories.filter(category => category !== currentCategory);
        availableCategories = availableCategories.filter(category => category !== currentCategory);

        await room.save();

        // Now, generate 3 questions based on this chosen category and emit them to the corresponding team
        // check if questions of mentioned category are in database
        try {
            const questionsFromDatabase = await Question.find({ category: { $in: currentCategory } });
    
            var categoriesExist = true;

            const qnFromDb = await Question.find({category: currentCategory});
            if(qnFromDb.length == 0) {
                categoriesExist = false;
            }

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_APIKEY
            });
            
            if (questionsFromDatabase.length < 3 || categoriesExist == false) {
                const question = "Generate a total of 3 mcqs based on the following categories: " + currentCategory + ' and provide the correct answer for each mcq, represent the mcqs in the following json format [{"category": "value", "question": "question 1", "options": ["option 1", "option 2", "option 3", "option 4"], "correct_answer": "answer"}]. ';
    
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

                const socketIdsArray = Object.keys(roomsParticipantsSockets[roomId] || {});
                if (socketIdsArray.length > 0) {
                    // console.log(selectedQuestions);
                    // Emit 'gameQuestions' event only to participants in the room
                    socketIdsArray.forEach(async participantSocket => {
                        const playerId = participantSocket.split("-")[1];
                        // console.log(playerId);

                        if(room.currentTurn === "team1") {
                            const playerInTeam1 = await room.team1.players.find(player => player.equals(playerId));

                            if (playerInTeam1) {
                                // console.log(selectedQuestions);
                                io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('gameQuestions', shuffledQuestions);
                            }
                        } else {
                            const playerInTeam2 = await room.team2.players.find(player => player.equals(playerId));

                            if (playerInTeam2) {
                                // console.log(selectedQuestions);
                                io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('gameQuestions', shuffledQuestions);
                            }
                        }

                    });
                } else {
                    console.log('No participants found in the room');
                }
            } 
            else {
                // console.log(chosenCategory.split(', '));
                const selectedQuestions = await selectRandomQuestions(questionsFromDatabase, 3, chosenCategory.split(', '));
                
                const socketIdsArray = Object.keys(roomsParticipantsSockets[roomId] || {});
                if (socketIdsArray.length > 0) {
                    // console.log(selectedQuestions);
                    // Emit 'gameQuestions' event only to participants in the room
                    socketIdsArray.forEach(async participantSocket => {
                        const playerId = participantSocket.split("-")[1];
                        // console.log(playerId);

                        if(room.currentTurn === "team1") {
                            const playerInTeam1 = await room.team1.players.find(player => player.equals(playerId));

                            if (playerInTeam1) {
                                // console.log(selectedQuestions);
                                io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('gameQuestions', selectedQuestions);
                            }
                        } else {
                            const playerInTeam2 = await room.team2.players.find(player => player.equals(playerId));

                            if (playerInTeam2) {
                                // console.log(selectedQuestions);
                                io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('gameQuestions', selectedQuestions);
                            }
                        }
                    });
                } else {
                    console.log('No participants found in the room');
                }
            }
        } catch (error) {
            console.error('Error checking the database:', error);
            return socket.emit('gameError', { error: 'Error starting the game' });
        }
    });


    socket.on('teamQuestionChoice', async ({ chosenQuestionId, roomId }) => {
        console.log(`Team selected question id: ${chosenQuestionId}`);

        let roomExists = await Room.exists({ roomId });
        if (!roomExists) {
            return socket.emit('gameError', { error: 'Room does not exist' });
        }

        let room = await Room.findOne({ roomId: roomId }).populate({
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        try {
            if (!chosenQuestionId) {
                return res.status(400).send({ 
                    message: false
                });
            }
    
            let questionExists = await Question.exists({ chosenQuestionId });
    
            if (!questionExists) {
                return res.status(404).json({ message: false });
            }
    
            let question = await Question.findOne({ _id: chosenQuestionId });
    
            if (!question) {
                return res.status(404).json({ message: false });
            }
            
            const socketIdsArray = Object.keys(roomsParticipantsSockets[roomId] || {});
            if (socketIdsArray.length > 0) {
                socketIdsArray.forEach(async participantSocket => {
                    const playerId = participantSocket.split("-")[1];

                    if(room.currentTurn === "team1") {
                        const playerInTeam2 = await room.team2.players.find(player => player.equals(playerId));

                        if (playerInTeam2) {
                            io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('Question', question);
                        }
                    } else {
                        const playerInTeam1 = await room.team1.players.find(player => player.equals(playerId));

                        if (playerInTeam1) {
                            io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('Question', question);
                        }
                    }
                });
            } else {
                console.log('No participants found in the room');
            }
            
        } catch (err) {
            console.error(err);
            return socket.emit('gameError', { error: 'Error starting the game' });
        }
    });

    socket.on('alterTeamTurn', async ({ roomId }) => {
        console.log(roomId);
        if (!roomId) {
            socket.emit('gameError', { error: 'Error occured' });
        }

        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        console.log(`Current Turn: ${room.currentTurn}`);

        try {
            if (room.currentTurn === "team1") {
                room.currentTurn = "team2";
            } else {
                room.currentTurn = "team1";
            }

            room.currentCategory = null;

            await room.save();

            if(room.availableCategories.length === 0) {
                const socketIdsArray = Object.keys(roomsParticipantsSockets[roomId] || {});
                if (socketIdsArray.length > 0) {
                    socketIdsArray.forEach(async participantSocket => {
                        io.to(roomsParticipantsSockets[roomId][participantSocket]).emit('gameEnded', {message: "Game ended! Load the scores"});   
                    });
                } else {
                    console.log('No participants found in the room');
                }

            }
            else if (room.currentTurn === "team1") {
                io.to(roomsParticipantsSockets[roomId][`${roomId}-${room.team1.leader}`]).emit('teamSelectCategory', { categories: room.availableCategories });
            } else {
                io.to(roomsParticipantsSockets[roomId][`${roomId}-${room.team2.leader}`]).emit('teamSelectCategory', { categories: room.availableCategories });
            }
        } catch (err) {
            console.error(err);
            return socket.emit('gameError', { error: 'Error during the game' });
        }
    });

});

// update scores of a player of respective room 
module.exports.updateScore = async function(req, res){
    try {
        const { roomId, team, score } = req.body;

        if (!roomId || !score) {
            return res.status(400).send({ 
                message: false
            });
        }

        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        if(team === "team1") {
            room.team1.score = score;
        } else {
            room.team2.score = score;
        }

        await room.save();

        room = await Room.findOne({ roomId: roomId }).populate({
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        return res.status(200).send({ 
            message: true,
            room: room
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
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).send({ 
                message: false
            });
        }

        let roomExists = await Room.exists({ roomId });

        if (!roomExists) {
            return res.status(404).json({ message: false });
        }

        let room = await Room.findOne({ roomId: roomId });

        if (!room) {
            return res.status(404).json({ message: false });
        }

        room = await Room.findOne({ roomId: roomId }).populate({
            path: 'team1.players',
            select: '_id username name email'
        }).populate({
            path: 'team2.players',
            select: '_id username name email'
        });

        const winnerTeam = room.team1;
        const looserTeam = room.team2;
        if(room.team1.score < room.team2.score) {
            winnerTeam = room.team2;
            looserTeam = room.team1;
        }

        res.status(200).send({
            message: true,
            roomId: room.roomId,
            winnerTeam: winnerTeam,
            looserTeam: looserTeam
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            message: false 
        });
    }
}

// endpoint to check if the answer of a question is correct
module.exports.checkAnswer = async function(req, res){
    try {
        const { questionId, chosenAnswer } = req.body;
        if (!questionId) {
            return res.status(400).send({ 
                message: false
            });
        }

        let questionExists = await Question.exists({ questionId });

        if (!questionExists) {
            return res.status(404).json({ message: false });
        }

        let question = await Question.findOne({ _id: questionId });

        if (!question) {
            return res.status(404).json({ message: false });
        }
        
        if (chosenAnswer === question.correct_answer) {
            res.status(200).send({
                message: true,
            });
        } else {    
            res.status(200).send({
                message: false,
            }); 
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ 
            message: false 
        });
    }
}