import express from "express";
import cors from "cors";
import parcelRouter from "./routes/parcel.route";
import volunteerRouter from "./routes/volunteer.route";
import authRouter from "./routes/auth.route";
import eventsRouter from "./routes/event.route";
import messageRouter from "./routes/message.route";
import { Config } from "./config";
import { connectToDB } from "./shared/database";
import { errorMiddleware } from "./middlewares/error.middleware";
import { expressLogger } from "./controllers/logger.controller";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: true, credentials: true } });

// cors
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie-parser
app.use(cookieParser());

// Http file handler
app.use(fileUpload());

// express-logger
app.use(expressLogger);

app.get("/ping", (req, res) => res.send("pong"));
app.use("/api/auth", authRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/events", eventsRouter);
app.use("/api/message", messageRouter);

app.use(errorMiddleware);

httpServer.listen(Config.EXPRESS_PORT, () =>
	console.log(`Example app listening at http://localhost:${Config.EXPRESS_PORT}`)
);

connectToDB();
