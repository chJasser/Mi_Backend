const mongoose = require("mongoose");

ProductImageSchema = new mongoose.Schema({
  type: String,
  path: { type: String, required: true },
});

module.exports = mongoose.model("ProductImage", ProductImageSchema);
