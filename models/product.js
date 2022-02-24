const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
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
      ref: "productimage",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productReview",
    },
  ],
});
module.exports = mongoose.model("product", ProductSchema);
