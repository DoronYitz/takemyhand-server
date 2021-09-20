import express from "express";
import cors from "cors";
import { Config } from "./config";
import { connectToDB } from "./shared/database";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/ping", (req, res) => {
	res.send("pong");
});

app.listen(Config.EXPRESS_PORT, () => {
	console.log(`Example app listening at http://localhost:${Config.EXPRESS_PORT}`);
});

connectToDB();
