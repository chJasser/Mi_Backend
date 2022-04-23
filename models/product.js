const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAlgolia = require("mongoose-algolia");

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
  },
  { timestamps: true }
);
ProductSchema.plugin(mongooseAlgolia, {
  appId: "JYOOTSXUAV",
  apiKey: "607df58d5f3a16069803d84e67f13b1f",
  indexName: "prod_NAME", //The name of the index in Algolia, you can also pass in a function
  selector: "-likesCount", //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  populate: [
    {
      path: "seller",
      ref: "Seller",
    },
    { path: "reviews", ref: "ProductReview", select: "user" },
  ],
  mappings: {
    label: function (value) {
      return `${value}`;
    },
  },
  filter: function (doc) {
    return !doc.softdelete;
  },
  debug: true, // Default: false -&gt; If true operations are logged out in your console
});
let Model = mongoose.model("Product", ProductSchema);
Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
Model.SetAlgoliaSettings({
  searchableAttributes: ["label", "likesCount", "category"], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
});
module.exports = mongoose.model("Product", ProductSchema);
