var express = require("express");
var router = express.Router();
const RateCourse = require("../models/rateCourse");
router.get("/", (req, res) => {
    console.log("getting rateCourse");
    RateCourse.find((err, rateCourse) => {
      console.log(rateCourse);
    });
  });


module.exports = router;
