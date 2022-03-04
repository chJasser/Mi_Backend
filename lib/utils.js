const JsonWebToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
