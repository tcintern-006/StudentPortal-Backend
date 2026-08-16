const express = require('express');
const { getallInstructors, addInstructors, updateInstructors, deleteInstructors } = require('../controllers/instructorsController');
const { validateInstructor } = require('../middlewares/validateData');
const adminAccess = require("../middlewares/adminAccess");
const router = express.Router()


router.get('/instructors', getallInstructors)

router.post('/instructors' , validateInstructor , adminAccess ,addInstructors)

router.put('/instructors/:id', adminAccess, updateInstructors)

router.delete('/instructors/:id', adminAccess,deleteInstructors)


module.exports = router;
