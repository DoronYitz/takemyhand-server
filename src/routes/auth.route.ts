import { Router } from "express";

// Controller imports
import { login, logout, refreshToken } from "../controllers/auth.controller";

// Middleware
import { validation } from "../middlewares/validator.middleware";

// Validation pipes
import { loginPipe, refreshTokenPipe } from "../pipes/auth.pipe";

const router = Router();

/**
 * @route   POST api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", loginPipe, validation, login);

/**
 * @route   POST api/auth/refreshtoken
 * @desc    Refresh user token
 * @access  Public
 */
router.post("/refreshtoken", refreshTokenPipe, validation, refreshToken);

/**
 * @route   POST api/auth/logout
 * @desc    Log out, delete refresh token
 * @access  Public
 */
router.post("/logout", logout);

export default router;
