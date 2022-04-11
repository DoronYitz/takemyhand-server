import { Config } from "../config";

import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import CustomError from "../shared/error";
import { Volunteer } from "../models/volunteer.model";

/**
 * Admin middleware that checks if the user is an admin
 */
export const adminMiddleware: RequestHandler = async (req, res, next) => {
  try {
    // Find user by username from jwt user
    const user = await Volunteer.findById(req.user.userId);

    // Check if user exists and is an admin
    if (!user || !Config.ADMINS.includes(user.phone)) {
      throw new CustomError(StatusCodes.FORBIDDEN, "Access forbidden");
    }
    next();
  } catch (err) {
    next(err);
  }
};
