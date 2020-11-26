module.exports = register;
const role = require("../../_helpers/role");
const User = require("../schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(400).json({ error: "Email already in use" });
  }
  const newUser = new User();
  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  newUser.fname = req.body.fname;
  newUser.lname = req.body.lname;
  newUser.email = req.body.email;
  newUser.role = req.body.role.toLowerCase() == "admin" ? role.Admin : role.User;
  newUser.password = passwordHash;

  try {
    const savedUser = await newUser.save();
    const payload = {
      user: {
        id: savedUser.id,
      },
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    savedUser.refreshToken = refreshToken;

    const user = await savedUser.save();

    return res.json({
      user:{
        fname: user.fname,
        lname: user.lname,
        role: user.role,
        accessToken,
        refreshToken: user.refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
