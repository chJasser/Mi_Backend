var express = require("express");
var router = express.Router();
const Reclamtion = require("../models/reclamation");
router.get("/", (req, res) => {
    console.log("getting reclamtions");
    Reclamtion.find((err, reclamtion) => {
      console.log(reclamtion);
    });
  });


module.exports = router;
