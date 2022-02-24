const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const extendSchema = require("./mongoose-extend-schema");
const User = require("./user");

const userSchema = User.schema();
const SellerSchema = extendSchema(userSchema, {
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

module.exports = mongoose.model("seller", SellerSchema);
