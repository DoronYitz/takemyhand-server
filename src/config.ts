import dotenv from "dotenv";

dotenv.config();

export class Config {
  public static MONGODB_URI = process.env.MONGODB_URI;
  public static JWT_SECRET = process.env.JWT_SECRET;
  public static JWT_EXPERATION = process.env.JWT_EXPERATION;
  public static JWT_REFRESH_EXPERATION = +process.env.JWT_REFRESH_EXPERATION;
  public static GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
  public static DEFAULT_COORDINATE = {
    lat: +process.env.LAT,
    lng: +process.env.LNG,
  };
  public static ADMINS = loadListFormEnv(process.env.ADMINS);
  public static PASSWORD = process.env.PASSWORD;
}

function loadListFormEnv(list: string) {
  return list
    ? list
        .trim()
        .split(",")
        .map((x) => x.trim())
    : [];
}
