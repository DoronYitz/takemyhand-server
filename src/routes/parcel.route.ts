import { Router } from "express";
import {
	createParcel,
	createParcelsFromTextFile,
	deleteParcel,
	editParcel,
	editParcelStatus,
	getDriverParcels,
	getParcel,
	getParcels,
	setParcelsDriversByLocation,
} from "../controllers/parcel.controller";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware";
import { validation } from "../middlewares/validator.middleware";
import { mongoIdPipe } from "../pipes/mongoid.pipe";

const router = Router();

// Auth Middleware
router.use(authMiddleware);

/**
 * @route   GET api/parcel/driverparcels
 * @desc    Get all parcels of requesting driver
 * @access  Drivers
 */
router.get("/driverparcels", getDriverParcels);

/**
 * @route   PATCH api/parcel/status/<id>
 * @desc    Edit parcel status
 * @access  Drivers
 */
router.patch("/status/:id", mongoIdPipe, validation, getParcel, editParcelStatus);

// Only admins
router.use(adminMiddleware);

/**
 * @route   GET api/parcel
 * @desc    Get all parcels
 * @access  Admin
 */
router.get("/", getParcels);

/**
 * @route   GET api/parcel/<id>
 * @desc    Get parcel by id
 * @access  Admin
 */
router.get("/:id", mongoIdPipe, validation, getParcel, (req: any, res: any) => {
	res.json(req.parcel);
});

/**
 * @route   POST api/parcel
 * @desc    Create parcel
 * @access  Admin
 */
router.post("/", createParcel);

/**
 * @route   POST api/parcel/textFileHandler
 * @desc    Create parcels from text file, return array of created parcels
 * @access  Admin
 */
router.post("/textFileHandler", createParcelsFromTextFile);

/**
 * @route   PATCH api/parcel/setdrivers
 * @desc    Split parcels between all drivers by location
 * @access  Admin
 */
router.patch("/setdrivers", setParcelsDriversByLocation);

/**
 * @route   PATCH api/parcel/<id>
 * @desc    Edit parcel
 * @access  Admin
 */
router.patch("/:id", mongoIdPipe, validation, getParcel, editParcel);

/**
 * @route   DELETE api/parcel/<id>
 * @desc    Delete parcel
 * @access  Admin
 */
router.delete("/:id", mongoIdPipe, validation, getParcel, deleteParcel);

export default router;
