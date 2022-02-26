var express = require("express");
var router = express.Router();

const ProductImage = require("../models/productImage");
router.get("/", (req, res) => {
  console.log("getting images");
  ProductImage.find((err, admins) => {
    console.log(admins);
  });
});

module.exports = router;
