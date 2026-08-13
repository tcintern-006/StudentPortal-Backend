const express = require('express');
const { getallInstructors, addInstructors, updateInstructors, deleteInstructors } = require('../controllers/instructorsController');
const { validateInstructor } = require('../middlewares/validateData');

const router = express.Router()


router.get('/instructors', getallInstructors)

router.post('/instructors' , validateInstructor ,addInstructors)

router.put('/instructors/:id', updateInstructors)

router.delete('/instructors/:id', deleteInstructors)


module.exports = router;