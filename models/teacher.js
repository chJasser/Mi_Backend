const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const Teacher = new Schema({
  about: {
    type: String,
    required: true,
    maxLength: 255,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  degrees: [
    {
      type: String,
    },
  ],
  rib: {
    type: Number,
    required: true,
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
});

const TeacherSchema = User.discriminator("TeacherSchema", Teacher);

module.exports = TeacherSchema;
/* 
var OriginalSchema = new Schema({
    id: { type: Schema.Types.ObjectId },
    name: { type: String },
    description: { type:String },
});

var NewSchema = new Schema({
    expiresAt: { 
        type: Date, 
        default: Date.now,
        expires: 24*60*60
    }
});

var Original = mongoose.model('Original', OriginalSchema);
var NewSch = Original.discriminator('NewSch', NewSchema);
*/
