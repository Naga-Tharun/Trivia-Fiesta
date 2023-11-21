const express=require('express')
const router=express.Router()

const multiPlayersController = require('../controllers/multiPlayersController');

const auth = require("../middleware/auth")

router.post('/create-room', auth, multiPlayersController.createRoom);

router.post('/join-room', auth, multiPlayersController.joinRoom);

router.post('/update-categories', auth, multiPlayersController.updateCategories);

router.post('/remove-categories', auth, multiPlayersController.removeCategories);

router.post('/leave-room', auth, multiPlayersController.leaveRoom);

router.post('/player-ready-status', auth, multiPlayersController.playerReadyStatus);

router.post('/update-score', auth, multiPlayersController.updateScore);

router.post('/final-result', auth, multiPlayersController.finalResult);

module.exports = router;