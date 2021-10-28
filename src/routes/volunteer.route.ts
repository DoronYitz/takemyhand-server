import { Router } from "express";
import {
	createVolunteer,
	deleteVolunteer,
	editVolunteer,
	getDrivers,
	getVolunteer,
	getVolunteers,
} from "../controllers/volunteer.controller";
import { validation } from "../middlewares/validator.middleware";
import { mongoIdPipe } from "../pipes/mongoid.pipe";
import { createVolunteerPipe } from "../pipes/volunteer.pipe";

const router = Router();

/**
 * @route   GET api/volunteer
 * @desc    Get all volunteers
 * @access  Admin
 */
router.get("/", getVolunteers);

// @route   GET api/volunteer/drivers
// @desc    Get all volunteers
// @access  Admin
router.get("/drivers", getDrivers);

/**
 * @route   GET api/volunteer/<id>
 * @desc    Get volunteer by id
 * @access  Admin
 */
router.get("/:id", mongoIdPipe, validation, getVolunteer, (req: any, res: any) =>
	res.json(req.volunteer)
);

/**
 * @route   POST api/volunteer/
 * @desc    Create volunteer, return volunteer that was created
 * @access  Public
 */
router.post("/", createVolunteerPipe, validation, createVolunteer);

/**
 * @route   PATCH api/volunteer/<id>
 * @desc    Edit volunteer, return volunteer that was editted
 * @access  Private
 */
router.patch("/:id", mongoIdPipe, validation, getVolunteer, editVolunteer);

/**
 * @route   DELETE api/volunteer/<id>
 * @desc    Delete volunteer
 * @access  Admin
 */
router.delete("/:id", mongoIdPipe, validation, getVolunteer, deleteVolunteer);

export default router;
