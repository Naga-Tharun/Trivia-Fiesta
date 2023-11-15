const express=require('express')
const router=express.Router()

const multiPlayersController = require('../controllers/multiPlayersController');

const auth = require("../middleware/auth")

router.post('/create-room', auth, multiPlayersController.createRoom);


module.exports = router;