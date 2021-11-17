import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import { io } from "..";
import { Message } from "../models/message.model";
import { IParcel, Parcel } from "../models/parcel.model";
import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";
import { getCoordinates } from "./geocoding.controller";

export const getParcels: RequestHandler = async (req, res, next) => {
	try {
		// Getting all parcels
		const parcels = await Parcel.find().populate("volunteer");
		res.json(parcels);
	} catch (error) {
		next(error);
	}
};

export const getDriverParcels: RequestHandler = async (req, res, next) => {
	try {
		const driver = req.user;
		// Getting all driver's parcels
		const driver_parcels = await Parcel.find({ volunteer: driver.userId });
		res.json(driver_parcels);
	} catch (error) {
		next(error);
	}
};

export const createParcel: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new parcel
		const { address } = req.body;
		const coordiantes = await getCoordinates(address);
		const newParcel = new Parcel({
			address,
			location: { type: "Point", coordinates: coordiantes },
		});
		await newParcel.save();
		res.status(StatusCodes.CREATED).json(newParcel);
	} catch (error) {
		next(error);
	}
};

export const createParcelsFromTextFile: RequestHandler = async (req, res, next) => {
	try {
		const textFile: UploadedFile | any = req?.files?.textFile;
		if (!textFile) {
			throw new CustomError(StatusCodes.BAD_REQUEST, `File not found`);
		}
		const fileBuffer: Buffer = textFile.data;
		const fileData = fileBuffer.toString("utf-8");
		if (!fileData) {
			throw new CustomError(StatusCodes.BAD_REQUEST, `Empty file`);
		}

		const splittedAddresses = fileData.split("\r\n");
		const parcels = await splittedAddresses
			.filter((x) => x)
			.map((address) => {
				// Create parcel objects
				const parcel: IParcel = { address };
				return parcel;
			});

		for (let parcel of parcels) {
			const coordinates = await getCoordinates(parcel.address);
			parcel.location = { type: "Point", coordinates };
		}
		console.log(parcels);

		const parcelsDocumnets = await Parcel.insertMany(parcels);
		res.status(StatusCodes.CREATED).json(parcelsDocumnets);
	} catch (error) {
		next(error);
	}
};

export const getParcel: RequestHandler = async (req, res, next) => {
	try {
		// Getting id from params
		const id = req.params.id;
		// Finding one
		const parcelFound = await Parcel.findById(id).populate("volunteer");
		if (!parcelFound) {
			throw new CustomError(StatusCodes.NOT_FOUND, `Parcel Not Found`);
		}
		req.parcel = parcelFound;
		next();
	} catch (error) {
		next(error);
	}
};

export const editParcelStatus: RequestHandler = async (req, res, next) => {
	try {
		if (req.parcel.arrived !== req.body.arrived) {
			const partialText = req.body.arrived ? `הגיעה ליעד` : `שונתה כלא הגיעה ליעד`;
			const message = {
				arrived: req.body.arrived,
				content: `חבילה בעלת כתובת "${req.parcel.address}" ${partialText}`,
				date: new Date(),
			};
			const newMessage = new Message(message);
			await newMessage.save();
			io.emit("message", message);
		}
		req.parcel.arrived = req.body.arrived;
		await req.parcel.save();
		res.json(req.parcel);
	} catch (error) {
		next(error);
	}
};

export const editParcel: RequestHandler = async (req, res, next) => {
	try {
		req.parcel.volunteer = req.body.volunteer;
		const { address } = req.body;
		// If address was changed
		if (address !== req.parcel.address) {
			const coordinates = await getCoordinates(address);
			req.parcel.location = { type: "Point", coordinates };
			req.parcel.address = address;
		}
		await req.parcel.save();
		res.json(req.parcel);
	} catch (err) {
		next(err);
	}
};

export const deleteParcel: RequestHandler = async (req, res, next) => {
	try {
		await req.parcel.delete();
		res.json({ message: "Parcel Deleted" });
	} catch (error) {
		next(error);
	}
};

export const setParcelsDriversByLocation: RequestHandler = async (req, res, next) => {
	try {
		const parcels = await Parcel.find();
		if (!parcels.length) {
			throw new CustomError(404, "אין חבילות לחלק");
		}

		// For each parcel, find its closest driver
		for (let parcel of parcels) {
			const [lng, lat] = parcel.location.coordinates;
			const nearestDriver = await Volunteer.findOne({
				driver: true,
				location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [lng, lat],
						},
					},
				},
			});
			if (!nearestDriver) {
				throw new CustomError(404, "אין נהגים במערכת");
			}
			parcel.volunteer = nearestDriver;
			await parcel.save();
		}
		res.json(parcels);
	} catch (err) {
		next(err);
	}
};
