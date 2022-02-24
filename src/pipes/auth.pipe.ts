import { body } from "express-validator";

export const loginPipe = [
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .bail()
    .isNumeric()
    .withMessage("Phone must contain only numbers")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("Invalid phone number"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a string"),
];

export const refreshTokenPipe = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Bad request")
    .bail()
    .isUUID(4)
    .withMessage("Invalid refresh token"),
];
