import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Volunteer from "../models/volunteer.model";

// Get all volunteer
export const getVolunteers: RequestHandler = async (req, res, next) => {
	try {
		// Getting all volunteers
		const volunteers = await Volunteer.find();
		res.json(volunteers);
	} catch (error) {
		next(error);
	}
};

// Create volunteer
export const createVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new volunteer
		const { full_name, phone, num_of_people } = req.body;
		const newVolunteer = new Volunteer({ full_name, phone, num_of_people });
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
		const volunteerFound = await Volunteer.findById(id);
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
		// Updating fields
		const { full_name, phone, num_of_people } = req.body;
		req.volunteer.full_name = full_name;
		req.volunteer.phone = phone;
		req.volunteer.num_of_people = num_of_people;
		await req.volunteer.save();
		res.json(req.volunteer);
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
