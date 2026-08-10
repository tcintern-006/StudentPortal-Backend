const { validationResult } = require("express-validator");
const courses = require("../Assets/data")

const getallCourses = (req, res) => {

    res.status(200).json({ allCourses: courses });

}


const getCoursesbyID = (req, res) => {
    const id = req.params.id;

    const courseFound = courses.find((e) => e.id == id);

    if (!courseFound) { return res.status(400).json("Course not found") };

    res.status(200).json({Course : courseFound})


}


const addCourse = (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error);
    }
    const { title,  description, price, orignalPrice, bubbles, img, feature } = req.body;
   const id = courses.length > 0 
    ? Math.max(...courses.map(c => c.id)) + 1 
    : 1;

    courses.push({
        id,
        title,
        description,
        price,
        orignalPrice,
        bubbles,
        img,
        feature,

    })
    res.status(200).json({ courses })
}


const updateCourses = (req, res) => {

    const id = req.params.id;

    const findCourse = courses.find((e)=>  e.id == id)

    if (!findCourse) {
    return res.status(404).json("Course not found");
}

const newCourse = { ...findCourse, ...req.body };

const findIndex = courses.findIndex((e)=> e.id == id);
courses[findIndex] =  newCourse;

res.status(200).json({courses});

}



const deleteCourses = (req, res) => {

    const id = req.params.id;

    const findIndex = courses.findIndex((e)=> e.id == id);

    if (findIndex === -1) {
    return res.status(404).json("Course not found");
}

   courses.splice(findIndex, 1); 

    res.status(200).json(courses)

}

module.exports = { getallCourses, getCoursesbyID, addCourse, updateCourses, deleteCourses }