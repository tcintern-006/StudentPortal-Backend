const express = require("express");
const { getallCourses, getCoursesbyID, addCourse, updateCourses, deleteCourses } = require("../controllers/coursesController");
const {courseValidationRules} = require("../middlewares/validateData");
const protect = require("../middlewares/authMiddlware");
const adminAccess = require("../middlewares/adminAccess");

const apiRouter = express.Router();


apiRouter.get("/courses" , getallCourses)

apiRouter.get("/courses/:id" , getCoursesbyID)


apiRouter.post("/courses" , courseValidationRules , protect, adminAccess, addCourse)

apiRouter.put("/courses/:id",protect, adminAccess ,updateCourses)

apiRouter.delete("/courses/:id" , protect, adminAccess, deleteCourses)


module.exports = apiRouter;