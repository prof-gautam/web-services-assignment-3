// importing necessary library
const express = require("express")
const https = require("https")
const fs = require('fs')

//importing local modules
const studentInfo = require('./routes/studentInfo')


//Setting express server
const app = express()

const httsOptions = {
    //ssl path
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
}

// now creating server using https
const server = https.createServer(httsOptions, app)
app.use(express.json())
app.use('sfbu/api/v1', studentInfo)

//listening to server 
const PORT = process.env.PORT || 3001
server.listen(process.env.PORT, ()=>{
    console.log(`Listening to port: ${PORT}`)
})