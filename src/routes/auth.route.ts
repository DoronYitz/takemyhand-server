import { Router } from "express";
import { body } from "express-validator";
import { getUser, login, logout, refreshToken } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validation } from "../middlewares/validator.middleware";

const router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", authMiddleware, getUser);

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post(
	"/login",
	[
		body("phone")
			.notEmpty()
			.withMessage("Phone is required")
			.bail()
			.isNumeric()
			.withMessage("Phone must contain only numbers")
			.bail()
			.isLength({ min: 10, max: 10 })
			.withMessage("Invalid phone number"),
		body("password")
			.notEmpty()
			.withMessage("Password is required")
			.bail()
			.isString()
			.withMessage("Password must be a string"),
	],
	validation,
	login
);

router.post("/refreshtoken", refreshToken);

router.post("/logout", logout);

export default router;
