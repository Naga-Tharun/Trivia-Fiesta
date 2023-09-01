const express=require('express')
const router=express.Router()

const usersController = require('../controllers/usersController');
const questionsController = require('../controllers/questionsController');

const auth = require("../middleware/auth")

router.post('/update/:id', auth, usersController.update);

router.post('/delete-account/:id', auth, usersController.deleteAccount);

router.post('/generate-questions', auth, questionsController.generateQuestions);

module.exports = router;