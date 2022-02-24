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
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});

module.exports = mongoose.model("invoiceDetails", InvoiceDetailsSchema);
