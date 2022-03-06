var express = require("express");
const { validationResult } = require("express-validator");
var router = express.Router();
const Teacher = require("../models/teacher");
const { auth } = require("../lib/utils");
const { teacherValidator } = require("../validators/teacherValidator");
const {
  verifyTokenTeacher,
  verifyTokenSeller,
  verifyTokenStudent,
  verifyTokenSuper,
  verifyTokenAdmin,
  verifyPassword,
} = require("../middleware/verifyToken");

router.post("/register", [auth, teacherValidator], async (req, res) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) return res.status(403).json(errors);

  const { about, degrees, rib } = req.body;
  const newTeacher = new Teacher({
    about,
    degrees,
    rib,
    user: req.user._id,
  });
  try {
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET blocked teachers . */
router.get("/block", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    await Teacher.find()
      .populate("user")
      .exec((err, teachers) => {
        const teachersBlocked = teachers.filter((teacher) => {
          return teacher.user.isBlocked == true;
        });
        if (teachersBlocked.length) {
          res.json(teachersBlocked);
        } else {
          res.json("no blocked teachers");
        }
      });
  } catch (error) {
    res.json(error.message);
  }
});
// block teacher
router.put("/block/:status/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    let teacherToBeBlocked = await Teacher.findById(req.params.id).populate(
      "user"
    );
    console.log(req.params.status);
    if (!teacherToBeBlocked) {
      return res.status(404).json("there is no teacher with this ID");
    } else {
      if (teacherToBeBlocked.user.isBlocked.toString() !== req.params.status) {
        teacherToBeBlocked = await User.findByIdAndUpdate(
          teacherToBeBlocked.user,
          {
            isBlocked: req.params.status,
          }
        );
        return res.json("teacher updated successfully");
      } else if (req.params.status) {
        return res.json("teacher already disblocked");
      } else {
        return res.json("teacher already blocked");
      }
    }
  } catch (error) {
    res.json(error.message);
  }
});

/* GET teachers . */
router.get("/", [auth, verifyTokenAdmin], async (req, res) => {
  const teachers = await Teacher.find({});
  if (!teachers.length) return res.status(404).json("no teachers found");
  res.json(teachers);
});

router.get("/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json("there is no teacher with this ID");
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const teacherToBeDeleted = await Teacher.findById(req.params.id);
    if (teacherToBeDeleted) {
      await User.findByIdAndDelete(teacherToBeDeleted.user);
      await Teacher.findByIdAndDelete(req.params.id);
      return res.json("deleted successfully");
    } else {
      return res.status(404).json("there is no teacher with this ID");
    }
  } catch (error) {
    return res.json(error.message);
  }
});

module.exports = router;
