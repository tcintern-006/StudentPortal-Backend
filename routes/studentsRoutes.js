const express = require('express');
const { getallStudents, addStudent, deleteStudent, getStudentById, updateStudent } = require('../controllers/studentController');
const { validateStudent } = require('../middlewares/validateData');
const protect = require('../middlewares/authMiddlware');
const adminAccess = require('../middlewares/adminAccess');

const stuRouter = express.Router();



stuRouter.get("/students", getallStudents)

stuRouter.get("/students/:id", getStudentById)

stuRouter.post("/students",validateStudent , protect , adminAccess , addStudent)

stuRouter.put("/students/:id", protect , adminAccess ,  updateStudent)

stuRouter.delete("/students/:id",  protect , adminAccess , deleteStudent)



module.exports = stuRouter