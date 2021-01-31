const mongoose = require("mongoose");
const role = require("../_helpers/role");

const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: role,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { collection: "users" }
);

userSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
  },
});

module.exports = mongoose.model("user", userSchema);
