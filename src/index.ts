import express from "express";
import cors from "cors";
import parcelRouter from "./routes/parcel.route";
import volunteerRouter from "./routes/volunteer.route";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import { Config } from "./config";
import { connectToDB } from "./shared/database";
import { errorMiddleware } from "./middlewares/error.middleware";
import { expressLogger } from "./controllers/logger.controller";

const app = express();
// cors
app.use(cors());

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express-logger
app.use(expressLogger);

app.get("/ping", (req, res) => res.send("pong"));
app.use("/api/auth", authRouter);
app.use("/api/parcel", parcelRouter);
app.use("/api/volunteer", volunteerRouter);
app.use("/api/user", userRouter);

app.use(errorMiddleware);
app.listen(Config.EXPRESS_PORT, () => {
	console.log(`Example app listening at http://localhost:${Config.EXPRESS_PORT}`);
});

connectToDB();
