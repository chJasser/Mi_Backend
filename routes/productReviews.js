var express = require("express");
var router = express.Router();

const ProductReview = require("../models/productReview");
router.get("/", (req, res) => {
  console.log("getting productsReviews");
  ProductReview.find((err, review) => {
    console.log(review);
  });
});

module.exports = router;
