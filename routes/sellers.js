var express = require("express");
var router = express.Router();
const Seller = require("../models/seller");

router.get("/", (req, res) => {
  console.log("getting sellers");
  Seller.find((err, seller) => {
    console.log(seller);
  });
});

module.exports = router;
