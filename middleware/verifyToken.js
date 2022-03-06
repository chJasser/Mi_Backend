const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const { validatePassword } = require("../lib/utils");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id == req.params.id || req.user.role == "admin") {
      next();
    }
    else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == "admin") {
      next();
    } else {
      res.status(403).json("You are not an admin to do that!");
    }
  });
};
/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

const verifyTokenAndTeacher = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == "teacher") {
      next();
    } else {
      res.status(403).json("You are not an teacher to do that!");
    }
  });
};

const verifyTokenAndStudent = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == "student") {
      next();
    } else {
      res.status(403).json("You are not an student to do that!");
    }
  });
};

const verifyTokenAndSeller = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == "seller") {
      next();
    } else {
      res.status(403).json("You are not an seller to do that!");
    }
  });
};


const verifyPassword = (req, res, next) => {
  if (req.body.oldPassword == undefined || req.body.oldPassword == "") {
    res.status(401).json({ success: false, msg: "password is required !" });
  }
  else {
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
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenTeacher,
  verifyTokenSeller,
  verifyTokenStudent,
  verifyPassword,
  verifyTokenSuper,
  verifyTokenAdmin,
};
