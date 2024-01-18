const chai = require("chai")
const chaiHttp = require("chai-http")
const baseUrl = `http://localhost:8000/api`


chai.use(chaiHttp)
const should = chai.should()
let accessToken = ""

describe("User API", () => {

    let userName = "prajwal123"
    let password = "prajwal"

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




})