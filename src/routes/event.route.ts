import { Router } from "express";

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
import { createEventPipe } from "../pipes/event.pipe";
import { mongoIdPipe } from "../pipes/mongoid.pipe";

const router = Router();

router.use(authMiddleware);

/**
 * @route   GET api/event
 * @desc    Get all events
 * @access  Admin
 */
router.get("/", getEvents);

/**
 * @route   GET api/event/active
 * @desc    Get active event
 * @access  Admin
 */
router.get("/active", getActiveEvent);

/**
 * @route   POST api/event/
 * @desc    Create event, return event that was created
 * @access  Admin
 */
router.post("/", createEventPipe, validation, createEvent);

/**
 * @route   PATCH api/event/<id>
 * @desc    Edit event, return event that was editted
 * @access  Admin
 */
router.patch("/:id", mongoIdPipe, validation, getEvent, editEvent);

/**
 * @route PATCH api/event/secret/<id>
 * @desc Edit event's secret key, return event that was editted - secret is omitted
 * @access Admin
 */
router.patch("/secret/:id", mongoIdPipe, getEvent, editEventSecret);

/**
 * @route   DELETE api/event/<id>
 * @desc    Delete event
 * @access  Admin
 */
router.delete("/:id", mongoIdPipe, getEvent, deleteEvent);

export default router;
