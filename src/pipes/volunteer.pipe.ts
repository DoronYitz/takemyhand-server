import { body } from "express-validator";

export const createVolunteerPipe = [
	body("full_name")
		.notEmpty()
		.withMessage("full_name is required")
		.bail()
		.isAlpha()
		.withMessage("full_name can only have letters"),
	body("phone")
		.notEmpty()
		.withMessage("phone is required")
		.bail()
		.isNumeric()
		.withMessage("phone can be only letters")
		.bail()
		.isLength({ min: 10, max: 10 })
		.withMessage("Not a valid phone number"),
	body("address")
		.notEmpty()
		.withMessage("address is required")
		.bail()
		.isString()
		.withMessage("address must be a string"),
];
