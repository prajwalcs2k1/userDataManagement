const express = require("express")
const controllerUser = require("../controllers/user")
const routerUser =  express.Router()


// User SignUp 
routerUser.post("/register",controllerUser.userRegister)

// User Login 
routerUser.post("/login",controllerUser.userLogin)


module.exports = routerUser