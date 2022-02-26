const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateCourseSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    number: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("RateCourse", RateCourseSchema);
