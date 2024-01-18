const express = require("express")
const controllerUser = require("../controllers/user")
const routerUser =  express.Router()
const {checkLogin} = require("../middleware/middlewareLogin")


// User SignUp 
routerUser.post("/register",controllerUser.userRegister)

// User Login 
routerUser.post("/login",controllerUser.userLogin)

// middleware
routerUser.use(checkLogin)

// User Profile 
routerUser.get("/profile",controllerUser.userProfile)

module.exports = routerUser