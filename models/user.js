const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      enum: ["man", "woman"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    
    profilePicture: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      maxLength: 8,
    },
    role: {
      enum: ["user", "teacher", "seller", "student", "admin", "super_admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
module.exports = User = mongoose.model("User", UserSchema);
