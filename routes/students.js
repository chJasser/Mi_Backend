var express = require("express");
var router = express.Router();
const Student = require("../models/student");
const { auth } = require("../lib/utils");
const User = require("../models/user");

router.post("/register", [auth], (req, res) => {
  const newStudent = new Student({
    about: req.body.about,
    rib: req.body.rib,
    interestedIn: req.body.interestedIn,
    user: req.user._id,
  });
  Student.findOne({ user: req.user._id })
    .then((student) => {
      if (student) {
        return res
          .status(500)
          .json({ success: false, message: "Account already exists !" });
      } else {
        newStudent.save((err, student) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
            return;
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { role: "student" } },
            { useFindAndModify: false },
            (err, data) => {
              if (err) {
                return res.status(500).json({ success: false, message: err });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Account was registered successfully !",
                });
              }
            }
          );
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err });
    });
});

module.exports = router;
