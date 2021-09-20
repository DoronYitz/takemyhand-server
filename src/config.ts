import dotenv from "dotenv";

dotenv.config();

export class Config {
  public static EXPRESS_PORT = process.env.EXPRESS_PORT || 3000; 
}