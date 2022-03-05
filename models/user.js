const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    sex: {
      type: String,
      enum: ["man", "woman"],
    },

    address: {
      type: String,
    },

    profilePicture: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      maxLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "seller", "student", "admin", "super_admin"],
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = User = mongoose.model("User", UserSchema);
