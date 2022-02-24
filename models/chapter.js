const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new ChapterSchema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: date.now(),
  },
  resources: [
    {
      type: Schema.Types.ObjectId,
      ref: "resource",
    },
  ],
});

module.exports = mongoose.model("chapter", ChapterSchema);
