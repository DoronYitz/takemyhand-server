import { Router } from "express";
import { createVolunteer, deleteVolunteer, editVolunteer, getVolunteer, getVolunteers } from "../controllers/volunteer.controller";

const router = Router();

// Find all
router.get("/", getVolunteers);

// Find one
router.get("/:id", getVolunteer, (req, res) => res.json(req.parcel));

// Create
router.post("/", createVolunteer);

// Edit
router.patch("/:id", getVolunteer, editVolunteer);

// Delete
router.delete("/:id", getVolunteer, deleteVolunteer);

export default router;
