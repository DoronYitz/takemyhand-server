import express from "express";
import cors from "cors";
import parcel from "./routes/parcel.route";
import volunteer from "./routes/volunteer.route";
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
app.use("/parcel", parcel);
app.use("/volunteer", volunteer);

app.use(errorMiddleware);
app.listen(Config.EXPRESS_PORT, () => {
	console.log(`Example app listening at http://localhost:${Config.EXPRESS_PORT}`);
});

connectToDB();
