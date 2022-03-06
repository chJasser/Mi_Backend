var express = require("express");
var router = express.Router();
const Resource = require("../models/resource");
router.get("/", (req, res) => {
    console.log("getting resources");
    Resource.find((err, resource) => {
      console.log(resource);
    });
  });


module.exports = router;
