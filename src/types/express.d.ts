import express from "express";
import { Document } from "mongoose";
import { IParcel } from "../models/parcel.model";
import { Payload } from "../models/payload.model";
import { IVolunteer } from "../models/volunteer.model";

declare module "express-serve-static-core" {
	interface Request {
		// Usage passing objects with in request obj
		parcel: IParcel & Document<any, {}>;
		volunteer: IVolunteer & Document<any, {}>;
		event: IEvent & Document<any, {}>;

		// Populated using express-jwt npm, using token payload
		user: Payload;
	}
	interface Response {}
}
