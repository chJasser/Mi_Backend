var express = require("express");
const User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  console.log("getting users");
  User.find((err, user) => {
    console.log(user);
  });
});

module.exports = router;
