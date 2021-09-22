import { Router } from "express";
import { body } from "express-validator";
import {
	createVolunteer,
	deleteVolunteer,
	editVolunteer,
	getVolunteer,
	getVolunteers,
} from "../controllers/volunteer.controller";
import { validation } from "../middlewares/validator.middleware";

const router = Router();

// @route   GET api/volunteer
// @desc    Get all volunteers
// @access  Admin
router.get("/", getVolunteers);

// @route   GET api/volunteer/<id>
// @desc    Get volunteer by id
// @access  Admin
router.get("/:id", getVolunteer, (req, res) => res.json(req.parcel));

// @route   POST api/volunteer/
// @desc    Create volunteer, return volunteer that was created
// @access  Public
router.post(
	"/",
	[
		body("first_name", "First Name is required").exists(),
		body("last_name", "Last Name is required").exists(),
		body("neighborhood", "Neighborhood is required").exists(),
		body("first_name", "Please enter only letters").isAlpha(),
		body("last_name", "Please enter only letters").isAlpha(),
		body("neighborhood", "Please enter only letters").isAlpha(),
	],
	validation,
	createVolunteer
);

// @route   PATCH api/volunteer/<id>
// @desc    Edit volunteer, return volunteer that was editted
// @access  Private
router.patch("/:id", getVolunteer, editVolunteer);

// @route   DELETE api/volunteer/<id>
// @desc    Delete volunteer
// @access  Private
router.delete("/:id", getVolunteer, deleteVolunteer);

export default router;
