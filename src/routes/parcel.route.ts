import { Router } from "express";
import {
	createParcel,
	createParcelsFromTextFile,
	deleteParcel,
	editParcel,
	editParcelAddress,
	getDriverParcels,
	getParcel,
	getParcels,
} from "../controllers/parcel.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validation } from "../middlewares/validator.middleware";
import { mongoIdPipe } from "../pipes/mongoid.pipe";

const router = Router();

// Auth Middleware
router.use(authMiddleware);

/**
 * @route   GET api/parcel
 * @desc    Get all parcels
 * @access  Private
 */
router.get("/", getParcels);

/**
 * @route   GET api/parcel/driverparcels
 * @desc    Get all parcels of requesting driver
 * @access  Drivers
 */
router.get("/driverparcels", getDriverParcels);

/**
 * @route   GET api/parcel/<id>
 * @desc    Get parcel by id
 * @access  Private
 */
router.get("/:id", mongoIdPipe, validation, getParcel, (req: any, res: any) => {
	res.json(req.parcel);
});

/**
 * @route   POST api/parcel
 * @desc    Create parcel
 * @access  Private
 */
router.post("/", createParcel);

/**
 * @route   POST api/parcel/textFileHandler
 * @desc    Create parcels from text file, return array of created parcels
 * @access  Private
 */
router.post("/textFileHandler", createParcelsFromTextFile);

// @route   PATCH api/parcel/<id>
// @desc    Edit parcel
// @access  Private
router.patch("/:id", mongoIdPipe, validation, getParcel, editParcel);

router.patch("/address/:id", mongoIdPipe, validation, getParcel, editParcelAddress);

/**
 * @route   DELETE api/parcel/<id>
 * @desc    Delete parcel
 * @access  Admin
 */
router.delete("/:id", mongoIdPipe, validation, getParcel, deleteParcel);

export default router;
