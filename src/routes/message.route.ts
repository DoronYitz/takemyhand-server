import { Router } from "express";

import { getMessages } from "../controllers/message.controller";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Only Admins
 */
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @route   GET api/messages
 * @desc    Get all messages
 * @access  Admin
 */
router.get("/", getMessages);

export default router;
