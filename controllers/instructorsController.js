const { validationResult } = require("express-validator")
const pool = require("../Config/db")



const getallInstructors = async (req, res , next) => {

    try {
        const allInstructors = await pool.query(`SELECT * FROM instructors`)
        if (allInstructors.rowCount == 0) {
            return res.status(404).json({ message: 'No instructor added yet' })
        }
        res.status(200).json({ instructors: allInstructors.rows })
    } catch (error) {
        next(error)
    }


}



const addInstructors = async (req, res ,next ) => {

    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error })
    }
    const { name, role, pic, bio, experties, experience, students_count, rating, linkedln, github, twitter } = req.body;


    try {


        const userExist = await pool.query('SELECT * FROM instructors WHERE name = $1', [name])
        if (userExist.rowCount > 0) {
            return res.status(409).json({ message: 'Instructor already exist' })
        }



        const instructor = await pool.query(`
        INSERT INTO instructors
        (name, role , pic ,bio , experties , experience , students_count, rating ,linkedln ,github , twitter)
        VALUES($1 , $2 , $3 , $4 , $5 , $6 ,$7 ,$8 , $9 , $10 ,$11)
        RETURNING *`,
            [name, role, pic, bio, experties, experience, students_count, rating, linkedln, github, twitter]
        )

        res.status(200).json({ newInstructor: instructor.rows[0] })

    } catch (error) {

        next(error)

    }
}


const updateInstructors = async (req, res , next) => {
    const id = req.params.id;
    const { name, role, pic, bio, experties, experience, students_count, rating, linkedln, github, twitter } = req.body;

    try {
        const updatedUser = await pool.query(`
            
            UPDATE instructors
                SET name = COALESCE($1, name),
                 role = COALESCE($2, role),
                 pic = COALESCE($3, pic),
                 bio = COALESCE($4, bio),
                 experties = COALESCE($5, experties),
                 experience = COALESCE($6, experience),
                 students_count = COALESCE($7, students_count),
                 rating = COALESCE($8, rating),
                 linkedln = COALESCE($9, linkedln),
                 github = COALESCE($10, github),
                 twitter = COALESCE($11, twitter)

                 WHERE id = $12
                 RETURNING *
            `,
        [name , role ,pic ,bio , experties , experience , students_count , rating ,linkedln , github , twitter , id])

            if(updatedUser.rowCount == 0){
             return   res.status(404).json({message: "Instructors not found"})
            }

            res.status(200).json({update : updatedUser.rows[0]});

    } catch (error) {

        next(error)

    }

}

const deleteInstructors = async (req , res, next)=>{

    const id = req.params.id;
    try {

        const instructor = await pool.query(`
            
            DELETE FROM instructors
            WHERE id = $1

            RETURNING *`,
            [id]
        )

        if(instructor.rowCount == 0){
           return res.status(404).json({message : 'Instructors not found'})
        }
        res.status(200).json({deleted : instructor.rows[0]})
        
    } catch (error) {
        next(error)
    }

}





module.exports = { getallInstructors, addInstructors , updateInstructors, deleteInstructors}