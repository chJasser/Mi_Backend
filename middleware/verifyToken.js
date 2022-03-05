const dotenv = require("dotenv").config();
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


module.exports = {
  verifyToken,
  verifyTokenAndTeacher,
  verifyTokenAndAdmin,
  verifyTokenAndStudent,
  verifyTokenAndSeller,
  verifyTokenAndAuthorization,
  
};
