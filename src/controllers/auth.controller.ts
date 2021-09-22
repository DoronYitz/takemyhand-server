import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { Payload } from "../models/payload.model";
import User from "../models/user.model";
import CustomError from "../shared/error";
import { StatusCodes } from "http-status-codes";
import { Config } from "../config";

export const getUser: RequestHandler = async (req, res, next) => {
	try {
		// Get the user without the password
		const user = await User.findById(req.user.userId).select("-password");
		res.json(user);
	} catch (err) {
		next(err);
	}
};

export const loginUser: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Check if email exist
		let user = await User.findOne({ email });
		if (!user) {
			throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid Credentials");
		}

		// Verify the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid Credentials");
		}
		// Return JWT token
		const payload: Payload = {
			userId: user.id,
		};
		const token = jwt.sign(payload, Config.JWT_SECRET, { expiresIn: Config.JWT_EXPERATION });
		res.json({ token });
	} catch (err) {
		next(err);
	}
};
