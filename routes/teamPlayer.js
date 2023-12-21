const express=require('express')
const router=express.Router()

const teamPlayersController = require('../controllers/teamPlayersController');

const auth = require("../middleware/auth")

router.post('/create-room', auth, teamPlayersController.createRoom);

router.post('/join-room', auth, teamPlayersController.joinRoom);

router.post('/update-categories', auth, teamPlayersController.updateCategories);

router.post('/leave-room', auth, teamPlayersController.leaveRoom);

router.post('/update-score', auth, teamPlayersController.updateScore);

router.post('/final-result', auth, teamPlayersController.finalResult);

router.post('/check-answer', auth, teamPlayersController.checkAnswer);

module.exports = router;