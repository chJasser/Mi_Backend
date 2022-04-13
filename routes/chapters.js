var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const { auth } = require("../lib/utils");
const Teacher = require("../models/teacher");

//get chapters by course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    console.log(course);
    if (!course) {
      res.status(500).json({
        success: false,
        message: "could not find course",
      });
    } else {
      Chapter.find({ course: course._id })
        .then((chapters) => res.status(200).json(chapters))
        .catch((err) => res.stauts(400).json(err));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//add chapter
router.post("/:idCourse", auth, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const course = await Course.findById(req.params.idCourse);
  if (!course)
    res.status(400).json({ success: false, message: "no course found !" });
  if (!teacher)
    res.status(400).json({ success: false, message: "your not a teacher" });
  if (teacher._id.toString() === course.teacher.toString()) {
    new Chapter({
      course: req.params.idCourse,
      ...req.body,
    })
      .save()
      .then(() =>
        res.status(200).json({ success: true, message: "chapter add" })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  } else
    res
      .status(400)
      .json({ success: false, message: "you are not the owner of the course" });
});
module.exports = router;
