import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Volunteer from "../models/volunteer.model";

export const getVolunteers: RequestHandler = async (req, res, next) => {
	try {
		// Getting all volunteers
		const volunteers = await Volunteer.find();
		res.json(volunteers);
	} catch (error) {
		next(error);
	}
};

export const createVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new volunteer
		const newVolunteer = new Volunteer({ ...req.body });
		await newVolunteer.save();
		res.status(StatusCodes.CREATED).json(newVolunteer);
	} catch (error) {
		next(error);
	}
};

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

export const editVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Updating fields
		req.volunteer.first_name = req.body.first_name;
		req.volunteer.last_name = req.body.last_name;
		req.volunteer.neighborhood = req.body.neighborhood;
		await req.volunteer.save();
		res.json(req.volunteer);
	} catch (error) {
		next(error);
	}
};

export const deleteVolunteer: RequestHandler = async (req, res, next) => {
	try {
		// Delete
		await req.volunteer.delete();
		res.json({ message: "Volunteer Deleted" });
	} catch (error) {
		next(error);
	}
};
