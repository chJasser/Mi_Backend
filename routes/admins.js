var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const { verifyTokenAdmin } = require("../middleware/verifyToken");
const Admin = require("../models/admin");
router.get("/", [auth], (req, res) => {});

module.exports = router;
