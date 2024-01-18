const express = require("express")
const controllerUser = require("../controllers/user")
const routerUser =  express.Router()


// User SignUp 
routerUser.post("/register",controllerUser.userRegister)

module.exports = routerUser