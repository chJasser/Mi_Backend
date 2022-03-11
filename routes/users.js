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
router.get("/:id", async (req, res) => {
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


//update personal informations 

router.put(
  "/:id",
  [
    check("firstName", "first name must be between 4 characters and 15 characters")
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
      .withMessage("password must contain a number").optional(),

    check("phoneNumber", "phone number is required").isLength({
      min: 8,
    }).optional(),

  ],
  auth,
  verifyPassword,
  async (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(500).json("Object missing");
    } else {
      const errors = validationResult(req).errors;
      if (errors.length !== 0) return res.status(500).json(errors);
      else {
        const {
          firstName,
          lastName,
          userName,
          email,
          password,
          birthDate,
          sex,
          address,
          phoneNumber,
        } = req.body;
        let updateUser = {};
        if (firstName) updateUser.firstName = firstName;
        if (lastName) updateUser.lastName = lastName;
        if (userName) updateUser.userName = userName;
        if (email) updateUser.email = email;
        if (password) {
          let hashedPassword = await bcrypt.hash(password, 10);
          updateUser.password = hashedPassword;
        }
        if (birthDate) updateUser.birthDate = birthDate;
        if (sex) updateUser.sex = sex;
        if (address) updateUser.address = address;
        if (phoneNumber) updateUser.phoneNumber = phoneNumber;

        User.findById(req.params.id)
          .then((user) => {
            if (!user) {
              return res.json({ msg: "user not find" });
            }
            else {
              User.findByIdAndUpdate(
                req.params.id,
                { $set: updateUser },
                { useFindAndModify: false },
                (err, data) => {
                  if (err) {
                    console.error(err);
                    res.json({ msg: "email id used" });
                  }
                  else {
                    res.json({ msg: "user updated" });
                  }
                }
              );
            }
          })
          .catch((err) => console.log(err.message));
      }
    }
  }
);
router.put(
  "/img/:id",
  multerUpload.single("picture"),
  async (req, res) => {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(500).json("Object missing");
    } else {
      User.findById(req.params.id)
        .then((user) => {
          if (!user) {
            return res.json({ msg: "user not find" });
          }
          else {
            User.findByIdAndUpdate(
              req.params.id,
              { $set: { profilePicture: req.file.filename } },
             // { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  console.error(err);
                }
                else {
                  res.json({ msg: "user updated" });
                }
              }
            );
          }
        })
        .catch((err) => console.log(err.message));

    }
  }
);




router.put(
  "/updateProfile/:id",
  multerUpload.single("picture"),
  async (req, res) => {
    try {
      console.log(req.user);
      if (req.user.id === req.params.id)
       {
        const obj = JSON.parse(JSON.stringify(req.body));
        console.log(req.body.firstName);
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
        User.findByIdAndUpdate(req.params.id, {
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
