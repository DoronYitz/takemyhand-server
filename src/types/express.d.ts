import express from "express";
import { Document } from "mongoose";
import { Payload } from "../models/payload.model";

declare module "express-serve-static-core" {
	interface Request {
		// Usage passing objects with in request obj
		parcel: any;
		volunteer: any;
		event: any;

		// Populated using express-jwt npm, using token payload
		user: Payload;
	}
	interface Response {}
}
