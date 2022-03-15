var express = require("express");
var router = express.Router();
const Seller = require("../models/seller");
const { auth } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");
const User = require("../models/user");
const { sellerValidator } = require("../validators/sellerValidator");
const { validationResult } = require("express-validator");
const Product = require("../models/product");
router.post("/register", [auth, sellerValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    res.status(500).json({ errors: errors.array() });
  } else {
    const newSeller = new Seller({
      rib: req.body.rib,
      user: req.user._id,
    });
    Seller.findOne({ user: req.user._id })
      .then((seller) => {
        if (seller) {
          return res
            .status(500)
            .json({ success: false, message: "Account already exists !" });
        } else {
          newSeller.save((err, newSeller) => {
            if (err) {
              res.status(500).json({ success: false, message: err });
              return;
            }
            User.findByIdAndUpdate(
              req.user._id,
              { $addToSet: { role: "seller" } },
              { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err });
                } else {
                  return res.status(200).json({
                    success: true,
                    message: "Account was registered successfully !",
                  });
                }
              }
            );
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err });
      });
  }
});
router.get("/protected", [auth, verifyTokenSeller], (req, res, next) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});

router.get("/get-liked-products", async (req, res) => {
  const likedProducts = await Product.find().where("likesCount").gte(0);
  if (likedProducts) {
    res.status(200).json({
      success: true,
      products: likedProducts,
    });
  } else {
    res.status(500).json({
      success: false,
      products: "no products were found",
    });
  }
});
router.get("/get-most-liked-products", async (req, res) => {
  const mostLikedProducts = await Product.find()
    .sort({ likesCount: "desc" })
    .limit(10);
  if (mostLikedProducts) {
    res.status(200).json({
      success: true,
      "most liked products": mostLikedProducts,
    });
  } else {
    res.status(500).json({
      success: false,
      products: "no products were found",
    });
  }
});
module.exports = router;
