import { Router } from "express";
import { body, param, query } from "express-validator";
import {
	createEvent,
	deleteEvent,
	editEvent,
	editEventSecret,
	getActiveEvent,
	getEvent,
	getEvents,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validation } from "../middlewares/validator.middleware";

const router = Router();

router.use(authMiddleware);

// @route   GET api/event
// @desc    Get all events
// @access  Admin
router.get("/", getEvents);

// @route   GET api/event/active
// @desc    Get active event
// @access  Admin
router.get("/active", getActiveEvent);

// @route   POST api/event/
// @desc    Create event, return event that was created
// @access  Public
router.post(
	"/",
	[
		body("title")
			.notEmpty()
			.withMessage("title is required")
			.bail()
			.isString()
			.withMessage("title must be a string")
			.bail(),
		body("category")
			.notEmpty()
			.withMessage("category is required")
			.bail()
			.isString()
			.withMessage("category must be a string")
			.bail(),
		body("date")
			.notEmpty()
			.withMessage("date is required")
			.bail()
			.isDate()
			.withMessage("date is not a valid")
			.bail(),
		body("description")
			.notEmpty()
			.withMessage("description is required")
			.bail()
			.isString()
			.withMessage("description must be a string")
			.bail(),
		body("secret")
			.notEmpty()
			.withMessage("secret is required")
			.bail()
			.isString()
			.withMessage("secret must be a string")
			.bail()
			.isStrongPassword({
				minLength: 8,
				minNumbers: 1,
				minUppercase: 1,
				minLowercase: 1,
				minSymbols: 1,
			})
			.isLength({ min: 8, max: 8 })
			.withMessage(
				"secret pattern isnt valid, please make sure secret contain 1 Upper & Lower letter, number and symbol."
			),
	],
	validation,
	createEvent
);

// @route   PATCH api/event/<id>
// @desc    Edit event, return event that was editted
// @access  Private
router.patch("/:id", [param("id", "Not a valid _id").isMongoId()], getEvent, editEvent);

/**
 * @route PATCH api/event/secret/<id>
 * @desc Edit event's secret key, return event that was editted
 * @access Admin
 */
router.patch("/secret/:id", getEvent, editEventSecret);

// @route   DELETE api/event/<id>
// @desc    Delete event
// @access  Private
router.delete("/:id", getEvent, deleteEvent);

export default router;
