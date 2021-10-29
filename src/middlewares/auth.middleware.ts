import { RequestHandler } from "express";
import authJwt from "express-jwt";
import { StatusCodes } from "http-status-codes";
import { Config } from "../config";
import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";

export const authMiddleware = authJwt({ secret: Config.JWT_SECRET, algorithms: ["HS256"] });

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
