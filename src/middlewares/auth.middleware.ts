import { Config } from "../config";

import { RequestHandler } from "express";
import authJwt from "express-jwt";
import { StatusCodes } from "http-status-codes";

import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";

/**
 * Express-jwt middleware that extract payload into req.user in case JWT is verified.
 */
export const authMiddleware = authJwt({ secret: Config.JWT_SECRET, algorithms: ["HS256"] });

/**
 * Admin middleware that checks if the user is an admin
 */
export const adminMiddleware: RequestHandler = async (req, res, next) => {
	try {
		const user = await Volunteer.findById(req.user.userId);
		if (!user || !Config.ADMINS.includes(user.phone)) {
			throw new CustomError(StatusCodes.FORBIDDEN, "Access forbidden");
		}
		next();
	} catch (err) {
		next(err);
	}
};
