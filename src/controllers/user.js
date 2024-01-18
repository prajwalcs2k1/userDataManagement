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
        userName : ["required", "regex:/^[a-zA-Z0-9]+$/"],
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
        const userToken = jwt.sign({id : newUser.id, name : newUser.name, password : newUser.password}, process.env.SECRET_KEY)

        return res.status(201).send(jsonResponse.success(userToken,"successfully signed up"))
    }
    catch(err){
        console.log(err)
        return res.status(503).send(jsonResponse.failure(err,"database connection error... try again later"))
    }   
}