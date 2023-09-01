const express=require('express')
const router=express.Router()

router.get("/",(req,res)=>{
    res.send("Hello")
});

router.use('/auth', require("./auth"));
router.use('/user', require("./user"));

module.exports = router;