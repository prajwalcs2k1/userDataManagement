const model = require("../models/index")
const jsonResponse = require("../helper/jsonResponse")
const bcrypt = require("bcrypt")
const Validator = require("validatorjs")
const jwt = require("jsonwebtoken")


const fetchUserDataByName = async (userName) => {
    const requiredUser = await model.User.findOne({
        where : {
            name : userName
        }
    })
    return requiredUser
}


// User Register
exports.userRegister = async (req,res) => {
    const {userName, password} = req.body
    const data = {
        userName : userName,
        password : password
    }
    const rules =  {
        userName : ["required", "regex:/^[a-zA-Z0-9 ]+$/"],
        password : "required"
    }
    
    const validation = new Validator(data, rules)
    if(validation.fails()) return res.status(400).send(jsonResponse.failure({errors:validation.errors.all()},"details not provided properly"))
    
    // hashing the password
    const hashedPassword = await bcrypt.hash(password,12)
    
    try{
        const requiredUser = await fetchUserDataByName(userName)

        if(requiredUser != null) return res.status(400).send(jsonResponse.failure(null,"userName already exists"))

        const newUser = await model.User.build({
            name : userName,
            password : hashedPassword
        })
        await newUser.save()

        // creating a token
        const userToken = jwt.sign({id : newUser.id, name : newUser.name}, process.env.SECRET_KEY)

        return res.status(201).send(jsonResponse.success(userToken,"successfully registered"))
    }
    catch(err){
        console.log(err)
        return res.status(503).send(jsonResponse.failure(err,"database connection error... try again later"))
    }   
}

// User Login
exports.userLogin = async (req,res) => {
    const {userName,password} = req.body

    const data = {
        name : userName,
        password : password
    }
    const rules =  {
        name : "required",
        password : "required"
    }
    const validation = new Validator(data, rules)
    if(validation.fails()) return res.status(400).send(jsonResponse.failure({errors:validation.errors.all()},"details not provided properly"))

    try{
        const requiredUser = await fetchUserDataByName(userName)
        
        if(requiredUser == null) return res.status(404).send(jsonResponse.failure(null,"user not registered"))
        
        // compare the password provided by the user with that stored in the table
        if(await bcrypt.compare(password,requiredUser.password)){
            // creating a token
            const userToken = jwt.sign({id : requiredUser.id, name : requiredUser.name},process.env.SECRET_KEY)
            return res.status(200).send(jsonResponse.success(userToken,"logged in successfully"))
        }else{
            return res.status(400).send(jsonResponse.failure(null,"wrong password")) 
        }
    }
    catch(err){
        console.log(err)
        return res.status(503).send(jsonResponse.failure(err,"database connection error... try again later"))
    }    
}


// User Profile
exports.userProfile = async (req,res) => {
    try{
        // fetch the loggedin user details 
        let requiredUser = await model.User.findOne({
            where : {
                id : req.loggedInUser.id
            }
        })
    
        if(requiredUser == null) return res.status(400).send(jsonResponse.failure(null,"user not found"))

        requiredUser = {
            id : requiredUser.id,
            name : requiredUser.name
        }
    
        return res.status(200).send(jsonResponse.success(requiredUser,"success"))
    }
    catch(err){
        return res.status(503).send(jsonResponse.failure(null,"database connection error... try again later"))
    }    
}