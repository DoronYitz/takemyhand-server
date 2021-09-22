import { Router } from "express";
import { body } from "express-validator";
import { createUser } from "../controllers/user.controller";
import { validation } from "../middlewares/validator.middleware";

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
	"/",
	[
		body("email", "Please include a valid email").isEmail(),
		body("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
	],
	validation,
	createUser
);

export default router;
