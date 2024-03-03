// importing necessary library
const express = require("express")
const https = require("https")
const fs = require("fs")
require("dotenv").config()

//importing local modules
const apiRoutes = require("./routes/apiRoutes")

//Setting express server
const app = express()

const httpsOptions = {
  //ssl path
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
}

// now creating server using https
const server = https.createServer(httpsOptions, app)
app.use(express.json())
app.use("/sfbu/api/v1", apiRoutes)

//listening to server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})
