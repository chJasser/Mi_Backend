const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReclamationSchema = new Schema({
  content: {
    type: String,
    maxLength: 255,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
module.exports = mongoose.model("reclamation", ReclamationSchema);
