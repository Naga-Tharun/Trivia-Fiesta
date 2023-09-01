const jwt = require("jsonwebtoken");
const config = process.env;

const Token = require("../models/token");

async function verifyToken(req, res, next){
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.status(401).json({ 
            request: "Token Required!" 
        });
    }

    try{
        // check if the token is revoked
        const isPresent = await Token.exists({ 
            tokenValue: token 
        });
        
        if(!isPresent){
            return res.status(401).json({ 
                request: false 
            });
        }
        
        jwt.verify(token, config.TOKEN_KEY, function(err, decoded){
            if(err){
                return res.status(401).json({ 
                    request: false 
                });
            }
            
            req.userId = decoded.userId;
            next();
        });
    } catch(err){
        if(err){
            return res.status(401).json({ 
                request: false 
            });
        }
    }
}

module.exports = verifyToken;