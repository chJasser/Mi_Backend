var express = require("express");
var router = express.Router();
const RateCourseSchema = require("../models/rateCourse");
const Course = require("../models/course");
const User = require("../models/user");
const { auth } = require("../lib/utils");
var ObjectId = require("mongoose").Types.ObjectId;
//get all
router.get("/", (req, res) => {
  RateCourseSchema.find()
    .then((rates) => res.status(200).json(rates))
    .catch((err) => res.status(400).json(err));
});
//get by id
router.get("/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });}
   RateCourseSchema.find({id:req.params.id})
    .then((rates) => res.status(200).json(rates))
    .catch((err) => res.status(400).json(err));
});
router.get("/rate/:id",auth, (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  RateCourseSchema.find({ id: req.params.id,user:req.user.id })
    .then((rates) => res.status(200).json(rates))
    .catch((err) => res.status(400).json(err));
});
//rate a course
router.post("/:id/:rate", auth, async (req, res) => {
   if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });}
  const course = await Course.findById(req.params.id);
  const user = await User.findById(req.user.id);
  const courseRate = await RateCourseSchema.findOne({
    user: req.user.id,
    course: req.params.id,
  });
  if (!course) {
    return res
      .status(400)
      .json({ success: false, message: "could not find course" });
  }
  if (!courseRate) {
    new RateCourseSchema({
      user: req.user.id,
      course: req.params.id,
      rate: req.params.rate,
    })
      .save()
      .then((course) =>
        res.status(201).json({
          success: true,
          message: "courses rated !",
          courseRate: course,
        })
      )
      .catch((err) => res.status(400).json(err));
  } else {
    RateCourseSchema.findByIdAndUpdate(courseRate._id, {
      $set: { rate: req.params.rate },
    })
      .then(() =>
        res.status(201).json({
          success: true,
          message: "rate update !",
        })
      )
      .catch((err) => res.status(400).json(err));
  }
});
//delete Rate
router.delete("/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  } else {
    const courseRate = await RateCourseSchema.findOne({
      user:req.user.id,
      course:req.params.id
    });
    if (!courseRate) {
      return res.status(400).json({
        success: false,
        message: "could not find course",
      });
    } else {
      RateCourseSchema.findByIdAndDelete(courseRate._id)
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "deleted successfully !" });
        })
        .catch((err) => {
          return res.status(400).json({ success: false, message: err.message });
        });
    }
  }
});
//get rate of course
router.get("/rate/:id", async(req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  const course = await Course.findById(req.params.id);
   if (!course) {
     return res
       .status(400)
       .json({ success: false, message: "could not find course" });
   }
  RateCourseSchema.aggregate([{ $match: { course: ObjectId(req.params.id) } }])
    .group({ _id: "$course", totalRate: { $avg: "$rate" } })
    .project({ totalRate: 1, _id: 0 })
    .then((rate) => res.status(200).json(rate))
    .catch((err) => res.status(400).json(err));
});
//sort by course 1asc -1desc
router.get("/sort/:order", async(req, res) => {
   RateCourseSchema.aggregate()
     .group({ _id: "$course", totalRate: { $avg: "$rate" } })
     .sort({ totalRate: req.params.order})
     .then((rate) => res.status(200).json(rate))
     .catch((err) => res.status(400).json(err));
});
module.exports = router;
