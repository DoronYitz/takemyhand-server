import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import { Parcel } from "../models/parcel.model";
import CustomError from "../shared/error";

export const getParcels: RequestHandler = async (req, res, next) => {
	try {
		// Getting all parcels
		const parcels = await Parcel.find().populate("volunteer");
		res.json(parcels);
	} catch (error) {
		next(error);
	}
};

export const createParcel: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new parcel
		const newParcel = new Parcel({ ...req.body });
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
			throw new CustomError(400, `File not found`);
		}
		const fileBuffer: Buffer = textFile.data;
		const fileData = fileBuffer.toString("utf-8");
		if (!fileData) {
			throw new CustomError(400, `Empty file`);
		}

		const splittedAddresses = fileData.split("\r\n");
		const parcels = splittedAddresses
			.filter((x) => x)
			.map((x) => {
				return { address: x };
			});

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
			throw new CustomError(404, `Parcel Not Found`);
		}
		req.parcel = parcelFound;
		next();
	} catch (error) {
		next(error);
	}
};

export const editParcel: RequestHandler = async (req, res, next) => {
	try {
		req.parcel.for = req.body.for;
		req.parcel.arrived = req.body.arrived;
		req.parcel.volunteer = req.body.volunteer;
		await req.parcel.save();
		res.json(req.parcel);
	} catch (error) {
		next(error);
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
