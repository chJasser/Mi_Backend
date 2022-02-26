var express = require("express");
var router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");
const Product = require("../models/product");

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  console.log("getting products");
  const products = await Product.find({});
  res.json({ products: products });
});

module.exports = router;
