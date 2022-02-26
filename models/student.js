const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
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
    interestedIn: [String],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
