const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResourceSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
});
module.exports = mongoose.model("resource", ResourceSchema);
