import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";
import { getCoordinates } from "./geocoding.controller";

// Get all volunteer
export const getVolunteers: RequestHandler = async (req, res, next) => {
	try {
		// Getting all volunteers
		const volunteers = await Volunteer.find().select("-lng -lat");
		res.json(volunteers);
	} catch (error) {
		next(error);
	}
};

// Get all drivers
export const getDrivers: RequestHandler = async (req, res, next) => {
	try {
		// Getting all drivers
		const drivers = await Volunteer.find({ driver: true }).select("-lng -lat");
		res.json(drivers);
	} catch (error) {
		next(error);
	}
};

// Create volunteer
export const createVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new volunteer
		const { full_name, phone, num_of_people, address } = req.body;

		// Check if volunteer already exist
		let volunteer = await Volunteer.findOne({ phone });
		if (volunteer) {
			throw new CustomError(StatusCodes.BAD_REQUEST, "Volunteer already exists");
		}

		// Getting lat and lng of the volunteer address
		const { lat, lng } = await getCoordinates(address);

		// Create a new volunteer in db
		const newVolunteer = new Volunteer({ full_name, phone, num_of_people, lat, lng, address });
		await newVolunteer.save();
		res.status(StatusCodes.CREATED).json(newVolunteer);
	} catch (error) {
		next(error);
	}
};

// Get volunteer by id
export const getVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Getting id from params
		const id = req.params.id;
		// Finding one
		const volunteerFound = await Volunteer.findById(id).select("-lng -lat");
		if (!volunteerFound) {
			throw new Error(`Volunteer Not Found`);
		}
		req.volunteer = volunteerFound;
		next();
	} catch (error) {
		next(error);
	}
};

// Edit volunteer by id
export const editVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Get volunteer
		const volunteer = req.volunteer;

		// Updating fields
		const { full_name, phone, num_of_people, driver, address } = req.body;
		volunteer.full_name = full_name;
		volunteer.phone = phone;
		volunteer.num_of_people = num_of_people;
		volunteer.driver = driver;

		// Handle address edit if needed
		if (volunteer.address !== address) {
			const { lat, lng } = await getCoordinates(address);
			volunteer.address = address;
			volunteer.lat = lat;
			volunteer.lng = lng;
		}

		await volunteer.save();
		res.json(volunteer);
	} catch (error) {
		next(error);
	}
};

// Delete volunteer by id
export const deleteVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Delete
		await req.volunteer.delete();
		res.json({ message: "Volunteer Deleted" });
	} catch (error) {
		next(error);
	}
};
