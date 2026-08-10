const express = require("express");
const { getallCourses, getCoursesbyID, addCourse, updateCourses, deleteCourses } = require("../controllers/coursesController");
const courseValidationRules = require("../middlewares/validateData");

const apiRouter = express.Router();


apiRouter.get("/courses" , getallCourses)

apiRouter.get("/courses/:id" , getCoursesbyID)


apiRouter.post("/courses" , courseValidationRules, addCourse)

apiRouter.put("/courses/:id", updateCourses)

apiRouter.delete("/courses/:id" , deleteCourses)


module.exports = apiRouter;