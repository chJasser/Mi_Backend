const jwt = require("jsonwebtoken");

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
    if (req.user.id == req.params.id || req.user.role == "admin") {
      next();
    } else {
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
  verifyTokenSuper,
  verifyTokenAdmin,
};
