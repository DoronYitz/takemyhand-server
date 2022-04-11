import { body } from "express-validator";

export const createEventPipe = [
  // Title is string
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail(),
  // Category is a string
  body("category")
    .notEmpty()
    .withMessage("category is required")
    .bail()
    .isString()
    .withMessage("category must be a string")
    .bail(),
  // Date is not empty
  body("date").notEmpty().withMessage("date is required").bail(),
  // Description is string
  body("description")
    .notEmpty()
    .withMessage("description is required")
    .bail()
    .isString()
    .withMessage("description must be a string")
    .bail(),
  // Secret is 8 len, including 1 number, 1 uppercase, 1 lowercase and 1 symbol
  body("secret")
    .notEmpty()
    .withMessage("secret is required")
    .bail()
    .isString()
    .withMessage("secret must be a string")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    })
    .withMessage(
      "secret pattern isnt valid, please make sure secret is 8 char length contain 1 Upper & Lower letter, number and symbol.",
    ),
];
