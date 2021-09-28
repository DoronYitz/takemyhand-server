import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { RequestHandler } from "express";
import { Payload } from "../models/payload.model";
import CustomError from "../shared/error";
import { StatusCodes } from "http-status-codes";
import { Config } from "../config";
import Volunteer from "../models/volunteer.model";

/**
 * Gets according to the token
 */
export const getUser: RequestHandler = async (req, res, next) => {
	try {
		// Get the user without the password
		const volunteer = await Volunteer.findById(req.user.userId);
		res.json(volunteer);
	} catch (err) {
		next(err);
	}
};

export const loginUser: RequestHandler = async (req, res, next) => {
	try {
		const { phone, password } = req.body;

		// Check if phone exist
		let volunteer = await Volunteer.findOne({ phone });
		if (!volunteer) {
			throw new CustomError(
				StatusCodes.BAD_REQUEST,
				"Phone and password combination is incorrect."
			);
		}

		// Delete it after test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		const salt = await bcrypt.genSalt(12);
		const hashed = await bcrypt.hash(Config.SECRET, salt);

		// Verify the password
		const isMatch = await bcrypt.compare(password, hashed);
		if (!isMatch) {
			throw new CustomError(
				StatusCodes.BAD_REQUEST,
				"Phone and password combination is incorrect."
			);
		}

		// Return JWT token
		const payload: Payload = {
			userId: volunteer.id,
			role: "admin",
		};

		const token = jwt.sign(payload, Config.JWT_SECRET, { expiresIn: Config.JWT_EXPERATION });
		res.setHeader(
			"Set-Cookie",
			cookie.serialize("token", token, {
				httpOnly: true,
				maxAge: 323341,
				sameSite: true,
			})
		);
		res.json({ token });
	} catch (err) {
		next(err);
	}
};
