import express from "express";

declare module "express-serve-static-core" {
	interface Request {
		myField?: string;
	}
	interface Response {
		myField?: string;
	}
}
