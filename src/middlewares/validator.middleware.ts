import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validation: RequestHandler = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let error = errors.array().map((error) => error.msg);
			const errorString = error.join("\n");
			return res.status(StatusCodes.BAD_REQUEST).json({ message: errorString });
		}
		next();
	} catch (err) {
		next(err);
	}
};
