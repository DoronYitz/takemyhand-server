import { Config } from "../config";

import mongoose from "mongoose";

/**
 * Connect to database
 */
export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(Config.MONGODB_URI);
    console.log("Connected to database");
  } catch (err) {
    console.log("Error connecting to database");
  }
};
