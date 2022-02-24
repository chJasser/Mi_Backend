const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const Seller = new Schema({
  rib: {
    type: Number,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
});

const SellerSchema = User.discriminator("SellerSchema", Seller);

module.exports = mongoose.model("seller", SellerSchema);
