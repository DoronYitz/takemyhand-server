import { Config } from "../config";

import authJwt from "express-jwt";

/**
 * Express-jwt middleware that extract payload into req.user in case JWT is verified.
 */
export const authMiddleware = authJwt({ secret: Config.JWT_SECRET, algorithms: ["HS256"] });
