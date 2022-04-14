const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    description: String,
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
        "guitarElectrique",
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
      //maxLength: 25,
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
    likesCount: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },

    productImage: [{ type: String, default: [] }],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductReview",
      },
    ],

    discountPercent: {
      type: Number,
      default: 0,
    },
    color:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color"
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
