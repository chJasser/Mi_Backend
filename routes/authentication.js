const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
const {
  validatePassword,
  issueJWT,
  sendConfirmationEmail,
  verifyUser,
  resetPassword,
  auth,
} = require("../lib/utils");
const { userValidator } = require("../validators/userValidator");
const { validationResult } = require("express-validator");
var crypto = require("crypto");



// register user

router.post("/register", [userValidator], async (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Object missing" });
  } else {
    const errors = validationResult(req).errors;
    if (errors.length !== 0) return res.status(400).json(errors);
    else {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "email already used" });
      } else {
        const {
          firstName,
          lastName,
          email,
          password,
          birthDate,
          sex,
          profilePicture,
          phoneNumber,
          address,
          role,
        } = req.body;
        let hashedPassword = await bcrypt.hash(password, 10);
        let user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          birthDate: birthDate,
          sex: sex,
          role: role,
          address: address,
          profilePicture: profilePicture,
          phoneNumber: phoneNumber,
          userName: firstName + " " + lastName,
        });
        const userToken = issueJWT(user);
        user.confirmationCode = userToken.token.substring(7);
        user.save((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.status(200).json({
            message:
              "User was registered successfully! Please check your email",
            user_id: user._id
          });

          sendConfirmationEmail(
            lastName + " " + firstName,
            user.email,
            user.confirmationCode
          );
        });
      }
    }
  }
});



// verify email

router.get("/email/:confirmationCode", verifyUser);

// local login (email and password)
router.post("/login", (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).json({ success: false, message: "email and password are missing" });
  }
  if (!req.body.password) {
    return res.status(500).json({ success: false, message: "password is missing" });
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, message: "you need to register first" });
      } else if (user.status != "Active") {
        return res.status(401).json({
          success: false, message: "Pending Account. Please Verify Your Email!",
        });
      } else {
        validatePassword(req.body.password, user.password).then((match) => {
          if (match) {
            const userToken = issueJWT(user);
            res.status(200).json({
              success: true,
              token: userToken.token,
              expiresIn: userToken.expires,
            });
          } else {
            res.status(401).json({ success: false, message: "wrong password !" });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

router.get("/protected", [auth], (req, res, next) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});
/**
 *
 *
 * Fb login
 *
 */

router.get(
  "/",

  (req, res) => {
    res.send(
      '<a href="/authentication/facebook">sign in with fb</a><br><a href="/authentication/google">sign in with google</a><br><a href="/authentication/github">sign in with github</a>'
    );
  }
);
router.get("/facebook", passport.authorize("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login", session: false

  }),
  (req, res) => {
    const email = req.user.emails[0].value;

    try {
      User.findOne({ email: email }).then((match, noMatch) => {
        if (match) {
          const accessToken = issueJWT(match);
          res.redirect("http://localhost:3000/?token=" + accessToken.token);

        } else {
          const { familyName, givenName } = req.user.name;
          let newUser = new User({
            userName: givenName + " " + familyName,
            firstName: givenName,
            lastName: familyName,
            email: email,
          });
          newUser.save().then((done, err) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "errors has occurred",
              });
            } else {
              const tokenForNewUser = issueJWT(done);
              return res.status(200).json({
                success: true,
                token: tokenForNewUser.token,
                expiresIn: tokenForNewUser.expires,
              });
            }
          });
        }
      });
    } catch (error) {
      res.json("error");
    }
  }
);


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000")
})

/**
 *
 *
 * google login
 *
 */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const email = req.user.emails[0].value;

    try {
      User.findOne({ email: email }).then((match, noMatch) => {
        if (match) {
          const accessToken = issueJWT(match);
          res.redirect("http://localhost:3000/?token=" + accessToken.token);
        } else {
          const { familyName, givenName } = req.user.name;
          let newUser = new User({
            userName: givenName + " " + familyName,
            firstName: givenName,
            lastName: familyName,
            email: email,
          });
          newUser.save().then((done, err) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "errors has occurred",
              });
            } else {
              const tokenForNewUser = issueJWT(done);
              return res.status(200).json({
                success: true,
                token: tokenForNewUser.token,
                expiresIn: tokenForNewUser.expires,
              });
            }
          });
        }
      });
    } catch (error) {
      res.json("error");
    }
  }
);
/**
 *
 *
 * github
 */

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login", session: false }),
  function (req, res) {
    const email = req.user.emails[0].value;
    try {
      User.findOne({ email: email }).then((match, noMatch) => {
        if (match) {
          const accessToken = issueJWT(match);
          res.redirect("http://localhost:3000/?token=" + accessToken.token);
        } else {
          // const { familyName, givenName } = req.user.name;
          let newUser = new User({
            userName: req.user.username,
            // firstName: givenName,
            // lastName: familyName,
            email: email,
          });
          newUser.save().then((done, err) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "errors has occurred",
              });
            } else {
              const tokenForNewUser = issueJWT(done);
              return res.status(200).json({
                success: true,
                token: tokenForNewUser.token,
                expiresIn: tokenForNewUser.expires,
              });
            }
          });
        }
      });
    } catch (error) {
      res.json("error");
    }
  }
);


router.put("/resetpassword/:email", async (req, res) => {
  let user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(400).json({ success: false, message: "user not found !" });
  } else {
    var id = crypto.randomBytes(4).toString('hex');
    User.findByIdAndUpdate(
      user._id,
      { $set: { resetPasswordCode: id.toUpperCase() } },
      { useFindAndModify: false },
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          resetPassword(
            user.lastName + " " + user.firstName,
            user.email,
            id.toUpperCase()
          ); return res.status(200).json({ success: false, email: user.email, });

        }
      }
    );
  }
});



router.put("/reset", async (req, res) => {

  if (!req.body.code) res.json("code is required");
  if (req.body.password) var hashedPassword = await bcrypt.hash(req.body.password, 10);
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ success: false, message: "User Not found." });
      }
      if (user.resetPasswordCode.toUpperCase() == req.body.code.toUpperCase()) {

        const {
          password,
          confirmPassword
        } = req.body;
        if (password && confirmPassword) {
          if (password == confirmPassword) {

            User.findByIdAndUpdate(
              user._id,
              { $set: { password: hashedPassword, resetPasswordCode: null } },
              { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  console.error(err);
                }
                else {
                  res.status(200).json({ success: true, message: "your password has been updated" });
                }
              }
            );
          } else {
            res.status(400).json({ success: false, message: "passwords not match" });
          }
        } else {
          res.status(400).json({ success: false, message: "password and confirmPassword are required" });
        }
      } else {
        res.status(400).json({ success: false, message: "code incorrect" });
      }


    })
    .catch((e) => console.log("error", e));
})





module.exports = router;
