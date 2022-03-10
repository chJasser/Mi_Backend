var express = require("express");
var router = express.Router();

const InvoiceDetails = require("../models/invoiceDetails");
router.get("/", (req, res) => {
  console.log("getting invoice_details");
  InvoiceDetails.find((err, invoice_details) => {
    console.log(invoice_details);
  });
});

module.exports = router;
