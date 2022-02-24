const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReview = new Schema({
  content: {
    type: String,
    maxLength: 255,
    required: true,
  },
  createdAt: Date.now(),
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
});
module.exports = mongoose.model("productReview", ProductReview);
