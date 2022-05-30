import { Router } from "express";

// Controller imports
import { getLast50Messages } from "../controllers/message.controller";

// Middlewares
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Only Admins
 */
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @route   GET api/messages
 * @desc    Get last 50 messages
 * @access  Admin
 */
router.get("/", getLast50Messages);

export default router;
