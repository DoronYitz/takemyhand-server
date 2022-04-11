import { config } from "dotenv";

config();

/**
 * Config class used for all process env vars
 */
export class Config {
  /**
   * Mongo db uri
   */
  public static MONGODB_URI = process.env.MONGODB_URI;
  /**
   * Jwt secret
   * @example 'my_5tr0nG_p4s5W07d'
   */
  public static JWT_SECRET = process.env.JWT_SECRET;
  /**
   * Jwt experation time
   * @example '1h'
   */
  public static JWT_EXPERATION = process.env.JWT_EXPERATION;
  /**
   * Refresh token experation time (seconds)
   * @example 3600
   */
  public static JWT_REFRESH_EXPERATION = +process.env.JWT_REFRESH_EXPERATION;
  /**
   * Google api key
   */
  public static GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
  /**
   * Default coordinate, used to avoid spamming api key with unavailable address and enlarge google payment
   */
  public static DEFAULT_COORDINATE = {
    lat: +process.env.LAT,
    lng: +process.env.LNG,
  };
  /**
   * Admins
   */
  public static ADMINS = loadListFormEnv(process.env.ADMINS);
  public static PASSWORD = process.env.PASSWORD;
}

/**
 * Helper function used to convert comma seperated string into array
 *
 * @param {string} list comma seperated name string e.g doron,shir,sasi
 * @returns {Array<string>} array of string trimmed
 */
function loadListFormEnv(list: string): Array<string> {
  return list
    ? list
        .trim()
        .split(",")
        .map((x) => x.trim())
    : [];
}
