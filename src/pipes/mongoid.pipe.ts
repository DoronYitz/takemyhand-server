import { param } from "express-validator";

export const mongoIdPipe = [
	param("id")
		.notEmpty()
		.withMessage("Param id is required")
		.bail()
		.isMongoId()
		.withMessage("Not a valid id"),
];
