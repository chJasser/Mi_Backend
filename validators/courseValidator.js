const { check } = require("express-validator");
exports.userValidator = [
  check("label", "label is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage("label must be between 4 characters and 15 characters"),
  check("description", "description is required")
    .isEmpty()
    .isLength({
      min: 30,
      max: 255,
    })
    .withMessage("last name must be between 30 characters and 255 characters"),

  check("duration", "duration is required").isBetween(
    "duration",
    1,
    30,
    "the duration of the course must be between 1 hour and 30 hours"
  ),
  check("price", "price is required").notEmpty(),
];
