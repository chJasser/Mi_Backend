const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceDetailsSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  totalBeforeDiscount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  invoice: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("InvoiceDetails", InvoiceDetailsSchema);
