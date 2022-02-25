const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Invoice", InvoiceSchema);
