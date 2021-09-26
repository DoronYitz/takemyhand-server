import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import Event from "../models/event.model";
import CustomError from "../shared/error";

export const getEvents: RequestHandler = async (req, res, next) => {
	try {
		// Getting all events
		const events = await Event.find();
		res.json(events);
	} catch (error) {
		next(error);
	}
};

export const createEvent: RequestHandler = async (req, res, next) => {
	try {
		// Create document of new event
		const newEvent = new Event({ ...req.body });
		await newEvent.save();
		res.status(StatusCodes.CREATED).json(newEvent);
	} catch (error) {
		next(error);
	}
};

export const getEvent: RequestHandler = async (req, res, next) => {
	try {
		// Getting id from params
		const id = req.params.id;
		// Finding one
		const eventFound = await Event.findById(id);
		if (!eventFound) {
			throw new CustomError(404, `Event Not Found`);
		}
		req.event = eventFound;
		next();
	} catch (error) {
		next(error);
	}
};

export const editEvent: RequestHandler = async (req, res, next) => {
	try {
		const { title, category, description, date, secret, active } = req.body;
		req.event.title = title;
		req.event.category = category;
		req.event.description = description;
		req.event.active = active;
		req.event.date = new Date(date);
		req.event.secret = secret;
		await req.event.save();
		res.json(req.event);
	} catch (error) {
		next(error);
	}
};

export const deleteEvent: RequestHandler = async (req, res, next) => {
	try {
		await req.event.delete();
		res.json({ message: "Event Deleted" });
	} catch (error) {
		next(error);
	}
};
