const express=require('express')
const router=express.Router()

const usersController = require('../controllers/usersController');

const auth = require("../middleware/auth")

router.post('/update/:id', auth, usersController.update);

router.post('/delete-account/:id', auth, usersController.deleteAccount)

module.exports = router;