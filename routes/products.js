var express = require("express");
var router = express.Router();

var { productValidator } = require("../validators/productValidator");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const { multerUpload, auth } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");

router.get("/", [auth], (req, res) => {
  if (req.user_role == "seller") {
    seller = req._id;
  }
  Product.find({
    seller: seller,
  })
    .then((products) => res.json(products))
    .catch((err) => console.log(err.message));
});

router.post(
  "/addproduct",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  (req, res) => {
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
      seller: req._id,
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

router.put("/:id", [auth, verifyTokenSeller], (req, res) => {
  const { label, category, marque, price, reference, state, type, images } =
    req.body;
  let Productfeilds = {};
  if (label) Productfeilds.label = label;
  if (category) Productfeilds.category = category;
  if (marque) Productfeilds.marque = marque;
  if (price) Productfeilds.price = price;
  if (reference) Productfeilds.reference = reference;
  if (state) Productfeilds.state = state;
  if (type) Productfeilds.type = type;
  if (images) Productfeilds.images = images;

  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.json({ msg: "product not found" });
      } else if (product.user.toString() !== req.user.id) {
        res.json({ msg: "Not authorized" });
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
});

router.delete("/:id", [auth, verifyTokenSeller], (req, res) => {
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
});

module.exports = router;
