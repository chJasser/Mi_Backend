var express = require("express");
var router = express.Router();

const Invoice = require("../models/invoice");
router.get("/", (req, res) => {
  console.log("getting invoice");
  Invoice.find((err, invoice) => {
    console.log(invoice);
  });
});

module.exports = router;
