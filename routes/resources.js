var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const Chapter = require("../models/chapter");
const Teacher = require("../models/teacher");
const Resource = require("../models/resource");
const Course = require("../models/course");
const upload = require("../middleware/chapterUpload");
router.get("/:id", (req, res) => {
  Resource.find({ chapter: req.params.id })
    .then((data) => res.status(200).json(data))
    .catch((err) => json.status(400).json(err));
});
router.post("/:id", auth, upload, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const chapter = await Chapter.findById(req.params.id);
  const course = await Course.findById(chapter.course);
  if (!chapter) res.status(400).json("no chapter found");
  if (!teacher) res.status(400).json("you are not teacher");
  console.log(teacher);
  if (teacher._id.toString() === course.teacher.toString()) {
    new Resource({ ...req.body, path: req.file.filename, chapter: chapter._id })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(400).json(err));
  } else res.status(400).json("you are not the owner of the course");
});
module.exports = router;
