module.exports = remove;
const User = require("../schema");
const role = require("../../_helpers/role");

async function remove(req, res) {
  const id = req.params.id;
  if (id == null || id.length != 24) return res.sendStatus(400);

  const authorizedUser = await User.findOne({
    refreshToken: req.body.refreshToken,
  });
  if (authorizedUser && authorizedUser.role == role.Admin) {
    if (authorizedUser.id == id) return res.sendStatus(409);
    User.findByIdAndRemove(id)
      .then((data) => {
        if (!data) {
          return res
            .status(500)
            .json({ error: "User with given id doesn't exist in the database!" });
        } else {
          return res.send({
            msg: "User successfully deleted!",
          });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Could not delete user with id=" + id });
      });
  } else return res.sendStatus(403);
}
