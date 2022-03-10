var express = require("express");
var router = express.Router();
const { courseValidator } = require("../validators/courseValidator");
const { validationResult } = require("express-validator");

const { auth } = require("../lib/utils");
const { verifyTokenTeacher } = require("../middleware/verifyToken");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const User = require("../models/user");

router.get("/", (req, res) => {
  Course.find().then((courses) => {
    res.status(200).json(courses);
  });
});
router.get("/:id", (req, res) => {
  Course.find({ _id: req.params.id })
    .then((course) => {
      res.status(200).json(course);
    })
    .catch((err) => res.status(500).json(err));
});

router.get("/teacher/:id", async (req, res) => {
  Course.find()
    .where("teacher")
    .equals(req.params.id)
    .then((result) => {
      if (!result)
        res.status(404).json("this teacher does not have any courses yet !");
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});

router.post("/", [auth], async (req, res) => {
  const { label, description, duration, price, level, category, languages } =
    req.body;
  const Coursefeilds = {};
  if (label) Coursefeilds.label = label;
  if (category) Coursefeilds.category = category;
  if (description) Coursefeilds.description = description;
  if (price) Coursefeilds.price = price;
  if (duration) Coursefeilds.duration = duration;
  if (level) Coursefeilds.level = level;
  if (languages) Coursefeilds.languages = languages;
  const teacher = await Teacher.findOne().where("user").equals(req.user.id);
  console.log(teacher);
  if (teacher) {
    Coursefeilds.teacher = teacher.id;
    let course = new Course(Coursefeilds);
    course
      .save()
      .then((course) => {
        return res
          .status(201)
          .json({ success: true, message: "courses created !" });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  } else {
    return res
      .status(500)
      .json({ success: false, message: "you're not logged in as a teacher" });
  }
});

module.exports = router;
