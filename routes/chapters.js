var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Resource = require("../models/resource");
const { auth, uploadAnything } = require("../lib/utils");
const { verifyTokenTeacher } = require("../middleware/verifyToken");

//get chapters by course
router.get("get-chapters/:id_course", auth, async (req, res) => {
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
router.post(
  "/add-chapter/:idCourse",
  auth,
  uploadAnything.array("files", 5),
  async (req, res) => {
    const title = req.body.title;
    if (!title)
      return res
        .status(404)
        .json({ success: false, message: "provide a title for this course" });
    const course = await Course.findById(req.params.idCourse);
    if (!course)
      return res
        .status(500)
        .json({ success: false, message: "no course found !" });

    const files = req.files;
    if (!files)
      return res
        .status(500)
        .json({ success: false, message: "no resources to add !" });
    let chapterToAdd = new Chapter({
      title: title,
      course: course._id,
    });
    chapterToAdd
      .save()
      .then((done) => {
        files.forEach((file) => {
          let resourceToAdd = new Resource({
            type: file.mimetype,
            path: file.path,
            chapter: done._id,
          });
          resourceToAdd.save().catch((err) => {
            return res.status(500).json({ success: false, message: err });
          });
        });
        return res.status(201).json({
          success: true,
          message: "resource added successfully",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });

    /**
     *
     *
     */
  }
);
module.exports = router;
