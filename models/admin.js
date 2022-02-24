const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const extendSchema = require("./mongoose-extend-schema");
const userSchema = User.schema();

const AdminSchema = extendSchema(userSchema, {
  isAdmin: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("admin", AdminSchema);
