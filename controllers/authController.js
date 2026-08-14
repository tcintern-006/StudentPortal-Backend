const { validationResult } = require("express-validator");
const pool = require("../Config/db");
const bcrypt = require('bcrypt');
const generateToken = require("../utils/jwtToken");

const registerUser = async (req, res, next) => {
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
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            message: "Registration successful",
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
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
        const { password: _, ...userWithoutPassword } = dbuser;
        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        next(error)
    }
}

const getProfile = async (req, res, next) => {
    const id = req.user.id;
    try {
        const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
        if (user.rowCount == 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        const { password: _, ...userWithoutPassword } = user.rows[0];
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    const { email } = req.body;
    const id = req.user.id;
    if (!email) {
        return res.status(400).json({ message: 'email required' });
    }

    try {
           const updatedUser = await pool.query(
            'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, name, email, role, created_at',
            [email, id]
        );

        if (updatedUser.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: updatedUser.rows[0]
        });
    } catch (error) {
        next()
    }
}
module.exports = { registerUser, loginUser, getProfile, logout , updateProfile}
