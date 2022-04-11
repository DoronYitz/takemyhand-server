import express from "express";
import { Document } from "mongoose";
import { IParcel } from "../models/parcel.model";
import { Payload } from "../models/payload.model";
import { IVolunteer } from "../models/volunteer.model";

/**
 * Modifing express request interface for intellisense and for passing objects using express Request obj
 */
declare module "express-serve-static-core" {
  interface Request {
    // Parcel doc
    parcel: IParcel & Document<any, {}>;

    // Volunteer doc
    volunteer: IVolunteer & Document<any, {}>;

    // Event doc
    event: IEvent & Document<any, {}>;

    // Populated using express-jwt npm, using token payload
    user: Payload;
  }
}
