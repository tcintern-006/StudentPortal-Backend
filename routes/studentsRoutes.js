const express = require('express');
const { getallStudents, addStudent, deleteStudent, getStudentById, updateStudent } = require('../controllers/studentController');
const { validateStudent } = require('../middlewares/validateData');

stuRouter = express.Router();



stuRouter.get("/students", getallStudents)

stuRouter.get("/students/:id", getStudentById)

stuRouter.post("/students",validateStudent , addStudent)

stuRouter.put("/students/:id", updateStudent)

stuRouter.delete("/students/:id", deleteStudent)



module.exports = stuRouter