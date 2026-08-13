const { body } = require("express-validator");

const courseValidationRules = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required")
        .isNumeric().withMessage("Price must be a number"),
    body("original_price").notEmpty().withMessage("Original price is required")
        .isNumeric().withMessage("Original price must be a number"),
    body("img").trim().notEmpty().withMessage("Image is required")
        .isURL().withMessage("Image must be a valid URL"),
    body("bubbles").optional().isArray().withMessage("Bubbles must be an array"),
    body("feature").optional().isBoolean().withMessage("Feature must be true or false"),
    body("off").optional()
];





const validateInstructor = [
    body('name').trim().notEmpty().withMessage("Name is required"),

]


const validateStudent = [
 body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Enter a valid email"),
]


const registerValadation  = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Enter a valid email"),
    body('password').isStrongPassword().withMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    ),
]

const loginValidation  = [
     body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Enter a valid email"),
    body('password').isStrongPassword().withMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    ),
]
module.exports ={validateInstructor, courseValidationRules, validateStudent,registerValadation , loginValidation};