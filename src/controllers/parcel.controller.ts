import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import { IParcel, Parcel } from "../models/parcel.model";
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

export const createParcel: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new parcel
		const { address } = req.body;
		const { lng, lat } = await getCoordinates(address);
		const newParcel = new Parcel({ address, lat, lng });
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
		const parcels = await splittedAddresses
			.filter((x) => x)
			.map((address) => {
				// Create parcel objects
				const parcel: IParcel = { address };
				return parcel;
			});

		for (let parcel of parcels) {
			const { lat, lng } = await getCoordinates(parcel.address);
			parcel.lat = lat;
			parcel.lng = lng;
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
		req.parcel.arrived = req.body.arrived;
		req.parcel.volunteer = req.body.volunteer;
		await req.parcel.save();
		res.json(req.parcel);
	} catch (error) {
		next(error);
	}
};

export const editParcelAddress: RequestHandler = async (req, res, next) => {
	try {
		const { address } = req.body;
		const { lng, lat } = await getCoordinates(req.parcel.address);
		req.parcel.lng = lng;
		req.parcel.lat = lat;
		req.parcel.address = address;
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
