const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateCourseSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    number: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("RateCourse", RateCourseSchema);
