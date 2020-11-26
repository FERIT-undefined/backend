module.exports = login;
const User = require("../schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    let passwordHash = user.password;
    if (bcrypt.compareSync(req.body.password, passwordHash)) {
      const payload = {
        user: {
          id: user.id,
        },
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      user.refreshToken = refreshToken;

      await user.save();

      return res.json({
        user:{
          fname: user.fname,
          lname: user.lname,
          role: user.role,
          accessToken,
          refreshToken: user.refreshToken,
        },
      });
    }
  }
  return res.status(401).json({ error: "Invalid user credentials" });
}
