require("dotenv").config()
const chai = require("chai")
const chaiHttp = require("chai-http")
const {faker} = require("@faker-js/faker")
const baseUrl = `http://localhost:${process.env.PORT}/api`


chai.use(chaiHttp)
const should = chai.should()
let accessToken = ""

describe("User API", () => {

    let userName = "prajwal123"
    let password = "prajwal"


    // tests wrt user register
    describe("/POST /register", () => {
        it("should successfully register a new user", (done) => {
          const newUser = {
            userName: userName,
            password: password,
          }
      
          chai.request(baseUrl)
            .post("/register")
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(201)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(true)
              res.body.should.have.property("message").eql("successfully registered")
              done()
            })
        })
    
        it("should not sign up a registered user", (done) => {
            const newUser = {
                userName: userName,
                password: password,
            }
          chai.request(baseUrl)
            .post("/register")
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(400)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(false)
              res.body.should.have.property("message").eql("userName already exists")
              done()
            })
        })
    
        it("should not register a user without name", (done) => {
            const newUser = {
                name: "",
                password: password,
            }
          chai.request(baseUrl)
            .post("/register")
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(400)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(false)
              res.body.should.have.property("message").eql("details not provided properly")
              done()
            })
        })


        it("should not register a user without password", (done) => {
            const newUser = {
                name: "pavan",
                password: "",
            }
          chai.request(baseUrl)
            .post("/register")
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(400)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(false)
              res.body.should.have.property("message").eql("details not provided properly")
              done()
            })
        })    
      })   



    //   tests wrt to user login
      describe("/POST /login", () => {
        it("should login a user with a registered username", (done) => {
            const userData = {
                userName: userName,
                password: password,
              }
          chai.request(baseUrl)
            .post("/login")
            .send(userData)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(true)
              res.body.should.have.property("message").eql("logged in successfully")
              res.body.should.have.property("data")
              accessToken = res.body.data       
              done()
            })
        })
    
    
        it("should not login a user without registration", (done) => {
          const userData = {
            userName: faker.person.fullName(),
            password: faker.internet.password()
          }
      
          chai.request(baseUrl)
            .post("/login")
            .send(userData)
            .end((err, res) => {
              res.should.have.status(404)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(false)
              res.body.should.have.property("message").eql("user not registered")
              done()
            })
        })
    
    
        it("should not login a user with wrong password", (done) => {  
            const userData = {
                userName: userName,
                password: "fakePassword"
              }
          chai.request(baseUrl)
            .post("/login")
            .send(userData)
            .end((err, res) => {
              res.should.have.status(400)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(false)
              res.body.should.have.property("message").eql("wrong password")
              done()
            })
        })
      })
      


    //   tests wrt user profile fetch
      describe("/GET /profile", () => {
        it(`should fetch loggedin user"s profile details`, (done) => {
      
          chai.request(baseUrl)
            .get("/profile")
            .set("accesstoken", accessToken)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a("object")
              res.body.should.have.property("status").eql(true)
              res.body.should.have.property("message").eql("success")      
              done()
            })
        })


        it(`should not fetch profile details for non authenticated user`, (done) => {
      
            chai.request(baseUrl)
              .get("/profile")
              .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a("object")
                res.body.should.have.property("status").eql(false)
                res.body.should.have.property("message").eql("user not logged in")      
                done()
              })
          })
      })


})