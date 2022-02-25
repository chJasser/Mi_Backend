const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: date.now(),
    },
    description: {
      type: String,
      maxLength: 100,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "voice",
        "guitar",
        "keyboards",
        "strings",
        "percussions",
        "brass",
        "woodwind",
        "others",
      ],
      required: true,
      default: "others",
    },
    languages: {
      type: String,
      enum: ["english", "french", "arabic"],
      required: true,
      default: "english",
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseComment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
