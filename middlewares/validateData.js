const { body } = require("express-validator");

const courseValidationRules = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("originalPrice").optional().isNumeric().withMessage("Original price must be a number"),
    body("bubbles").optional().isArray().withMessage("Bubbles must be an array"),
    body("img").optional().isURL().withMessage("Image must be a valid URL"),
    body("feature").optional().isBoolean().withMessage("Feature must be true or false"),
];

module.exports = courseValidationRules;