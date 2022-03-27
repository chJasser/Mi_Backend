var express = require("express");
var router = express.Router();
const Product = require("../models/product");
const InvoiceDetails = require("../models/invoiceDetails");

router.get("/", (req, res) => {
  InvoiceDetails.find((err, invoice_details) => {
    res.json(invoice_details);
  });
});

router.post("/:id", (req, res) => {
  let InvoiceDetail = {};
  Product.findById(req.params.id)
    .then((product) => {
      InvoiceDetail.product = product.id;
      InvoiceDetail.quantity = req.body.quantity;
      InvoiceDetail.totalBeforeDiscount =
        InvoiceDetail.quantity * product.price;
      InvoiceDetail.discount =
        InvoiceDetail.totalBeforeDiscount * product.discountPercent;
      InvoiceDetail.totalAfterDiscount =
        InvoiceDetail.totalBeforeDiscount - InvoiceDetail.discount;
      const InvoiceDetaill = new InvoiceDetails({
        //InvoiceDetail
        product: InvoiceDetail.product,
        quantity: InvoiceDetail.quantity,
        totalBeforeDiscount: InvoiceDetail.totalBeforeDiscount,
        discount: InvoiceDetail.discount,
        totalAfterDiscount: InvoiceDetail.totalAfterDiscount,
      });

      InvoiceDetaill.save((err, invoice_details) => {
        if (err) {
          res.json(err.message);
        }
        res.json(invoice_details);
      });
    })
    .catch((err) => console.log(err.message));
});

// Get total Price
router.get("/total", (req, res)=>{
  Product.find().then((products) => {
    let total = 0;
    let quantity = req.body.quantity;
    products.forEach((product) => {
      total += quantity * product.price;
      res.json(total);
    });
    
  })
  .catch((err) => console.log(err.message));

})

module.exports = router;
