var express = require("express");
var router = express.Router();
const Seller = require("../models/seller");
const { auth, issueJWT } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");
const User = require("../models/user");
const { sellerValidator } = require("../validators/sellerValidator");
const { validationResult } = require("express-validator");


router.post("/register", [auth, sellerValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    res.status(500).json({ errors: errors.array() });
  } else {
    const newSeller = new Seller({
      rib: req.body.rib,
      about: req.body.about,
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
              res.status(500).json({ success: false, message: err.message });
              return;
            }
            User.findByIdAndUpdate(
              req.user._id,
              { $addToSet: { role: "seller" } },
              { new: true },
              (err, data) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err.message });
                } else {
                  const userToken = issueJWT(data);
                  return res.status(200).json({
                    success: true,
                    message: "Account was registered successfully. We will get back for you",
                    token: userToken.token,

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


router.get("/getcurrentseller", [auth, verifyTokenSeller], async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate("user");
    if (!seller) {
      return res.status(500).json({ seller: null });;
    }
    return res.status(200).json({ seller: seller });
  } catch (error) {
    res.status(500).json(error.message);
  }
});


router.get("/protected", [auth, verifyTokenSeller], (req, res, next) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});
module.exports = router;
