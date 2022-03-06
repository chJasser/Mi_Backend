var express = require("express");
var router = express.Router();
const Student = require("../models/student");

router.get("/", (req, res) => {
    console.log("getting students");
    Student.find((err, student) => {
      console.log(student);
    });
  });


module.exports = router;
