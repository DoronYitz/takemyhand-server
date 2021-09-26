import { Router } from "express";
import { body } from "express-validator";
import {
	createEvent,
	deleteEvent,
	editEvent,
	getEvent,
	getEvents,
} from "../controllers/event.controller";
import { validation } from "../middlewares/validator.middleware";

const router = Router();

// @route   GET api/event
// @desc    Get all events
// @access  Admin
router.get("/", getEvents);

// @route   GET api/event/<id>
// @desc    Get event by id
// @access  Admin
router.get("/:id", getEvent, (req, res) => res.json(req.event));

// @route   POST api/event/
// @desc    Create event, return event that was created
// @access  Public
router.post(
	"/",
	// [
	// 	body("full_name", "First Name is required").exists(),
	// 	body("last_name", "Last Name is required").exists(),
	// 	body("neighborhood", "Neighborhood is required").exists(),
	// 	body("first_name", "Please enter only letters").isAlpha(),
	// 	body("last_name", "Please enter only letters").isAlpha(),
	// 	body("neighborhood", "Please enter only letters").isNumeric(),
	// ],
	validation,
	createEvent
);

// @route   PATCH api/event/<id>
// @desc    Edit event, return event that was editted
// @access  Private
router.patch("/:id", getEvent, editEvent);

// @route   DELETE api/event/<id>
// @desc    Delete event
// @access  Private
router.delete("/:id", getEvent, deleteEvent);

export default router;
