import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
	const status = error.status || 500;
	const message = error.message || "Something went wrong, Please Try Again";
	res.status(status).send({ message });
};
