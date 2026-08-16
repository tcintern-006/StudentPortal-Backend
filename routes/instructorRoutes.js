const express = require('express');
const { getallInstructors, addInstructors, updateInstructors, deleteInstructors } = require('../controllers/instructorsController');
const { validateInstructor } = require('../middlewares/validateData');
const adminAccess = require("../middlewares/adminAccess");
const protect = require("../middlewares/authMiddlware");
const router = express.Router()


router.get('/instructors', getallInstructors)

router.post('/instructors' , validateInstructor ,protect, adminAccess ,addInstructors)

router.put('/instructors/:id',protect, adminAccess, updateInstructors)

router.delete('/instructors/:id',protect, adminAccess,deleteInstructors)


module.exports = router;
