const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new ChapterSchema(
  {
    title: {
      type: String,
      required: true,
    },

    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chapter", ChapterSchema);
