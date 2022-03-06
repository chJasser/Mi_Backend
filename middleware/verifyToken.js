const { validatePassword } = require("../lib/utils");

const verifyTokenTeacher = (req, res, next) => {
  if (req.user.role === "teacher" || req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a teacher",
    });
  }
};

const verifyTokenSeller = (req, res, next) => {
  if (req.user.role === "seller" || req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a seller",
    });
  }
};

const verifyTokenStudent = (req, res, next) => {
  if (req.user.role === "student" || req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a student",
    });
  }
};
const verifyTokenAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "super_admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not an admin",
    });
  }
};
const verifyTokenSuper = (req, res, next) => {
  if (req.user.role === "super_admin") {
    next();
  }
};

const verifyPassword = (req, res, next) => {
  if (req.body.oldPassword == undefined || req.body.oldPassword == "") {
    res.status(401).json({ success: false, msg: "password is required !" });
  } else {
    User.findById(req.params.id)
      .then((user) => {
        validatePassword(req.body.oldPassword, user.password).then((match) => {
          if (match) {
            next();
          } else {
            res.status(401).json({ success: false, msg: "wrong password !" });
          }
        });
      })
      .catch((e) => console.log("error", e));
  }
};

module.exports = {
  verifyTokenTeacher,
  verifyTokenSeller,
  verifyTokenStudent,
  verifyTokenSuper,
  verifyTokenAdmin,
  verifyPassword,
};
