import { RequestHandler } from "express";
import authJwt from "express-jwt";
import { StatusCodes } from "http-status-codes";
import { Config } from "../config";
import CustomError from "../shared/error";

export const authMiddleware = authJwt({ secret: Config.JWT_SECRET, algorithms: ["HS256"] });

export const adminMiddleware: RequestHandler = (req, res, next) => {
	try {
		if (req.user.role !== "Admin") {
			throw new CustomError(StatusCodes.FORBIDDEN, "Access forbidden");
		}
		next();
	} catch (err) {
		next(err);
	}
};
