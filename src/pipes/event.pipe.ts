import { body } from "express-validator";

export const createEventPipe = [
	body("title")
		.notEmpty()
		.withMessage("title is required")
		.bail()
		.isString()
		.withMessage("title must be a string")
		.bail(),
	body("category")
		.notEmpty()
		.withMessage("category is required")
		.bail()
		.isString()
		.withMessage("category must be a string")
		.bail(),
	body("date")
		.notEmpty()
		.withMessage("date is required")
		.bail()
		.isDate()
		.withMessage("date is not a valid")
		.bail(),
	body("description")
		.notEmpty()
		.withMessage("description is required")
		.bail()
		.isString()
		.withMessage("description must be a string")
		.bail(),
	body("secret")
		.notEmpty()
		.withMessage("secret is required")
		.bail()
		.isString()
		.withMessage("secret must be a string")
		.bail()
		.isStrongPassword({
			minLength: 8,
			minNumbers: 1,
			minUppercase: 1,
			minLowercase: 1,
			minSymbols: 1,
		})
		.isLength({ min: 8, max: 8 })
		.withMessage(
			"secret pattern isnt valid, please make sure secret contain 1 Upper & Lower letter, number and symbol."
		),
];
