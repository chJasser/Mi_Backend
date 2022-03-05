const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema(
  {
<<<<<<< HEAD
=======
    
>>>>>>> origin/fakher
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
<<<<<<< HEAD
    userName: {
      type: String,
      required: true,
    },

=======
    
>>>>>>> origin/fakher
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
      type:String,
      default: "user",
    },
<<<<<<< HEAD
    isBlocked: {
      type: Boolean,
      default: false,
    },
=======
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
>>>>>>> origin/fakher
  },
  { timestamps: true }
);
module.exports = User = mongoose.model("User", UserSchema);
