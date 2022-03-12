var express = require("express");
var router = express.Router();
const Product = require("../models/product");
var { productValidator } = require("../validators/productValidator");
const User = require("../models/user");
const Seller = require("../models/seller");
const { validationResult } = require("express-validator");
const { multerUpload, auth } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");
//get all products for all users
router.get("/all-products", (req, res) => {
  var { label, category, marque, minPrice, maxPrice, reference, state, type } =
    req.body;

  let Productfeilds = {};
  let minP = 0;
  let maxP = 100000;
  if (maxPrice) maxP = maxPrice;
  if (minPrice) minP = minPrice;
  if (label) Productfeilds.label = label;
  if (category) Productfeilds.category = category;
  if (marque) Productfeilds.marque = marque;
  if (reference) Productfeilds.reference = reference;
  if (state) Productfeilds.state = state;
  if (type) Productfeilds.type = type;

  if (!Productfeilds) {
    Product.find().then((products) => res.json(products));
  } else {
    Product.find(Productfeilds)
      .where("price")
      .gte(minP)
      .lte(maxP)
      .then((result) => {
        res.status(200).json({ products: result });
      });
  }
});
/**
 *
 *
 *
 *
 */
//get user products

router.get("/my-products", [auth], async (req, res) => {
  const seller = await Seller.findOne().where("user").equals(req.user.id);
  if (!seller) {
    res.status(500).json({
      success: false,
      message: "can't find a seller account related to this user",
    });
  } else {
    const {
      label,
      category,
      marque,
      minPrice,
      maxPrice,
      reference,
      state,
      type,
    } = req.body;
    let Productfeilds = {};
    Productfeilds.seller = seller._id;
    let minP = 0;
    let maxP = 100000;
    if (maxPrice) maxP = maxPrice;
    if (minPrice) minP = minPrice;
    if (label) Productfeilds.label = label;
    if (category) Productfeilds.category = category;
    if (marque) Productfeilds.marque = marque;
    if (reference) Productfeilds.reference = reference;
    if (state) Productfeilds.state = state;
    if (type) Productfeilds.type = type;

    if (!Productfeilds) {
      Product.find().then((products) => res.json(products));
    } else {
      Product.find(Productfeilds)
        .where("price")
        .gte(minP)
        .lte(maxP)
        .then((result) => {
          res.status(200).json({ products: result });
        });
    }
  }
});

router.post(
  "/add-product",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  async (req, res) => {
    const seller = Seller.findOne().where("user").equals(req.user.id);
    if (!seller) {
      res.status(500).json({
        success: false,
        message: "can't find a seller account related to this user",
      });
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ errors: errors.array() });
      }
      let filesarray = [];
      req.files.forEach((element) => {
        filesarray.push(element.path);
      });

      const newproduct = new Product({
        label: req.body.label,
        category: req.body.category,
        marque: req.body.marque,
        price: req.body.price,
        reference: req.body.reference,
        state: req.body.state,
        type: req.body.type,
        seller: seller.id,
        productImage: filesarray,
      });

      newproduct.save(function (err, product) {
        if (err) {
          console.log(err.message);
        }
        res.json(product);
      });
    }
  }
);

router.put(
  "/update-product/:id",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  async (req, res) => {
    const seller = await Seller.findOne().where("user").equals(req.user.id);
    if (!seller) {
      res.status(500).json({
        success: false,
        message: "can't find a seller account related to this user",
      });
    } else {
      let filesarray = [];

      req.files.forEach((element) => {
        filesarray.push(element.path);
      });
      const { label, category, marque, price, reference, state, type } =
        req.body;
      let Productfeilds = {};
      if (label) Productfeilds.label = label;
      if (category) Productfeilds.category = category;
      if (marque) Productfeilds.marque = marque;
      if (price) Productfeilds.price = price;
      if (reference) Productfeilds.reference = reference;
      if (state) Productfeilds.state = state;
      if (type) Productfeilds.type = type;
      if (req.files) Productfeilds.productImage = filesarray;

      Product.findById(req.params.id)
        .then((product) => {
          if (!product) {
            return res.json({ msg: "product not found" });
          } else if (product.seller.toString() != seller.id) {
            return res.status(500).json({
              success: false,
              message: "product related to the user !",
            });
          } else {
            Product.findByIdAndUpdate(
              req.params.id,
              { $set: Productfeilds },
              (err, data) => {
                return res.status(200).json({
                  success: true,
                  message: "product updated",
                });
              }
            );
          }
        })
        .catch((err) => console.log(err.message));
    }
  }
);

router.delete(
  "/delete-product/:id",
  [auth, verifyTokenSeller],
  async (req, res) => {
    const seller = await Seller.findOne().where("user").equals(req.user.id);
    if (!seller) {
      res.status(500).json({
        success: false,
        message: "can't find a seller account related to this user",
      });
    } else {
      Product.findById(req.params.id)
        .then((product) => {
          if (!product) {
            return res.json({ msg: "product not found" });
          } else if (product.seller.toString() != teacher.id) {
            return res.status(500).json({
              success: false,
              message: "cant delete a product not yours",
            });
          } else {
            Product.findByIdAndDelete(req.params.id, (err, data) => {
              return res.status(500).json({
                success: true,
                message: "product deleted",
              });
            });
          }
        })
        .catch((err) => console.log(err.message));
    }
  }
);

module.exports = router;
