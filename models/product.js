const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    seller:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Seller",
    },

    label: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "guitars",
        "keyboards",
        "strings",
        "brass",
        "percussions",
        "woodwind",
        "others",
      ],
      required: true,
      default: "others",
    },
    marque: {
      type: String,
      enum: [
        "yamaha",
        "shure",
        "gibson",
        "harman",
        "fender",
        "steinway",
        "roland",
        "others",
      ],
      required: true,
      default: "others",
    },
    price: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      maxLength: 25,
    },
    state: {
      type: String,
      enum: ["new", "used"],
    },
    type: {
      type: String,
      enum: ["instrument", "gear"],
      default: "instrument",
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductImage",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductReview",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
