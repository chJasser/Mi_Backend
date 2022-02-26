var express = require("express");
var router = express.Router();
const Product = require("../models/product");
router.get("/", (req, res) => {
    console.log("getting products");
    Product.find((err, seller) => {
      console.log(seller);
    });
  });


module.exports = router;
