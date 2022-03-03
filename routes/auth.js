const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cryptPassword = async (password) => {
  await bcrypt.hash(password, 10, (err, hashedPassword) => {
    return hashedPassword;
  });
};

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptPassword(req.body.password),
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

    !user && res.status(401).json("Wrong User Name");

    bcrypt.compare(user.password, req.body.password, (err, match) => {
      if (match) {
        const accessToken = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
