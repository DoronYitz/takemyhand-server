import { Config } from "../config";

import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

import { Event, IEvent } from "../models/event.model";
import CustomError from "../shared/error";
import { Volunteer } from "../models/volunteer.model";
import { Parcel } from "../models/parcel.model";

/**
 * Get all events
 */
export const getEvents: RequestHandler = async (req, res, next) => {
  try {
    // Getting all events
    const events = await Event.find().select("-secret");
    return res.json(events);
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
    const event: Partial<IEvent> = {
      title,
      category,
      date,
      description,
      secret: hashed,
    };

    // Create document of new event
    const newEvent = new Event(event);
    await newEvent.save();

    // Remove secret
    delete event.secret;

    return res.status(StatusCodes.CREATED).json(newEvent);
  } catch (error) {
    next(error);
  }
};

/**
 * Get event by id
 */
export const getEvent: RequestHandler = async (req, res, next) => {
  try {
    // Getting id from params
    const { id } = req.params;

    // Finding one
    const eventFound = await Event.findById(id).select("-secret");

    // Not found
    if (!eventFound) {
      throw new CustomError(StatusCodes.NOT_FOUND, `Event not found`);
    }
    req.event = eventFound;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Get Active event
 */
export const getActiveEvent: RequestHandler = async (req, res, next) => {
  try {
    const activeEvent = await Event.findOne({ active: true }).select("-secret");

    // Not found
    if (!activeEvent) {
      throw new CustomError(StatusCodes.NOT_FOUND, `Active event not found`);
    }
    return res.json(activeEvent);
  } catch (err) {
    next(err);
  }
};

/**
 * Edit event
 */
export const editEvent: RequestHandler = async (req, res, next) => {
  try {
    const { title, category, description, date, active } = req.body;
    const event = req.event;

    // If trying to edit event activeness, we will check there only one active
    if (active) {
      const activeEvent = await Event.findOne({ active: true }).select("-secret");
      if (activeEvent && activeEvent.id !== event.id) {
        throw new CustomError(StatusCodes.CONFLICT, `רק אירוע אחד יכול להיות אקטיבי בכל עת`);
      }
    }

    // Set new properties
    event.title = title;
    event.category = category;
    event.description = description;
    event.active = active;
    event.date = new Date(date);

    // Saving it
    await event.save();
    return res.json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit event secret
 */
export const editEventSecret: RequestHandler = async (req, res, next) => {
  try {
    const { secret } = req.body;
    const event = req.event;

    // Encrypt the secret
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(secret, salt);

    // Set secret and save
    event.secret = hashed;
    await event.save();

    // Remove event secret hash
    delete event.secret;

    // Return
    return res.json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete event by id
 */
export const deleteEvent: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    return res.json(deletedEvent);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all volunteers and pacrcels besides admins
 */
export const deleteEventData: RequestHandler = async (req, res, next) => {
  try {
    // Get all volunteers
    const volunteers = await Volunteer.find();
    for (const volunteer of volunteers) {
      // Skip it its an admin
      if (Config.ADMINS.includes(volunteer.phone)) {
        continue;
      }
      // Remove
      await volunteer.remove();
    }

    // Delete all parcels
    await Parcel.deleteMany();
    return res.json({ message: "Data Deleted" });
  } catch (err) {
    next(err);
  }
};
