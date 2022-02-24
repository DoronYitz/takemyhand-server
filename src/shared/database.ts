import { Config } from "../config";

import mongoose from "mongoose";

/**
 * Connect to database
 */
export const connectToDB = (): void => {
  mongoose.connect(Config.MONGODB_URI);
  const database = mongoose.connection;
  database.once("open", () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
