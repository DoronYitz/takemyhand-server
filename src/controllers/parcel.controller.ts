import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { StatusCodes } from "http-status-codes";

import { Message } from "../models/message.model";
import { IParcel, Parcel } from "../models/parcel.model";
import { Volunteer } from "../models/volunteer.model";
import CustomError from "../shared/error";
import { getCoordinates } from "./geocoding.controller";

/**
 * Get parcels
 */
export const getParcels: RequestHandler = async (req, res, next) => {
  try {
    // Getting all parcels
    const parcels = await Parcel.find().populate("volunteer");
    return res.json(parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * Get driver parcels
 */
export const getDriverParcels: RequestHandler = async (req, res, next) => {
  try {
    const driver = req.user;
    // Getting all driver's parcels
    const driver_parcels = await Parcel.find({ volunteer: driver.userId });
    return res.json(driver_parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a parcel
 */
export const createParcel: RequestHandler = async (req, res, next) => {
  try {
    // Create document of new parcel
    const { address } = req.body;

    // Get coordinates
    const coordiantes = await getCoordinates(address);
    const newParcel = new Parcel({
      address,
      location: { type: "Point", coordinates: coordiantes },
    });
    await newParcel.save();
    return res.status(StatusCodes.CREATED).json(newParcel);
  } catch (error) {
    next(error);
  }
};

/**
 * Create many parcels from text file input
 */
export const createParcelsFromTextFile: RequestHandler = async (req, res, next) => {
  try {
    // Get file
    const textFile: UploadedFile | any = req?.files?.textFile;
    if (!textFile) {
      throw new CustomError(StatusCodes.BAD_REQUEST, `File not found`);
    }

    // To string file buffer
    const fileBuffer: Buffer = textFile.data;
    const fileData = fileBuffer.toString("utf-8");
    if (!fileData) {
      throw new CustomError(StatusCodes.BAD_REQUEST, `Empty file`);
    }

    // Inner file logic
    const splittedAddresses = fileData.split("\r\n");
    const parcels = await splittedAddresses
      .filter((x) => x)
      .map((address) => {
        // Create parcel objects
        const parcel: Partial<IParcel> = { address };
        return parcel;
      });

    // For each parcel find its location
    for (let parcel of parcels) {
      const coordinates = await getCoordinates(parcel.address);
      parcel.location = { type: "Point", coordinates };
    }

    const parcelsDocumnets = await Parcel.insertMany(parcels);
    return res.status(StatusCodes.CREATED).json(parcelsDocumnets);
  } catch (error) {
    next(error);
  }
};

/**
 * Get parcel by id
 */
export const getParcel: RequestHandler = async (req, res, next) => {
  try {
    // Getting id from params
    const { id } = req.params;
    // Finding one
    const parcelFound = await Parcel.findById(id).populate("volunteer");
    if (!parcelFound) {
      throw new CustomError(StatusCodes.NOT_FOUND, `Parcel Not Found`);
    }
    req.parcel = parcelFound;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Edit parcel arrived status
 */
export const editParcelStatus: RequestHandler = async (req, res, next) => {
  try {
    // If status has changed
    if (req.parcel.arrived !== req.body.arrived) {
      const partialText = req.body.arrived ? `הגיעה ליעד` : `שונתה כלא הגיעה ליעד`;

      // Set message obj
      const message = {
        arrived: req.body.arrived,
        content: `חבילה בעלת כתובת "${req.parcel.address}" ${partialText}`,
        date: new Date(),
      };

      // Creates a new message
      const newMessage = new Message(message);
      await newMessage.save();

      // Send the message to the control panel
      const socket = req.app.get("socket");
      socket.emit("message", message);
    }

    // Set parcel arrived
    req.parcel.arrived = req.body.arrived;
    await req.parcel.save();
    return res.json(req.parcel);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit parcel by id
 */
export const editParcel: RequestHandler = async (req, res, next) => {
  try {
    req.parcel.volunteer = req.body.volunteer;
    const { address } = req.body;

    // If address was changed
    if (address !== req.parcel.address) {
      const coordinates = await getCoordinates(address);
      req.parcel.location = { type: "Point", coordinates };
      req.parcel.address = address;
    }
    await req.parcel.save();
    return res.json(req.parcel);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete parcel by id
 */
export const deleteParcel: RequestHandler = async (req, res, next) => {
  try {
    // Getting id from params
    const { id } = req.params;

    // Delete it
    const deletedParcel = await Parcel.findByIdAndDelete(id);
    return res.json(deletedParcel);
  } catch (error) {
    next(error);
  }
};

/**
 * Set all parcels to the nearest driver by location
 */
export const setParcelsDriversByLocation: RequestHandler = async (req, res, next) => {
  try {
    const parcels = await Parcel.find();

    // There are not parcels
    if (!parcels.length) {
      throw new CustomError(404, "אין חבילות לחלק");
    }

    // For each parcel, find its closest driver
    for (let parcel of parcels) {
      const [lng, lat] = parcel.location.coordinates;
      const nearestDriver = await Volunteer.findOne({
        driver: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        },
      });

      // There are no drivers
      if (!nearestDriver) {
        throw new CustomError(404, "אין נהגים במערכת");
      }

      // Set parcel volunteer to nearest driver
      parcel.volunteer = nearestDriver;
      // Save
      await parcel.save();
    }
    return res.json(parcels);
  } catch (err) {
    next(err);
  }
};
