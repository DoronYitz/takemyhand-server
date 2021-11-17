import { Config } from "../config";

import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { Event, IEvent } from "../models/event.model";
import CustomError from "../shared/error";
import { Volunteer } from "../models/volunteer.model";
import { Parcel } from "../models/parcel.model";

export const getEvents: RequestHandler = async (req, res, next) => {
	try {
		// Getting all events
		const events = await Event.find().select("-secret");
		res.json(events);
	} catch (error) {
		next(error);
	}
};

export const createEvent: RequestHandler = async (req, res, next) => {
	try {
		// Extract body
		const { title, category, date, description, secret } = req.body;

		// Encrypt the secret
		const salt = await bcrypt.genSalt(12);
		const hashed = await bcrypt.hash(secret, salt);

		// Create new event obj
		const event: IEvent = {
			title,
			category,
			date,
			description,
			secret: hashed,
		};

		// Create document of new event
		const newEvent = new Event(event);
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
		const eventFound = await Event.findById(id).select("-secret");
		if (!eventFound) {
			throw new CustomError(StatusCodes.NOT_FOUND, `Event not found`);
		}
		req.event = eventFound;
		next();
	} catch (error) {
		next(error);
	}
};

export const getActiveEvent: RequestHandler = async (req, res, next) => {
	try {
		const activeEvent = await Event.findOne({ active: true }).select("-secret");
		if (!activeEvent) {
			throw new CustomError(StatusCodes.NOT_FOUND, `Active event not found`);
		}
		res.json(activeEvent);
	} catch (err) {
		next(err);
	}
};

export const editEvent: RequestHandler = async (req, res, next) => {
	try {
		const { title, category, description, date, active } = req.body;
		const event = req.event;

		// If trying to edit event activeness, we will check there only one active
		if (active) {
			const activeEvent = await Event.findOne({ active: true });
			if (activeEvent && activeEvent.id !== event.id) {
				throw new CustomError(StatusCodes.CONFLICT, `רק אירוע אחד יכול להיות אקטיבי בכל עת`);
			}
		}
		event.title = title;
		event.category = category;
		event.description = description;
		event.active = active;
		event.date = new Date(date);
		await event.save();
		res.json(event);
	} catch (error) {
		next(error);
	}
};

export const editEventSecret: RequestHandler = async (req, res, next) => {
	try {
		const { secret } = req.body;
		const event = req.event;

		// Encrypt the secret
		const salt = await bcrypt.genSalt(12);
		const hashed = await bcrypt.hash(secret, salt);

		event.secret = hashed;
		await event.save();
		delete event.secret;
		res.json(event);
	} catch (err) {
		next(err);
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

export const deleteEventData: RequestHandler = async (req, res, next) => {
	try {
		const volunteers = await Volunteer.find();
		for (const volunteer of volunteers) {
			if (Config.ADMINS.includes(volunteer.phone)) {
				continue;
			}
			await volunteer.remove();
		}
		await Parcel.deleteMany();
		res.json({ message: "Data Deleted" });
	} catch (err) {
		next(err);
	}
};
