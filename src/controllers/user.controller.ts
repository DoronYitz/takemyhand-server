import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { Config } from "../config";
import { Payload } from "../models/payload.model";
import User from "../models/user.model";
import CustomError from "../shared/error";

export const createUser: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		// Check if user already exist
		let user = await User.findOne({ email });
		if (user) {
			throw new CustomError(StatusCodes.BAD_REQUEST, "Email already exists");
		}

		// Create user with hashed password
		const salt = await bcrypt.genSalt(12);
		const hashed = await bcrypt.hash(password, salt);
		const userFields = {
			email,
			password: hashed,
		};
		user = new User(userFields);

		// Save into database
		await user.save();

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
