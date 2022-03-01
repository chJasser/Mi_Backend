var express = require("express");
var router = express.Router();

const Course = require("../models/course");
router.get("/", (req, res) => {
  console.log("getting courses");
  Course.find((err, admins) => {
    console.log(admins);
  });
});

module.exports = router;
