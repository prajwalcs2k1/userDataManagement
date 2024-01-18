const jwt = require('jsonwebtoken')
const jsonResponse = require('../helper/jsonResponse')

exports.checkLogin = async (req,res,next) => {
    // checks if the header of the request contains accessToken
    if(!req.headers['accesstoken']){
        return res.status(400).send(jsonResponse.failure(null,`user not logged in`))
    }

    // if the accesstoken is present, verification of the token is performed
    jwt.verify(req.headers['accesstoken'],process.env.SECRET_KEY,(err,decoded)=>{
        if(decoded){
            req.loggedInUser = decoded
            next()
        }else{
            return res.status(401).send(jsonResponse.failure(err,`error`))
        }
    })
} 