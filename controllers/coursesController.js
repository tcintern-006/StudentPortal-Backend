const { validationResult } = require("express-validator");

const pool = require("../Config/db");


const getallCourses = async (req, res) => {

    try {
        console.log("im here")
        const data = await pool.query('SELECT * FROM courses')
        if (data.rowCount === 0) {
            return res.status(404).json({ message: "No courses available now" })
        }

        res.status(200).json({ allCourses: data.rows });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }

}


const getCoursesbyID = async (req, res) => {
    const id = req.params.id;

    try {
        const courseFound = await pool.query('SELECT * FROM courses WHERE id = $1', [id])

        if (courseFound.rowCount == 0) { return res.status(404).json({ message: "Course not found" }) };

        res.status(200).json({ Course: courseFound.rows[0] })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }


}


const addCourse = async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json(error);
    }

    try {
        const { title, description, price, original_price, bubbles, img, feature, off ,instructor_id} = req.body;

        const newCourse = await pool.query(`
            INSERT INTO courses  
            (title, bubbles, description, price ,original_price , off , img , feature , instructor_id)
              VALUES($1, $2, $3, $4, $5, $6, $7 , $8 ,$9)
              RETURNING*
             `,
            [title, bubbles, description, price, original_price, off, img, feature ?? false , instructor_id],
        )

        res.status(200).json({ course: newCourse.rows[0] })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })

    }

}


const updateCourses = async (req, res) => {

    const id = req.params.id;
    const { title, description, price, orignal_price, bubbles, img, feature, off } = req.body;
    try {
        const updatedCourse = await pool.query(`
            UPDATE courses
        SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 price = COALESCE($3, price),
                 original_price = COALESCE($4, original_price),
                 bubbles = COALESCE($5, bubbles),
                 img = COALESCE($6, img),
                 feature = COALESCE($7, feature),
                 off = COALESCE($8, off)
             WHERE id = $9
             RETURNING *`,
            [title, description, price, orignal_price, bubbles, img, feature, off, id]
        )

        if (updatedCourse.rowCount == 0) {
            return res.status(404).json({ message: 'Course not found' })
        }
        res.status(200).json({ Course: updatedCourse.rows[0] });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })

    }
}



const deleteCourses = async (req, res) => {

    const id = req.params.id;

    try {
        const course = await pool.query(`
     DELETE FROM courses  WHERE id = $1  RETURNING *`, [id])


        if (course.rowCount == 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ deletedCourse: course.rows[0] })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' })
    }

}

module.exports = { getallCourses, getCoursesbyID, addCourse, updateCourses, deleteCourses }