import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";
import { getCoordinates } from "./geocoding.controller";

/**
 * Get all volunteer
 */
export const getVolunteers: RequestHandler = async (req, res, next) => {
  try {
    // Getting all volunteers without location
    const volunteers = await Volunteer.find().select("-location").lean();
    return res.json(volunteers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all drivers
 */
export const getDrivers: RequestHandler = async (req, res, next) => {
  try {
    // Getting all drivers
    const drivers = await Volunteer.find({ driver: true }).select("-location").lean();
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

/**
 * Create volunteer
 */
export const createVolunteer: RequestHandler = async (req, res, next) => {
  try {
    // Create document of new volunteer
    const { full_name, phone, address } = req.body;

    // Check if volunteer already exist
    let volunteer = await Volunteer.findOne({ phone });
    if (volunteer) {
      throw new CustomError(StatusCodes.CONFLICT, "המתנדב קיים במערכת");
    }

    // Getting lat and lng of the volunteer address
    const coordiantes = await getCoordinates(address);

    // Create a new volunteer in db
    const newVolunteer = new Volunteer({
      full_name,
      phone,
      location: { type: "Point", coordinates: coordiantes },
      address,
    });
    await newVolunteer.save();

    // Remove its location
    delete newVolunteer.location;

    return res.status(StatusCodes.CREATED).json(newVolunteer);
  } catch (error) {
    next(error);
  }
};

/**
 * Get volunteer by id
 */
export const getVolunteer: RequestHandler = async (req, res, next) => {
  try {
    // Getting id from params
    const { id } = req.params;
    // Finding one
    const volunteerFound = await Volunteer.findById(id).select("-location");
    if (!volunteerFound) {
      throw new CustomError(StatusCodes.NOT_FOUND, `Volunteer Not Found`);
    }
    req.volunteer = volunteerFound;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Edit volunteer by id
 */
export const editVolunteer: RequestHandler = async (req, res, next) => {
  try {
    // Get volunteer
    const volunteer = req.volunteer;

    // Updating fields
    const { full_name, phone, driver, address } = req.body;
    volunteer.full_name = full_name;
    volunteer.phone = phone;
    volunteer.driver = driver;

    // Handle address edit if needed
    if (volunteer.address !== address) {
      const coordiantes = await getCoordinates(address);
      volunteer.address = address;
      volunteer.location = { type: "Point", coordinates: coordiantes };
    }

    await volunteer.save();
    return res.json(volunteer);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete volunteer by id
 */
export const deleteVolunteer: RequestHandler = async (req, res, next) => {
  try {
    // Getting id from params
    const { id } = req.params;

    // Delete
    const deletedVolunteer = await Volunteer.findByIdAndDelete(id);
    return res.json(deletedVolunteer);
  } catch (error) {
    next(error);
  }
};
