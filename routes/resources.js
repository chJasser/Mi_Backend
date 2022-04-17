var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const Resource = require("../models/resource");
router.get("/", (req, res) => {
  console.log("getting resources");
  Resource.find((err, resource) => {
    console.log(resource);
  });
});
router.post("/", auth, (req, res) => {});

module.exports = router;
