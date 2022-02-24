const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = require("./user");
const extendSchema = require("./mongoose-extend-schema");
const userSchema = User.schema();

const StudentSchema = extendSchema(userSchema, {
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

module.exports = mongoose.model("student", StudentSchema);
