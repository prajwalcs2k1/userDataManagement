require('dotenv').config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8001
const routerUser = require("./routers/user")
const cors = require("cors")

app.use(express.json())
app.use(cors())


app.use("/api", routerUser)

app.listen(PORT,()=>{console.log(`Server running at http://localhost:${PORT}`)})