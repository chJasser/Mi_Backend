var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const Chapter = require("../models/chapter");
const Teacher = require("../models/teacher");
const Resource = require("../models/resource");
const Course = require("../models/course");
const { json } = require("body-parser");
router.get("/:id", (req, res) => {
  Resource.find({ chapter: req.params.id })
    .then((data) => res.status(200).json(data))
    .catch((err) => json.status(400).json(err));
});
router.post("/:id", auth, async (req, res) => {
  const teacher = await Teacher.find({ user: req.user.id });
  const chapter = await Chapter.findById(req.params.id);
  const course = await course.findById(chapter.course);
  if (!teacher) res.status(400).json("you are not teacher");
  if (teacher._id.ToString() === course.teacher.ToString()) {
  }
});

module.exports = router;
