const role = require("../../_helpers/role");
const User = require("../schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');

const serializer = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string(),
  fname: Joi.string().required(),
  lname: Joi.string().required(),
});

async function register(req, res, next) {

  const result = serializer.validate(req.body);
  if(result.error) {
    return res.status(400).send(result.error);
  }

  const userExist = await User.findOne({ email: result.value.email });
  if (userExist) {
    return res.status(400).json({ error: "Email already in use" });
  }
  const newUser = new User();
  const passwordHash = bcrypt.hashSync(result.value.password, 10);

  if(!result.value.role){
    result.value.role = "User"
  }

  newUser.fname = result.value.fname;
  newUser.lname = result.value.lname;
  newUser.email = result.value.email;
  newUser.role = result.value.role.toLowerCase() == "admin" ? role.Admin : role.User;
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
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        role: user.role,
        accessToken,
        refreshToken: user.refreshToken,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

module.exports = register;