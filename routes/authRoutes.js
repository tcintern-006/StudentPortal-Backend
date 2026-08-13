const express = require("express");
const { registerValadation, loginValidation } = require("../middlewares/validateData");
const { loginUser, registerUser, getProfile, logout } = require("../controllers/authController");
const protect = require("../middlewares/authMiddlware");

const authRouter = express.Router();


authRouter.post('/register' ,registerValadation,  registerUser)
authRouter.post('/login' , loginValidation , loginUser)
authRouter.get('/profile' ,protect, getProfile)
authRouter.get('/logout', logout)



module.exports = authRouter