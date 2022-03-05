const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateProductSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    number: {
      type: Number,
      default:0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("RateProduct", RateProductSchema);
