module.exports = list;
const User = require("../schema");
const role = require("../../_helpers/role");

async function list(req, res) {

  const authorizedUser = await User.findOne({
    refreshToken: req.body.refreshToken,
  });
  
  if (authorizedUser && authorizedUser.role == role.Admin) {

    User.find({})
      .then((data) => {
        if (!data) {
          return res.json({
            error: "There are no users in a database!",
          });
        } else {
          data = data.map(function (user) {
              return {
                id: user._id,
                fname: user.fname,
                lname: user.lname,
                role: user.role,
              }
          });
          return res.json({ data });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: "Could not retrieve users" });
      });
  } else return res.sendStatus(403);
}
