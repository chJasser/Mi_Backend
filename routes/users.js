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
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    res.status(200).json({ success: true, user: user });
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



router.put(
  "/updateimg/:id",
  auth,
  multerUpload.single("picture"),

  async (req, res) => {
    console.log(req.params.id);
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
              { $set: { profilePicture: req.file.path } },
              { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  res.status(500).json({ success: false, message: err.message });
                }
                else {
                  res.status(200).json({ success: true, image: req.file.path });
                }
              }
            );
          }
        })
        .catch((err) => console.log(err.message));

    }
  }
);





// router.put(
//   "/updateProfile/:id",
//   auth,
//   multerUpload.single("picture"),
//   async (req, res) => {
//     try {
//       // if (req.user.id === req.params.id) {
//       const {
//         firstName,
//         lastName,
//         email,
//         birthDate,
//         sex,
//         phoneNumber,
//         address,
//         // password,
//       } = req.body;
//       let userFields = {};
//       // let hashedPassword = await bcrypt.hash(password, 10);
//       if (firstName) userFields.firstName = firstName;
//       if (lastName) userFields.lastName = lastName;
//       if (email) userFields.email = email;
//       if (birthDate) userFields.birthDate = birthDate;
//       if (sex) userFields.sex = sex;
//       if (phoneNumber) userFields.phoneNumber = phoneNumber;
//       if (address) userFields.address = address;
//       // if (password) userFields.password = hashedPassword;
//       if (req.file) userFields.profilePicture = req.file.path;
//       User.findByIdAndUpdate(req.params.id, {
//         $set: userFields,
//       })
//         .then((result) => {
//           res.status(200).json("updated successfully !");
//         })
//         .catch((error) => {
//           return res.status(500).json(error.message);
//         });
//       // } else {
//       // res
//       //   .status(400)
//       //   .json(
//       //     "not the same id that you logged in with ... something went wrong !"
//       //   );
//       // }
//     } catch (error) {
//       return res.status(500).json(error.message);
//     }
//   }
// );

module.exports = router;
