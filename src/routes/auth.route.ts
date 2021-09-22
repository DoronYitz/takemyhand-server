import { Router } from "express";
import { body } from "express-validator";
import { getUser, loginUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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
		body("email", "Please include a valid email").isEmail(),
		body("password", "Password is required").exists(),
	],
	loginUser
);

export default router;
