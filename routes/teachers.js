var express = require("express");
const { validationResult } = require("express-validator");
var router = express.Router();
const Teacher = require("../models/teacher");
const { auth, multerUpload } = require("../lib/utils");
const { teacherValidator } = require("../validators/teacherValidator");
const {
  verifyTokenAdmin,
} = require("../middleware/verifyToken");

router.post("/register",
  [auth],
  multerUpload.array("files"), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }
    let filesarray = [];
    req.files.forEach((element) => {
      filesarray.push(element.path);
    });

    const newTeacher = new Teacher({
      about: req.body.about,
      degrees: filesarray,
      rib: req.body.rib,
      user: req.user._id,
    });
    Teacher.findOne({ user: req.user._id }).then(teacher => {
      if (teacher) {
        return res.status(500).json({ success: false, message: "Account already exists !" });
      } else {
        newTeacher.save((err, newTeacher) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
            return;
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { role: "teacher" } },
            { useFindAndModify: false },
            (err, data) => {
              if (err) {
                return res.status(500).json({ success: false, message: err });
              }
              else {

                return res.status(200).json({ success: true, message: "Account was registered successfully !" });
              }
            }
          )
        });
      }
    }).catch(err => { console.log(err) });
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
