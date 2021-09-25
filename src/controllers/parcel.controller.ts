import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Parcel from "../models/parcel.model";
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
		req.parcel.volunteer_id = req.body.volunteer_id;
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
