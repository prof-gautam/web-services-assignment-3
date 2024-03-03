const express = require("express")
const path = require("path")
require("dotenv").config()

//local modules
const getClientInfo = require("../utils/clientInfo")
const { getStudentData } = require("../utils/readJson")

const router = express.Router()

router.use((req, res, next) => {
  req.clientInfo = getClientInfo(req)
  next()
})
router.use(async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, process.env.DATA_PATH)
    req.studentData = await getStudentData(filePath)
    next()
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while processing your request.",
      error: error,
      clientInfo: req.clientInfo,
    })
  }
})

router.get("/", async (req, res) => {
  try {
    res.status(200).send({
      studentInfo: req.studentData,
      clientInfo: req.clientInfo,
    })
  } catch (error) {
    console.error("Error in getting client details:", error)

    res.status(500).send({
      message: "An error occurred while processing your request.",
      error: error,
      clientInfo: req.clientInfo,
    })
  }
})

router.post("/", (req, res) => {
  try {
    const studentId = req.query.student_id
    const student = req.studentData.find(
      (student) => student.student_id === studentId
    )

    if (student) {
      res.status(200).send({
        studentInfo: student,
        clientInfo: req.clientInfo,
      })
    } else {
      res.status(404).send({
        studentInfo: "Student not found!",
        clientInfo: req.clientInfo,
      })
    }
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send({
      message: "An error occurred while processing your request.",
      error: error.message,
      clientInfo: req.clientInfo,
    })
  }
})

router.post("/findStudentsByCourse", (req, res) => {
  try {
    //if course_id is provided, takes courseID as provided courseId else, takes "CS548" as default
    const courseId = req.body.courseId || "CS548"
    console.log(courseId)

    // Filter students who have taken the specified course
    const studentsInCourse = req.studentData.filter((student) =>
      student.courses.some((course) => course.course_id === courseId)
    )

    // Map the filtered students to return only their student_id
    const studentIds = studentsInCourse.map((student) => student.student_id)

    res.status(200).send({
      studentInfo: studentIds,
      clientInfo: req.clientInfo,
    })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send({
      message: "An error occurred while processing your request.",
      error: error.message,
    })
  }
})

router.post("/findSimilarStudents", (req, res) => {
  try {
    const studentId = req.body.student_id
    // Check if body data exists
    if (!studentId) {
      res.status(404).send({
        studentInfo: "Student not found!",
        clientInfo: req.clientInfo,
      })
    }

    // Find the student by studentId
    const student = req.studentData.find((s) => s.student_id === studentId)
    if (!student) {
      return res.status(404).send({
        studentInfo: "Student not found!",
        clientInfo: req.clientInfo,
      })
    }

    // Get the list of course the student has taken, not including "CS548"
    const courseIds = student.courses
      .filter((course) => course.course_id !== "CS548")
      .map((course) => course.course_id)

    const response = courseIds.map((courseId) => {
      // Find all students who have taken the same course
      const studentsInCourse = req.studentData
        .filter((s) =>
          s.courses.some((course) => course.course_id === courseId)
        )
        .map((s) => s.student_id)

        const courseName = student.courses.find(
        (course) => course.course_id === courseId
      ).course_name

      return {
        course_id: courseId,
        course_name: courseName,
        studentList: studentsInCourse,
      }
    })

    res.status(200).send({
        studentInfo: response,
        clientInfo: req.clientInfo,
    })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).send({
      message: "An error occurred while processing your request.",
      error: error.message,
    })
  }
})

module.exports = router

// GET  / to retrieve all the student-info
// POST /to retrieve your information based on 'student-id'
// POST /to retrieve student's info who has taken CS548 -> the result should be all students ( return student-id only)
// POST /to retrieve who has taken the courses you have taken except CS548.
