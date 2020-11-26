module.exports = authenticateJWT;
const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.body.accessToken;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) {
      return res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.sendStatus(401);
      } else {
        const payload = {
          user: {
            id: data.user.id,
          },
        };
        req.body.userId = data.user.id;
        req.body.accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );
        next();
      }
    });
  });
}
