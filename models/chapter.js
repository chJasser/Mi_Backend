const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", ChapterSchema);
