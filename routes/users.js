var express = require("express");
const User = require("../models/user");
const { auth, multerUpload } = require("../lib/utils");
const bcrypt = require("bcrypt");
var router = express.Router();
const {
  verifyPassword,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const { validationResult, check } = require("express-validator");
const { upload } = require("../lib/utils");

/* GET blocked users . */
router.get("/block", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const users = await User.find({ isBlocked: true }).exec();
    if (users.length) {
      res.json(users);
    } else {
      res.json("no blocked users");
    }
  } catch (error) {
    res.json(error.message);
  }
});
/* GET blocked user . */
router.put("/block/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    let userToBeBlocked = await User.findById(req.params.id);

    if (userToBeBlocked && userToBeBlocked.role !== "admin") {
      userToBeBlocked = await User.findByIdAndUpdate(userToBeBlocked._id, {
        isBlocked: true,
      });
      return res.json("user blocked successfully");
    } else {
      return res.json("you're not allowed to do that !");
    }
  } catch (error) {
    res.json(error.message);
  }
});
/* GET users . */
router.get("/", [auth, verifyTokenAdmin], async (req, res) => {
  const users = await User.find({});
  if (!users.length) return res.status(404).json("no users found");
  res.json(users);
});

// find user with email
router.get("/email/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (!user) return res.status(404).json("no user found");
    res.json(user);
  });
});

/* GET user by id . */
router.get("/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("there is no user with this ID");
    }
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

/* delete user by id . */
router.delete("/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const userToBeDeleted = await User.findById(req.params.id);
    if (userToBeDeleted) {
      if (userToBeDeleted.role == "admin") {
        return res.json("you're not allowed to do that");
      } else {
        await User.findByIdAndDelete(userToBeDeleted._id);
        return res.json("deleted successfully");
      }
    }
  } catch (error) {
    return res.json(error.message);
  }
});
const validator = [
  check(
    "firstName",
    "first name must be between 4 characters and 15 characters"
  )
    .isLength({ min: 4, max: 15 })
    .optional(),
  check("lastName", "last name must be between 4 characters and 15 characters")
    .isLength({ min: 4, max: 15 })
    .optional(),
  check("email", "email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .optional(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number")
    .optional(),

  check("phoneNumber", "phone number is required")
    .isLength({
      min: 8,
    })
    .optional(),
];
router.put(
  "/updateProfile/:id",
  [auth, validator],
  multerUpload.single("picture"),
  async (req, res) => {
    try {
      if (req.user.id === req.params.id) {
        const {
          firstName,
          lastName,
          email,
          birthDate,
          sex,
          phoneNumber,
          address,
          password,
        } = req.body;
        let userFields = {};
        let hashedPassword = await bcrypt.hash(password, 10);
        if (firstName) userFields.firstName = firstName;
        if (lastName) userFields.lastName = lastName;
        if (email) userFields.email = email;
        if (birthDate) userFields.birthDate = birthDate;
        if (sex) userFields.sex = sex;
        if (phoneNumber) userFields.phoneNumber = phoneNumber;
        if (address) userFields.address = address;
        if (password) userFields.password = hashedPassword;
        if (req.file) userFields.profilePicture = req.file.path;
        console.log("im here");
        User.findByIdAndUpdate(req.user.id, {
          $set: userFields,
        })
          .then((result) => {
            res.status(200).json("updated successfully !");
          })
          .catch((error) => {
            return res.status(500).json(error.message);
          });
      } else {
        res
          .status(400)
          .json(
            "not the same id that you logged in with ... something went wrong !"
          );
      }
    } catch (error) {
      return res.status(500).json("error !");
    }
  }
);
module.exports = router;
