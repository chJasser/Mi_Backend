var express = require("express");
var router = express.Router();

const Chapter = require("../models/chapter");
router.get("/", (req, res) => {
  console.log("getting chapter");
  Chapter.find((err, chapters) => {
    console.log(chapters);
  });
});


module.exports = router;
