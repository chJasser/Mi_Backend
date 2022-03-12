var express = require("express");
var router = express.Router();
const { courseValidator } = require("../validators/courseValidator");
const { validationResult } = require("express-validator");
var ObjectId = require("mongoose").Types.ObjectId;

const { auth } = require("../lib/utils");
const { verifyTokenTeacher } = require("../middleware/verifyToken");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const User = require("../models/user");

router.get("/get-courses", (req, res) => {
  Course.find().then((courses) => {
    res.status(200).json(courses);
  });
});
router.get("/get-course/:id", (req, res) => {
  Course.find({ _id: req.params.id })
    .then((course) => {
      res.status(200).json(course);
    })
    .catch((err) => res.status(500).json(err));
});
//get courses by teacher
router.get("/course-teacher/:id", async (req, res) => {
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

router.post("/add-course", [auth], async (req, res) => {
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
        return res.status(201).json({
          success: true,
          message: "courses created !",
          course: course,
        });
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
//update course

router.put("/update-course/:id", [auth], async (req, res) => {
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
  //get teacher related to the user logged in
  const teacher = await Teacher.findOne().where("user").equals(req.user.id);
  if (teacher) {
    //get Courses with the id related to the teacher
    let courseToUpdate = await Course.findOne()
      .where("_id")
      .equals(req.params.id);
    if (courseToUpdate.teacher.toString() == teacher._id.toString()) {
      Course.findByIdAndUpdate(req.params.id, {
        $set: Coursefeilds,
      })
        .then((course) => {
          return res.status(200).json({
            success: true,
            message: "course updated",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: "course did not update error :" + err.message,
          });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "you're not allowed to update a course that is not yours",
      });
    }
  } else {
    return res
      .status(500)
      .json({ success: false, message: "you're not a teacher" });
  }
});
//delete
router.delete("/delete-course/:id", [auth], async (req, res) => {
  const teacher = await Teacher.findOne().where("user").equals(req.user.id);

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(500).json({
      success: false,
      message: "invalid ID",
    });
  } else {
    const course = await Course.findOne().where("id").equals(req.params.id);
    if (!course) {
      return res.status(500).json({
        success: false,
        message: "could not find course",
      });
    }
    if (course.teacher.toString() == teacher._id.toString()) {
      Course.deleteOne()
        .where("id")
        .equals(course.id)
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "deleted successfully !" });
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "you're not allowed to delete this course",
      });
    }
  }
});

module.exports = router;
