const mongoose = require("mongoose");
const { string } = require("yup");
const Schema = mongoose.Schema;
const ResourceSchema = new Schema(
  {
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resource", ResourceSchema);
