var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Teacher = require("../models/teacher");
//get chapters by course
router.get("get-chapters/:id_course", async (req, res) => {
  try {
    const course = await Course.findOne()
      .where(id)
      .equals(req.params.id_course);

    if (!course) {
      return res.status(500).json({
        success: false,
        message: "could not find course",
      });
    } else {
      const chapters = await Chapter.find().where("course").equals(course.id);
      if (!chapters) {
        return res.status(500).json({
          success: false,
          message: "this course does not have any courses yet !",
        });
      } else {
        return res.status(200).json({
          success: true,
          chapter: chapters,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
