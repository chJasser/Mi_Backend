const JsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const nodemailer = require("nodemailer");

module.exports.validatePassword = (password, hashedP) => {
  let match = bcrypt.compare(password, hashedP);
  // console.log(match);
  return match;
};

module.exports.issueJWT = (user) => {
  const _id = user._id;
  const role = user.role;
  const expiresIn = "15d";
  const payload = {
    _id: _id,
    email: user.email,
    user_role: role,
  };

  const signedToken = JsonWebToken.sign(payload, process.env.JWT_SEC, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};




const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check");
  transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:5050/authentication/${confirmationCode}> Click here</a>
        </div>`,
  }).catch(err => console.log(err));
};

module.exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          // return;
        }
        else {
          res.redirect('login.html');
        }
      });
    })
    .catch((e) => console.log("error", e));
};