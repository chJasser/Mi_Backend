const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const Student = new Schema({
  about: {
    type: String,
    required: true,
    maxLength: 255,
  },
  interestedIn: [
    {
      type: string,
    },
  ],
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
  ],
});

const StudentSchema = User.discriminator("StudentSchema", Student);

module.exports = mongoose.model("student", StudentSchema);
