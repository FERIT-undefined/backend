module.exports = patch;
const User = require("../schema");
const bcrypt = require("bcryptjs");
const role = require("../../_helpers/role");

async function patch(req, res) {
  const id = req.params.id;
  const accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  if (id == null || id.length != 24) return res.status(400).send("Invalid ID!");

  delete req.body.accessToken;
  delete req.body.refreshToken;
  delete req.body.userId;

  const updates = Object.keys(req.body);

  const allowedUpdates = ["fname", "lname", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates!");
  }

  if (req.body.email) {
    const isValid = validateEmail(req.body.email);
    if (!isValid) return res.status(400).send("Wrong email format!");
  }

  if (req.body.password) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    req.body.password = passwordHash;
  }

  try {
    const user = await User.findOne({
      refreshToken,
    });
    if (user && (user.id == id || user.role == role.Admin)) {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.sendStatus(404);
      } else {
        return res.json({
          user: {
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            email: updatedUser.email,
            accessToken,
            refreshToken,
          },
        });
      }
    } else {
      return res.sendStatus(403);
    }
  } catch (error) {
    return res.status(400).send(error);
  }
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
