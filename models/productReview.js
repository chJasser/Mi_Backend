const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReview = new Schema(
  {
    content: {
      type: String,
      maxLength: 255,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ProductReview", ProductReview);
