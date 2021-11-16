import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { Payload } from "../models/payload.model";
import CustomError from "../shared/error";
import { StatusCodes } from "http-status-codes";
import { Config } from "../config";
import { Volunteer } from "../models/volunteer.model";
import { Event } from "../models/event.model";
import { RefreshToken } from "../models/refresh-token.model";

export const login: RequestHandler = async (req, res, next) => {
	try {
		const { phone, password } = req.body;

		// Handle admin auth
		const isAdminPhone: boolean = Config.ADMINS.includes(phone);
		if (isAdminPhone && (await bcrypt.compare(password, Config.PASSWORD))) {
			return adminLogin(req, res, next);
		}

		// Check if phone exist on any volunteer driver
		let driver = await Volunteer.findOne({ phone, driver: true });
		if (!driver) {
			throw new CustomError(
				StatusCodes.UNAUTHORIZED,
				"קומבינציית מס' הפלאפון והסיסמא איננה נכונה"
			);
		}

		// Get active event secret
		let activeEvent = await Event.findOne({ active: true });
		if (!activeEvent) {
			throw new CustomError(
				StatusCodes.UNAUTHORIZED,
				"קומבינציית מס' הפלאפון והסיסמא איננה נכונה"
			);
		}

		// Verify the password
		const isMatch = await bcrypt.compare(password, activeEvent.secret);
		if (!isMatch) {
			throw new CustomError(
				StatusCodes.UNAUTHORIZED,
				"קומבינציית מס' הפלאפון והסיסמא איננה נכונה"
			);
		}

		// Return JWT token
		const payload: Payload = {
			userId: driver.id,
		};
		const token = jwt.sign(payload, Config.JWT_SECRET, { expiresIn: Config.JWT_EXPERATION });
		const refreshToken = await RefreshToken.createToken(driver);

		let authorities: Array<string> = ["driver"];

		res.status(200).json({
			id: driver._id,
			username: driver.full_name,
			roles: authorities,
			accessToken: token,
			refreshToken: refreshToken,
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Refresh Token
 */
export const refreshToken: RequestHandler = async (req, res, next) => {
	try {
		const { refreshToken: requestToken } = req.body;

		let refreshToken = await RefreshToken.findOne({ token: requestToken });

		if (!refreshToken) {
			res.status(403).json({ message: "Refresh token not found" });
			return;
		}

		// Checking the experation of the refresh token
		if (RefreshToken.verifyExpiration(refreshToken)) {
			// Remove from db.
			await RefreshToken.findByIdAndRemove(refreshToken._id);
			res.status(403).json({
				message: "Refresh token was expired. Please make a new signin request",
			});
			return;
		}

		// If refresh token isnt expired.
		const payload: Payload = {
			userId: refreshToken.user._id,
		};

		// Create a new access token
		const newAccessToken = jwt.sign(payload, Config.JWT_SECRET, {
			expiresIn: Config.JWT_EXPERATION,
		});

		// return access token and refresh token
		return res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: refreshToken.token,
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Refresh Token
 */
export const logout: RequestHandler = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;

		// Check if there is refresh token
		if (!refreshToken) {
			return res.status(403).json({ message: "Refresh Token is required!" });
		}

		// Remove the refresh token from db
		await RefreshToken.findOneAndRemove({ token: refreshToken });

		// return access token and refresh token
		return res.status(200).json({ message: "Deleted" });
	} catch (err) {
		next(err);
	}
};

const adminLogin: RequestHandler = async (req, res, next) => {
	try {
		// Check if phone exist on any volunteer
		const { phone } = req.body;
		let volunteer = await Volunteer.findOne({ phone });
		if (!volunteer) {
			throw new CustomError(
				StatusCodes.UNAUTHORIZED,
				"קומבינציית מס' הפלאפון והסיסמא איננה נכונה"
			);
		}

		// Return JWT token
		const payload: Payload = {
			userId: volunteer.id,
		};
		const token = jwt.sign(payload, Config.JWT_SECRET, { expiresIn: Config.JWT_EXPERATION });
		const refreshToken = await RefreshToken.createToken(volunteer);

		let authorities: Array<string> = ["driver", "admin"];

		res.status(200).json({
			id: volunteer._id,
			username: volunteer.full_name,
			roles: authorities,
			accessToken: token,
			refreshToken: refreshToken,
		});
	} catch (err) {
		next(err);
	}
};
