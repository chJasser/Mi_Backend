var express = require("express");
var router = express.Router();

const Admin = require("../models/admin");
router.get("/", (req, res) => {
  console.log("getting admins");
  Admin.find((err, admins) => {
    console.log(admins);
  });
});

module.exports = router;
