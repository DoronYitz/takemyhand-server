import { Router } from "express";
import { getMessages } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

/**
 * @route   GET api/messages
 * @desc    Get all messages
 * @access  Admin
 */
router.get("/", getMessages);

export default router;
