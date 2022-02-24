const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  state: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  invoiceDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoiceDetails",
    },
  ],
});
module.exports = mongoose.model("invoice", InvoiceSchema);
