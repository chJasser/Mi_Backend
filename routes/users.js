var express = require("express");
var router = express.Router();
const User = require("../models/user");
const { auth, multerUpload } = require("../lib/utils");

/* GET blocked users . */
router.get("/block", auth, async (req, res) => {
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
router.put("/block/:id", auth, async (req, res) => {
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
router.get("/", auth, async (req, res) => {
  const users = await User.find({});
  if (!users.length) return res.status(404).json("no users found");
  res.json(users);
});

/* GET user by id . */
router.get("/:id", auth, async (req, res) => {
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
router.delete("/:id", auth, async (req, res) => {
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
router.put(
  "/updateProfile/:id",
  auth,
  multerUpload.single("picture"),
  (req, res) => {
    try {
      console.log(req.user);
      if (req.user.id === req.params.id) {
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
        } = req.body;
        let userFields = {};
        if (firstName) userFields.firstName = firstName;
        if (lastName) userFields.lastName = lastName;
        if (email) userFields.email = email;
        if (birthDate) userFields.birthDate = birthDate;
        if (sex) userFields.sex = sex;
        if (phoneNumber) userFields.phoneNumber = phoneNumber;
        if (address) userFields.address = address;
        if (req.file) userFields.profilePicture = req.file.path;
        console.log("im here");
        User.findByIdAndUpdate(req.user.id, {
          $set: userFields,
        })
          .then((result) => {
            res.status(200).json("updated successfully !");
          })
          .catch((error) => {
            return res.status(500).json("error !");
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
