var express = require("express");
var router = express.Router();
const Product = require("../models/product");
var { productValidator } = require("../validators/productValidator");
const User = require("../models/user");
const Seller = require("../models/seller");
const Like = require("../models/like");
const Bookmark = require("../models/bookmark");
const ProductReview = require("../models/productReview");
const { validationResult } = require("express-validator");
const { multerUpload, auth } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");
const {
  TrustProductsEvaluationsContext,
} = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEvaluations");
const Rate = require("../models/rate");

const Rateuser = require("../models/rateuser");

const user = require("../models/user");

router.get("/product/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).send({ message: "product not found" });
      } else {
        res.status(200).json(product);
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
router.get("/seller/:id", (req, res) => {
  Seller.findById(req.params.id)
    .then((seller) => {
      User.findById(seller.user).then((user) => {
        res.json(user);
      });
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
});

router.get("/product/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).send({ message: "product not found" });
      } else {
        res.status(200).json(product);
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/all-sellers", (req, res) => {
  Seller.find()
    .then((sellers) => res.json(sellers))
    .catch((err) => console.log(err.message));
});

router.get("/productsPerSeller/:id", (req, res) => {
  Product.find({ seller: req.params.id })
    .then((products) => res.json(products.length))
    .catch((err) => console.log(err.message));
});

router.get("/getproductsseller", [auth, verifyTokenSeller],(req,res)=>{
  Seller.findOne({ user: req.user._id })
  .then((sellers) => {
    if (!sellers) {
      res.status(500).json({
        success: false,
        message: "can't find a seller account related to this user",
      });
    } else {
Product.find({seller:sellers._id}).then((products)=>{
  res.json(products);
}).catch((err)=>{
  res.json({msg:err.message})
})

    }

}).catch((err)=>{
res.json({msg:err.message})

})


})

//Search By Label
// router.get("/searching", (req, res) => {

//   var { label, category, marque, minPrice, maxPrice, reference, state, type } = req.query
//   // if(label)
//   //   var label = req.query.label
//   // if(req.query.category)
//   //   var category = req.query.category
//   // else
//   //   category = req.query.
//   // var marque = req.query.marque
//   // var minPrice = req.query.minPrice
//   // var maxPrice = req.query.maxPrice
//   // var reference = req.query.reference
//   // var state = req.query.state
//   // var type = req.query.type
//   Product.find({$or : [{label: label}, {category: category}, {marque: marque}, {reference: reference}, {state:state},{type:type}]})
//     .then((product) => res.json(product))
//     .catch((err) => console.log(err.message));
// });

//Search By Marque
router.get("/marque", (req, res) => {
  var { marque } = req.query;
  Product.find({ marque: marque })
    .then((products) => res.json(products))
    .catch((err) => console.log(err.message));
});

//Search By price
router.get("/price", (req, res) => {
  var { min, max } = req.query;
  Product.find({ price: { $lte: max, $gte: min } })
    .then((products) => res.json(products))
    .catch((err) => console.log(err.message));
});
//
//Search By Label
router.get("/search", (req, res) => {
  var label = req.query.label;
  Product.find({ label: label })
    .then((product) => res.json(product))
    .catch((err) => console.log(err.message));
});

//Search by Category
router.get("/fiter", (req, res) => {
  Product.find().then((products) => {
    let prod = products.filter(
      (product) => product.category == req.query.category
    );
    res.json(prod);
  });
});

router.get("/filter", (req, res) => {
  var { label, category, marque, minPrice, maxPrice, reference, state, type } =
    req.body;
  console.log(req);

  let Productfeilds = {};
  let minP = 0;
  let maxP = 100000;
  if (maxPrice) maxP = maxPrice;
  if (minPrice) minP = minPrice;
  if (minPrice) Productfeilds.label = label;
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
  (req, res) => {
    Seller.findOne({ user: req.user._id })
      .then((sellers) => {
        if (!sellers) {
          res.status(500).json({
            success: false,
            message: "can't find a seller account related to this user",
          });
        } else {
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
            seller: sellers._id,
            description: req.body.description,
            productImage: filesarray,
            discountPercent: req.body.discountPercent,
          });

          newproduct.save(function (err, product) {
            if (err) {
              console.log(err.message);
              res.json({ success: false, message: err.message });
            }
            res.json({
              success: true,
              message: "product is added with success",
            });

            newrating = new Rate({
              nbrpeople: 1,
              rating: 1,
              product: product._id,
            });
            newrating.save(newrating).then((savedrating) => {});
          });
        }
      })
      .catch((err) => {
        if (err) {
          res.json({ msg: err.message });
        }
      });
  }
);
router.get("/getrating/:id", (req, res) => {
  Product.findById(req.params.id).then((product) => {
    if (!product) {
      res.status(401).json({ msg: "product not found" });
    } else {
      Rate.find({ product: req.params.id }, (err, rate) => {
        res.json(rate);
      });
    }
  });
});
router.get("/getratingbyuser/:id", auth, (req, res) => {
  Rateuser.findOne({ user: req.user._id, product: req.params.id }).then(
    (rate) => {
      res.json(rate);
    }
  );
});
///

///

router.put("/rating/:id", auth, (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.staus(401).json({ msg: "product not found" });
      } else {
        Rateuser.findOne({ user: req.user._id, product: req.params.id })
          .then((rateu) => {
            if (rateu) {
              Rateuser.findByIdAndUpdate(rateu._id, {
                $set: { rate: req.body.rate },
              }).then((newrate) => {
                Rateuser.find({ product: req.params.id }).then((products) => {
                  var allrating = 0;
                  products.forEach((product) => {
                    allrating += product.rate;
                  });

                  const nbr = products.length;
                  const rates = allrating / nbr;
                  var newrating = {
                    nbrpeople: nbr,
                    rating: rates,
                  };
                  Rate.findOne({ product: req.params.id }).then((product) => {
                    if (!product) {
                      newrating = new Rate({
                        nbrpeople: 1,
                        rating: req.body.rate,
                        product: req.params.id,
                      });
                      newrating.save(newrating).then((savedrating) => {});
                    } else {
                      Rate.findOneAndUpdate(
                        { product: req.params.id },
                        { $set: newrating },
                        (err, Rateupdated) => {
                          res.json(Rateupdated);
                        }
                      );
                    }
                  });
                });
              });
            } else if (!rateu) {
              newrateuser = new Rateuser({
                user: req.user._id,
                product: req.params.id,
                rate: req.body.rate,
              });
              newrateuser.save(newrateuser, (err, savedrate) => {
                Rateuser.find({ product: req.params.id }).then((products) => {
                  var allrating = 0;
                  products.forEach((product) => {
                    allrating += product.rate;
                  });

                  const nbr = products.length;
                  const rates = allrating / nbr;
                  var newrating = {
                    nbrpeople: nbr,
                    rating: rates,
                  };

                  Rate.findOne({ product: req.params.id }).then((product) => {
                    if (!product) {
                      newrating = new Rate({
                        nbrpeople: 1,
                        rating: req.body.rate,
                        product: req.params.id,
                      });
                      newrating.save(newrating).then((savedrating) => {});
                    } else {
                      Rate.findOneAndUpdate(
                        { product: req.params.id },
                        { $set: newrating },
                        (err, Rateupdated) => {
                          res.json(Rateupdated);
                        }
                      );
                    }
                  });
                });
              });
            }
          })
          .catch((err) => {
            res.json({ msg: err.message });
          });
      }
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
});

//
router.put(
  "/update-product/:id",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  async (req, res) => {
    const seller = await Seller.findOne().where("user").equals(req.user._id);
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
      const {
        label,
        category,
        marque,
        price,
        reference,
        state,
        type,
        description,
      } = req.body;
      let Productfeilds = {};
      if (label) Productfeilds.label = label;
      if (category) Productfeilds.category = category;
      if (marque) Productfeilds.marque = marque;
      if (price) Productfeilds.price = price;
      if (reference) Productfeilds.reference = reference;
      if (state) Productfeilds.state = state;
      if (type) Productfeilds.type = type;
      if (description) Productfeilds.description = description;
      if (req.files) Productfeilds.productImage = filesarray;

      Product.findById(req.params.id)
        .then((product) => {
          if (!product) {
            return res.json({ msg: "product not found" });
          } else if (product.seller.toString() != seller.id) {
            return res.status(500).json({
              success: false,
              message: "product not related to the user !",
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
    const seller = await Seller.findOne().where("user", req.user.id);
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
          } else if (product.seller.toString() != seller._id) {
            return res.status(500).json({
              success: false,
              message: "cant delete a product not yours",
            });
          } else {
            Bookmark.findOneAndDelete()
              .where("product", req.params.id)
              .then((bookmark) => {
                Like.findOneAndDelete()
                  .where("product", req.params.id)
                  .then((like) => {
                    Rate.findOneAndDelete()
                      .where("product", req.params.id)
                      .then((rate) => {
                        Rateuser.findOneAndDelete()
                          .where("product", req.params.id)
                          .then((rateuser) => {
                            Product.findByIdAndDelete(req.params.id)
                              .then((product) => {
                                const reviews = product.reviews;
                                reviews.forEach((review) => {
                                  ProductReview.findByIdAndDelete(review)
                                    .then((result) => {
                                      return res.status(200).json({
                                        success: true,
                                        message: "deleted successfully !",
                                      });
                                    })
                                    .catch((error) => {
                                      return res.status(500).json({
                                        success: false,
                                        message: "reviews cannot be deleted !",
                                      });
                                    });
                                });
                              })
                              .catch((error) => {
                                return res.status(500).json({
                                  success: false,
                                  message: error.message,
                                });
                              });
                          });
                      })
                      .catch((error) => {
                        return res.status(500).json({
                          success: false,
                          message: error.message,
                        });
                      });
                  });
              })
              .catch((error) => {
                return res.status(500).json({
                  success: false,
                  message: error.message,
                });
              });
          }
        })
        .catch((err) => console.log(err.message));
    }
  }
);
/**
 *
 *
 *
 *
 *
 *
 *
 *
 */
router.get("/liked-products", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "you must be logged in and u must put a valid product id !",
    });
  }

  const likes = await Like.find().where("user", user._id).populate("product");
  if (likes) {
    let products = [];
    likes.forEach((like) => {
      products.push(like.product);
    });
    return res.json(products);
  } else {
    return res.status(500).json({
      success: false,
      message: "no liked products",
    });
  }
});
// router.get("/verify-like/:id/:iduser", async (req, res) => {
//   const productToBeLiked = await Product.findOne({ _id: req.params.id });
//   const userToLikeProduct = await User.findOne({ _id: req.params.iduser });

//   if (!productToBeLiked || !userToLikeProduct) {
//     return res.status(500).json({
//       success: false,
//       message: "you must be logged in and u must put a valid product id !",
//     });
//   } else {
//     const like = await Like.findOne()
//       .where("user", userToLikeProduct._id)
//       .where("product", productToBeLiked._id);

//     if (like) {
//       return res.status(200).json({
//         success: true,
//         like: like,
//       });
//     } else {
//       return res.status(200).json({
//         success: false,
//         like: null,
//       });
//     }
//   }
// });
router.put("/add-like/:productId", auth, async (req, res) => {
  const productToBeLiked = await Product.findOne({ _id: req.params.productId });
  const userToLikeProduct = await User.findOne({ _id: req.user._id });
  if (!productToBeLiked || !userToLikeProduct) {
    return res.status(500).json({
      success: false,
      message: "you must be logged in and u must put a valid product id !",
    });
  } else {
    const like = await Like.findOne()
      .where("user", userToLikeProduct._id)
      .where("product", productToBeLiked._id);

    if (like) {
      return res.status(500).json({
        success: false,
        message: "u already like this product !",
      });
    } else {
      let newLike = new Like({
        user: userToLikeProduct._id,
        product: productToBeLiked._id,
      });
      newLike
        .save()
        .then(() => {
          Product.findByIdAndUpdate({ _id: productToBeLiked._id })
            .set("likesCount", productToBeLiked.likesCount + 1)
            .then((nice) => {
              return res.status(200).json({
                success: true,
                message: "success !",
              });
            })
            .catch((error) => {
              return res.status(500).json({
                success: false,
                message: error.message,
              });
            });
        })

        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    }
  }
});

router.put("/remove-like/:productId", auth, async (req, res) => {
  const productToBeUnLiked = await Product.findOne({
    _id: req.params.productId,
  });
  const userToUnLikeProduct = await User.findOne({ _id: req.user._id });
  if (!productToBeUnLiked || !userToUnLikeProduct) {
    return res.status(500).json({
      success: false,
      message: "something went wrong !",
    });
  } else {
    const like = await Like.findOne()
      .where("user", userToUnLikeProduct._id)
      .where("product", productToBeUnLiked._id);
    if (like) {
      Like.findOneAndDelete()
        .where("user", userToUnLikeProduct._id)
        .then((nice) => {
          if (nice) {
            Product.findByIdAndUpdate({ _id: productToBeUnLiked._id })
              .set("likesCount", productToBeUnLiked.likesCount - 1)
              .then(() => {
                return res.status(200).json({
                  success: true,
                  message: "success",
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });
              });
          } else {
            return res.status(500).json({
              success: false,
              message: "something went wrong !",
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "this user did not like this product ",
      });
    }
  }
});
router.put("/add-bookmark/:productId", auth, async (req, res) => {
  const productToBeBookmarked = await Product.findOne({
    _id: req.params.productId,
  });
  const userToBookmarkProduct = await User.findOne({ _id: req.user._id });
  if (!productToBeBookmarked || !userToBookmarkProduct) {
    return res.status(500).json({
      success: false,
      message: "something went wrong !",
    });
  } else {
    const bookmark = await Bookmark.findOne()
      .where("user", userToBookmarkProduct._id)
      .where("product", productToBeBookmarked._id);
    if (!bookmark) {
      const newBookmark = new Bookmark({
        user: userToBookmarkProduct._id,
        product: productToBeBookmarked._id,
      });
      await newBookmark.save((error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: `product  ${productToBeBookmarked.label}  is bookmarked !`,
          });
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "you already bookmarked this product",
      });
    }
  }
});
router.put("/remove-bookmark/:productId", auth, async (req, res) => {
  const productToBeBookmarked = await Product.findOne({
    _id: req.params.productId,
  });
  const userToBookmarkProduct = await User.findOne({ _id: req.user._id });
  if (!productToBeBookmarked || !userToBookmarkProduct) {
    return res.status(500).json({
      success: false,
      message: "something went wrong !",
    });
  } else {
    const bookmark = await Bookmark.findOne()
      .where("user", userToBookmarkProduct._id)
      .where("product", productToBeBookmarked._id);
    if (bookmark) {
      Bookmark.deleteOne({ _id: bookmark._id })
        .then(() => {
          return res.status(200).json({
            success: true,
            message: `product  ${productToBeBookmarked.label}  is not bookmarked anymore !`,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "you already unBookmarked this product",
      });
    }
  }
});

router.get("/bookmarked-products", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "you must be logged in and u must put a valid product id !",
    });
  }

  const bookmarks = await Bookmark.find()
    .where("user", user._id)
    .populate("product");
  if (bookmarks) {
    let products = [];
    bookmarks.forEach((like) => {
      products.push(like.product);
    });
    return res.json(products);
  } else {
    return res.status(500).json({
      success: false,
      message: "no bookmarked products",
    });
  }
});
/**
 *
 *
 *
 *
 *
 */

module.exports = router;
