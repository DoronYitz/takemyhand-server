import { body } from "express-validator";

export const loginPipe = [
  // Phone is numeric and 10 len
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .bail()
    .isNumeric()
    .withMessage("Phone must contain only numbers")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number"),
  // Password is a string
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string"),
];

// Refresh token is uuid-4
export const refreshTokenPipe = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Bad request")
    .bail()
    .isUUID(4)
    .withMessage("Invalid refresh token"),
];
