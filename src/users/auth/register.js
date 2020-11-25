module.exports = register;
const role = require("../../_helpers/role");
const User = require("../schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  const userExist = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (userExist) {
    return res.json({ error: "Username or email already in use" });
  }
  const newUser = new User();
  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  newUser.username = req.body.username;
  newUser.email = req.body.email;
  newUser.role =
    req.body.role.toLowerCase() == "admin" ? role.Admin : role.User;
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
      accessToken,
      user,
    });
  } catch (err) {
    return res.json({ error: err });
  }
}
