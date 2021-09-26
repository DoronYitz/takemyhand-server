import express from "express";
import cors from "cors";
import parcelRouter from "./routes/parcel.route";
import volunteerRouter from "./routes/volunteer.route";
import authRouter from "./routes/auth.route";
import { Config } from "./config";
import { connectToDB } from "./shared/database";
import { errorMiddleware } from "./middlewares/error.middleware";
import { expressLogger } from "./controllers/logger.controller";
import cookieParser from "cookie-parser";

const app = express();
// cors
app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
	})
);

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie-parser
app.use(cookieParser());

// express-logger
app.use(expressLogger);

app.get("/ping", (req, res) => res.send("pong"));
app.use("/api/auth", authRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/volunteer", volunteerRouter);

app.use(errorMiddleware);
app.listen(Config.EXPRESS_PORT, () => {
	console.log(`Example app listening at http://localhost:${Config.EXPRESS_PORT}`);
});

connectToDB();
