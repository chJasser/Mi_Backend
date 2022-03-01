const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');
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
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
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
      required: true,
      maxLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "seller", "student", "admin", "super_admin"],
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
