const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseCommentSchema = new Schema({
  content: {
    type: String,
    maxLength: 255,
    required: true,
  },
  createdAt: Date.now(),
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
});
module.exports = mongoose.model("courseComment", CourseCommentSchema);
