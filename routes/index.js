const express=require('express')
const router=express.Router()

router.get("/",(req,res)=>{
    res.send("Hello")
});

router.use('/auth', require("./auth"));
router.use('/user', require("./user"));
router.use('/single-player', require("./singlePlayer"));
router.use('/multi-player', require("./multiPlayer"));

module.exports = router;