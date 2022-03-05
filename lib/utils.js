const JsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
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
module.exports.auth = passport.authenticate("jwt", { session: false });
/**
 * 
 * 
 * 
 * 
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

module.exports.multerUpload = upload;
