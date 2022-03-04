const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { userValidator } = require("../validators/userValidator");

const jwtSecret = "secret"

//REGISTER
router.post("/register", userValidator, async (req, res) => {
  originalPassword = req.body.password;
  let hashedPassword;

  await bcrypt
    .hash(originalPassword, 10)
    .then((hashed) => {
      hashedPassword = hashed;
    })
    .catch((err) => {
      console.log(err);
    });

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.firstName + " " + req.body.lastName,
    email: req.body.email,
    birthDate: req.body.birthDate,
    sex: req.body.sex,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    profilePicture: req.body.profilePicture,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.body.userName,
    });

    if (!user) {
      return res.status(401).json("invalid User Name");
    }

    bcrypt.compare(req.body.password, user.password, (err, match) => {
      if (!match) {
        return res.status(401).json("Wrong Password");
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
       // process.env.JWT_SEC,
        jwtSecret,
        { expiresIn: "3d" }
      );
      const { password, ...others } = user._doc;
      return res.status(200).json({ ...others, accessToken });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
