var express = require("express");
var router = express.Router();
const Teacher = require("../models/teacher");
router.get("/", (req, res) => {
  console.log("getting teachers");
  Teacher.findOne({ _id: "62192819d7af7e5bf44b7ba2" }, (err, teacher) => {
    console.log(teacher);
  });
});

module.exports = router;
