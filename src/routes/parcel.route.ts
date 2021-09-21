import { Router } from "express";
import { createParcel, deleteParcel, editParcel, getParcel, getParcels } from "../controllers/parcel.controller";

const router = Router();

// Find all
router.get("/", getParcels);

// Find one
router.get("/:id", getParcel, (req, res) => res.json(req.parcel));

// Create
router.post("/", createParcel);

// Edit
router.patch("/:id", getParcel, editParcel);

// Delete
router.delete("/:id", getParcel, deleteParcel);

export default router;
