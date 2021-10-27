import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import CustomError from "../shared/error";

export const validation: RequestHandler = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let error = errors.array().map((error) => error.msg);
			const errorString = error.join("\n");
			console.log(errorString);
			throw new CustomError(StatusCodes.BAD_REQUEST, errorString);
			return res.status(StatusCodes.BAD_REQUEST).json({ errors: error });
		}
		next();
	} catch (err) {
		next(err);
	}
};
