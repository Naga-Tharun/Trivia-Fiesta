const express=require('express')
const router=express.Router()

const usersController = require('../controllers/usersController');

router.post('/sign-in', usersController.signIn);

router.post('/sign-up', usersController.signUp);

module.exports = router;