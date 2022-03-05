var express = require("express");
var router = express.Router();
const ProductImage = require("../models/productImage");

var { productValidator } = require("../validators/productValidator");
const Product = require("../models/product");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const multer = require("multer");
const { verifyToken } = require("../middleware/verifyToken");
const passport = require("passport");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Get All Products
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { label, category, marque, price, reference, state, type } = req.body;
    let ProductFields = {};
    if (req.user.role){
      if (req.user.role == "seller")
        ProductFields.seller = req.user._id;
      ProductFields.user = req.user._id;
    } 
    if (label) ProductFields.label = label;
    if (category) ProductFields.category = category;
    if (marque) ProductFields.marque = marque;
    if (price) ProductFields.price = price;
    if (reference) ProductFields.reference = reference;
    if (state) ProductFields.state = state;
    if (type) ProductFields.type = type;
    if (req.files) ProductFields.productImage = filesarray;

    if (!ProductFields) {
      Product.find().then((products) => res.json(products));
    } else {
        Product.find(ProductFields, (err, result) => {
          res.json(result);
        });
    }
  }
);

// Add Product
router.post(
  "/addproducts",
  [passport.authenticate("jwt", { session: false }), upload.array("files")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }
    let filesarray = [];
    //const savedimages = [];
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
      //user:req.user.id,
      user: req.user._id,
      productImage: filesarray,
    });

    newproduct.save(function (err, product) {
      if (err) {
        console.log(err.message);
      }
      res.json(product);
    });
  }
);

// Update Product
router.put(
  "/:id",
  [passport.authenticate("jwt", { session: false }), upload.array("files")],
  (req, res) => {
    const { label, category, marque, price, reference, state, type } = req.body;

    let filesarray = [];
    req.files.forEach((element) => {
      filesarray.push(element.path);
    });

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
        } else if (product.user.toString() != req.user._id) {
          res.json({ msg: "Noth authorized" });
        } else {
          Product.findByIdAndUpdate(
            req.params.id,
            { $set: Productfeilds },
            (err, data) => {
              res.json(data);
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);

// Delete Product
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Product.findById(req.params.id)
      .then((product) => {
        if (!product) {
          return res.json({ msg: "product not found" });
        } else if (product.user.toString() !== req.user.id) {
          res.json({ msg: "Noth authorized" });
        } else {
          Product.findByIdAndDelete(req.params.id, (err, data) => {
            res.json({ msg: "Product Deleted!" });
          });
        }
      })
      .catch((err) => console.log(err.message));
  }
);

module.exports = router;
