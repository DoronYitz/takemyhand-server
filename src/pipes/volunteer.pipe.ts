import { body } from "express-validator";

export const createVolunteerPipe = [
  // Full name is string of only hebrew-english chars
  body("full_name")
    .notEmpty()
    .withMessage("full_name is required")
    .bail()
    .matches("^[a-zA-Z\u0590-\u05FF\u200f\u200e ]+$")
    .withMessage("full_name can only have letters and space"),
  // Phone is numeric and 10 len
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .bail()
    .isNumeric()
    .withMessage("phone can be only letters")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("Not a valid phone number"),
  // Address is a string
  body("address")
    .notEmpty()
    .withMessage("address is required")
    .bail()
    .isString()
    .withMessage("address must be a string"),
];
