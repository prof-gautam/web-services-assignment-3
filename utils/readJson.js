const fs = require("fs").promises
const path = require("path")
const json5 = require("json5")

const getStudentData = async (filePath) => {
  try {
    // Asynchronously read the file content
    const rawData = await fs.readFile(filePath, "utf8")
    // Parse the content using json5
    const studentData = json5.parse(rawData)
    return studentData // Return the parsed data
  } catch (error) {
    console.error("Error reading or parsing the student data file:", error)
    throw error
  }
}

module.exports = {
  getStudentData: getStudentData,
}



