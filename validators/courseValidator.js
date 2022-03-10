const { check } = require("express-validator");
exports.courseValidator = [
  check("label", "label is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage("label must be between 4 characters and 15 characters"),
  check("description", "description is required")
    .notEmpty()
    .isLength({
      min: 30,
      max: 255,
    })
    .withMessage(
      "description must be between 30 characters and 255 characters"
    ),

  check("price", "price is required").notEmpty(),
];
