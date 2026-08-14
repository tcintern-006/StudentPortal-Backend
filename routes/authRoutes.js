const express = require("express");
const { registerValadation, loginValidation } = require("../middlewares/validateData");
const { loginUser, registerUser, getProfile, logout, updateProfile } = require("../controllers/authController");
const protect = require("../middlewares/authMiddlware");

const authRouter = express.Router();


authRouter.post('/register' ,registerValadation,  registerUser)
authRouter.post('/login' , loginValidation , loginUser)
authRouter.put('/updateprofile' ,  protect , updateProfile)
authRouter.get('/profile' ,protect, getProfile)
authRouter.get('/logout', logout)



module.exports = authRouter