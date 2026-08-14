const { validationResult } = require("express-validator")
const pool = require("../Config/db")


const getallStudents = async (req, res, next) => {

    try {
        const data = await pool.query(`SELECT * FROM students`)
        if (data.rowCount == 0) {
            return res.status(404).json({ message: 'No students enrolled yet' })
        }
        res.status(200).json({ students: data.rows });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}


const getStudentById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const studentFound = await pool.query('SELECT * FROM students WHERE id = $1', [id])

        if (studentFound.rowCount == 0) {
            return res.status(404).json({ message: 'Student not found' })
        }

        res.status(200).json({ student: studentFound.rows[0] })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }
}


const addStudent = async (req, res, next) => {
    
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error })
    }

    const { name, email } = req.body;

    try {
        const isExist = await pool.query(`SELECT * FROM students WHERE email = $1`, [email])
        if (isExist.rowCount > 0) {
            return res.status(409).json({ message: 'Student already exist with this email' })
        }
        const student = await pool.query(`
            INSERT INTO students
             (name , email)
             VALUES($1 , $2)
             RETURNING*`, [name, email])

        res.status(201).json({ createdStudent: student.rows[0] })

    } catch (error) {
       next(error)
    }
}


const updateStudent = async (req, res, next) => {
    const id = req.params.id;
    const { name, email } = req.body;

    try {
        const updatedStudent = await pool.query(`
            UPDATE students
            SET name = COALESCE($1, name),
                email = COALESCE($2, email)
            WHERE id = $3
            RETURNING *`,
            [name, email, id]
        )

        if (updatedStudent.rowCount == 0) {
            return res.status(404).json({ message: 'Student not found' })
        }

        res.status(200).json({ updatedStudent: updatedStudent.rows[0] })

    } catch (error) {
       next(error)
    }
}


const deleteStudent = async (req, res, next) => {
    const id = req.params.id;

    try {
        const deleted = await pool.query(`
            DELETE FROM students 
            WHERE id = $1
            RETURNING *`, [id])

        if (deleted.rowCount == 0) {
            return res.status(404).json({ message: 'Student not found' })
        }

        res.status(200).json({ deletedStudent: deleted.rows[0] })

    } catch (error) {
        next(error)
    }
}


module.exports = { getallStudents, getStudentById, addStudent, updateStudent, deleteStudent }