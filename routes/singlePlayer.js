const express=require('express')
const router=express.Router()

const singlePlayersController = require('../controllers/singlePlayersController');

const auth = require("../middleware/auth")

router.post('/generate-questions', auth, singlePlayersController.generateQuestions);

router.post('/update-score', auth, singlePlayersController.updateScore);

router.post('/get-scores', auth, singlePlayersController.getScores);

module.exports = router;