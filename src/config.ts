import dotenv from "dotenv";

dotenv.config();

export class Config {
	public static EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
	public static MONGODB_URI = process.env.MONGODB_URI;
	public static JWT_SECRET = process.env.JWT_SECRET;
	public static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
	public static JWT_EXPERATION = process.env.JWT_EXPERATION;
	public static SECRET = process.env.SECRET;
	public static GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
	public static DEFAULT_COORDINATE = {
		lat: +process.env.LAT,
		lng: +process.env.LNG,
	};
}
