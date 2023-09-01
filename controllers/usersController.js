require('dotenv').config();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const saltRounds = 10;

const Token = require("../models/token");

// get the sign up data
module.exports.signUp = async function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.status(401).send({
            request: false
        });
    }

    let user = await User.findOne({email: req.body.email});
    
    if(!user){
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash){
            req.body.password = hash;

            try{
                let newUser = await User.create(req.body);

                const token = jwt.sign(
                    { user_id: newUser._id, email: newUser.email },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "1h",
                    }
                );
            
                // save user token
                newUser.token = token;

                // save the token
                const tokenDocument = new Token({
                    userId: newUser._id,
                    tokenValue: token
                });
                await tokenDocument.save();

                return res.json({
                    email: newUser.email,
                    name: newUser.name,
                    username: newUser.username,
                    phone: newUser.phone,
                    id: newUser._id,
                    profileUrl: newUser.profileUrl,
                    token: newUser.token,
                    request: true
                });
                
            } catch(err){
                if(err){
                    return res.status(400).send({
                        request: false
                    });
                }
            }
        });
    }
    else{
        return res.status(400).send({
            message: false
        });
    }
};

// sign in the user
module.exports.signIn = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email});
        
        bcrypt.compare(req.body.password, user.password).then(async function(result){
            if(result){
                const token = jwt.sign(
                    { user_id: user._id, email: user.email },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "1h",
                    }
                );
            
                // save user token
                user.token = token;

                // save the token
                const tokenDocument = new Token({
                    userId: user._id,
                    tokenValue: token
                });
                await tokenDocument.save();

                return res.json({
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    phone: user.phone,
                    id: user._id,
                    profileUrl: user.profileUrl,
                    token: user.token,
                    request: true
                });
            }
            
            return res.status(401).json({ 
                request: false
            });
        });

    } catch(err){
        if(err){
            return res.status(400).send({
                request: false
            });
        }
    }
};

// user profile update
module.exports.update = function(req, res){
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash){
        req.body.password = hash;

        try{
            let user = await User.findByIdAndUpdate(req.params.id, req.body);

            return res.json({
                email: req.body.email,
                name: req.body.name,
                username: req.body.username,
                phone: req.body.phone,
                id: user._id,
                profileUrl: req.body.profileUrl,
                request: true
            });

        } catch(err){
            if(err){
                return res.status(400).send({
                    request: false
                });
            }
        }
    });
}

// delete user account
module.exports.deleteAccount = async function(req, res){

    let user = await User.findById(req.params.id);

    try{
        const match = await bcrypt.compare(req.body.password, user.password);

        if(match){
            await User.deleteOne({_id: req.params.id});

            await Token.deleteMany({ userId: user._id });
            
            return res.json({
                request: true
            });
        }
        else{
            return res.status(401).json({ 
                request: false
            });
        }
    } catch(err){
        return res.status(401).json({ 
            request: false
        });
    }
}