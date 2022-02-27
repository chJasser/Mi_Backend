const mongoose = require("mongoose");

ProductImageSchema = new mongoose.Schema({
  //type: String,
  path: { type: String, required: true },

  product:{ 
    type:mongoose.Schema.Types.ObjectId,
     ref:"Product",
  }


});

module.exports = mongoose.model("ProductImage", ProductImageSchema);
