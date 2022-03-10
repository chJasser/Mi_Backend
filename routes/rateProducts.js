var express = require("express");
var router = express.Router();
const RateProduct = require("../models/rateProduct");
router.get("/", (req, res) => {
    console.log("getting rateProduct");
    RateProduct.find((err, rateProduct) => {
      console.log(rateProduct);
    });
  });


module.exports = router;
