const express = require("express")
const controllerUser = require("../controllers/user")
const routerUser =  express.Router()
const {checkLogin} = require("../middleware/middlewareLogin")


// User Registration 
routerUser.post("/register",controllerUser.userRegister)

// User Login 
routerUser.post("/login",controllerUser.userLogin)

// User Profile 
routerUser.get("/profile",checkLogin, controllerUser.userProfile)

module.exports = routerUser