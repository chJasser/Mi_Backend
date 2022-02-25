const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    about: {
      type: String,
      required: true,
      maxLength: 255,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    degrees: [String],
    rib: {
      type: Number,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
