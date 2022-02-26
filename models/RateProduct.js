const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateProductSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    number: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("RateProduct", RateProductSchema);
