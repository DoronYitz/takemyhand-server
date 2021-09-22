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
		const { first_name, last_name, neighborhood } = req.body;
		const newVolunteer = new Volunteer({ first_name, last_name, neighborhood });
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
		const { first_name, last_name, neighborhood } = req.body;
		req.volunteer.first_name = first_name;
		req.volunteer.last_name = last_name;
		req.volunteer.neighborhood = neighborhood;
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
