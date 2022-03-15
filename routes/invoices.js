var express = require("express");
var router = express.Router();

const Invoice = require("../models/invoice");
//var InvoiceDetails = require("../routes/invoiceDetails")
var InvoiceDetail = require("../models/invoiceDetails");

router.get("/", (req, res) => {
  Invoice.find((err, invoice) => {
    res.json(invoice);
  });
});

router.post("/:id", (req, res) => {
  let Inv = {};
  Inv.user = req.params.id;
  InvoiceDetail.find()
    .then((details) => {
      //res.json(details);
      Inv.total = 0;
      Inv.discount = 0;
      details.map((detail) => {
        Inv.total += detail.totalAfterDiscount;
        Inv.discount += detail.discount;
      });

      const newInvoice = new Invoice({
        user: Inv.user,
        total: Inv.total,
        discount: Inv.discount,
      });

      newInvoice.save((err, iv) => {
        if (err) {
          res.json(err.message);
        }
        res.json(iv);
      });
    })
    .catch((err) => console.log(err.message));
});

module.exports = router;
