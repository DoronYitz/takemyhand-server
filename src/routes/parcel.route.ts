import { Router } from "express";
import {
	createParcel,
	createParcelsFromTextFile,
	deleteParcel,
	editParcel,
	getParcel,
	getParcels,
} from "../controllers/parcel.controller";

const router = Router();

/**
 * @route   GET api/parcel
 * @desc    Get all parcels
 * @access  Private
 */
router.get("/", getParcels);

// @route   GET api/parcel/<id>
// @desc    Get parcel by id
// @access  Private
router.get("/:id", getParcel, (req, res) => res.json(req.parcel));

// @route   POST api/parcel
// @desc    Create parcel
// @access  Private
router.post("/", createParcel);

// @route   POST api/parcel/textFileHandler
// @desc    Create parcel from text file
// @access  Private
router.post("/textFileHandler", createParcelsFromTextFile);

// @route   PATCH api/parcel/<id>
// @desc    Edit parcel
// @access  Private
router.patch("/:id", getParcel, editParcel);

// @route   DELETE api/parcel/<id>
// @desc    Delete parcel
// @access  Admin
router.delete("/:id", getParcel, deleteParcel);

export default router;
