const express = require("express")
const studentRoutes = require("./studentRoutes")

const router = express.Router()

router.use("/students", studentRoutes)

module.exports = router
