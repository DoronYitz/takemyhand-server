import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server } from "socket.io";

import parcelRouter from "./routes/parcel.route";
import volunteerRouter from "./routes/volunteer.route";
import authRouter from "./routes/auth.route";
import eventsRouter from "./routes/event.route";
import messageRouter from "./routes/message.route";
import { connectToDB } from "./shared/database";
import { errorMiddleware } from "./middlewares/error.middleware";
import { expressLogger } from "./controllers/logger.controller";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { cors: { origin: true, credentials: true } });

// cors
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Http file handler
app.use(fileUpload());

// express-logger
app.use(expressLogger);

// testing route
app.get("/ping", (req, res) => res.send("pong"));

// api routes
app.use("/api/auth", authRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/events", eventsRouter);
app.use("/api/message", messageRouter);

// Error middleware
app.use(errorMiddleware);

const port = process.env.PORT || 8081;
httpServer.listen(port, () => console.log(`Example app listening at port ${port}`));

connectToDB();
