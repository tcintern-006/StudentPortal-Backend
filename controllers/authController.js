const { validationResult, cookie } = require("express-validator");
const pool = require("../Config/db");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/jwtToken");


const registerUser = async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error })
    }

    const { name, email, password, role } = req.body;

    try {
        const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
        if (user.rowCount > 0) {
            return res.status(409).json({ message: 'User with this email already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await pool.query(`
          INSERT INTO users
          (name , email , password , role)
          VALUES($1 , $2 , $3 , $4)  
            RETURNING *`,
            [name, email, hashedPassword, role]
        )
        const newUser = createdUser.rows[0];

        const token = generateToken(newUser);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            message: "Registration successful",
            user: userWithoutPassword
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }

}


const loginUser = async (req, res) => {

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error })
    }

    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rowCount == 0) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }


        const dbuser = user.rows[0];
        const token = generateToken(dbuser);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = dbuser;

        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }

}


const getProfile = async (req, res) => {

    const id = req.user.id;
    console.log(req.user)

    try {

        const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
        if (user.rowCount == 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        const { password: _, ...userWithoutPassword } = user.rows[0];
        res.status(200).json({ user: userWithoutPassword });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }


}

const logout = async (req, res) => {
    try {

        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
    }

}

module.exports = { registerUser, loginUser, getProfile, logout }