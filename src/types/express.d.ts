import express from "express";
import { Document } from "mongoose";

declare module "express-serve-static-core" {
	interface Request {
		parcel: any;
		volunteer: any;
	}
	interface Response {}
}
