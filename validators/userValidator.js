const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("firstName", "First name is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage("first name must be between 4 characters and 15 characters"),
  check("lastName", "last Name is required")
    .isEmpty()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage("last name must be between 4 characters and 15 characters"),

  check("email", "email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),

  check("phoneNumber", "phone number is required").notEmpty().isLength({
    min: 8,
  }),
];
